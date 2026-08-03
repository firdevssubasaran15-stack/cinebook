import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert, Image as RNImage } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { sharedListsApi } from '@/api/endpoints/shared-lists.api';
import { usersApi } from '@/api/endpoints/users.api';
import { contentApi } from '@/api/endpoints/content.api';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';
import ContentCard from '@/features/content/components/ContentCard';
import { API_BASE_URL } from '@/constants/api';

export default function SharedListDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { colors: COLORS } = useTheme();

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);

  // Invite Modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [inviteLoading, setInviteLoading] = useState(false);

  const [visibilityLoading, setVisibilityLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Content Add Modal
  const [showContentModal, setShowContentModal] = useState(false);
  const [contentSearchQuery, setContentSearchQuery] = useState('');
  const [contentSearchResults, setContentSearchResults] = useState([]);
  const [contentSearchLoading, setContentSearchLoading] = useState(false);

  useEffect(() => {
    fetchListDetails();
  }, [id]);

  const fetchListDetails = async () => {
    try {
      const res = await sharedListsApi.getListDetails(id);
      setList(res.data.data);
    } catch (err) {
      console.log('List detail error:', err.message);
      Alert.alert('Hata', 'Liste yüklenemedi. Yetkiniz olmayabilir.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSearchUsers = async (text) => {
    setSearchQuery(text);
    if (!text || text.length < 2) {
      setSearchResults([]);
      return;
    }
    setInviteLoading(true);
    try {
      const res = await usersApi.searchUsers(text);
      setSearchResults(res.data.data);
    } catch(err) {
      console.log('Search user error:', err.message);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleInviteUser = async (targetUserId) => {
    try {
      await sharedListsApi.inviteUser(id, targetUserId);
      Alert.alert('Başarılı', 'Kullanıcıya davet gönderildi!');
      setShowInviteModal(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      Alert.alert('Hata', err.message);
    }
  };

  const handleSearchContents = async (text) => {
    setContentSearchQuery(text);
    if (!text || text.length < 2) {
      setContentSearchResults([]);
      return;
    }
    setContentSearchLoading(true);
    try {
      if (list.type === 'watching') {
        const [movies, series] = await Promise.all([
          contentApi.getByType('movie', text),
          contentApi.getByType('series', text)
        ]);
        setContentSearchResults([...movies.data.data, ...series.data.data]);
      } else {
        const res = await contentApi.getByType('book', text);
        setContentSearchResults(res.data.data);
      }
    } catch (err) {
      console.log('Search content error:', err.message);
    } finally {
      setContentSearchLoading(false);
    }
  };

  const handleAddContent = async (contentId) => {
    try {
      await sharedListsApi.addContent(id, contentId);
      Alert.alert('Başarılı', 'İçerik listeye eklendi!');
      setShowContentModal(false);
      setContentSearchQuery('');
      setContentSearchResults([]);
      fetchListDetails();
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || err.message);
    }
  };

  const handleToggleVisibility = async () => {
    setVisibilityLoading(true);
    try {
      const res = await sharedListsApi.toggleVisibility(id);
      setList(prev => ({ ...prev, is_public: res.data.data.is_public }));
      Alert.alert('Başarılı', res.data.message);
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || 'Görünürlük değiştirilemedi.');
    } finally {
      setVisibilityLoading(false);
    }
  };

  const handleToggleSave = async () => {
    setSaveLoading(true);
    try {
      if (list.is_saved_by_user) {
        await sharedListsApi.unsaveList(id);
        setList(prev => ({ ...prev, is_saved_by_user: false }));
        Alert.alert('Başarılı', 'Liste kaydedilenlerden çıkarıldı.');
      } else {
        await sharedListsApi.saveList(id);
        setList(prev => ({ ...prev, is_saved_by_user: true }));
        Alert.alert('Başarılı', 'Liste başarıyla kaydedildi.');
      }
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || 'İşlem başarısız.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading || !list) {
    return <View className="flex-1 justify-center items-center bg-light-bg dark:bg-dark-bg"><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  const isOwner = list.owner_id === user?.id;
  const canAddContent = isOwner || list.members?.some(m => m.id === user?.id && m.status === 'accepted');

  return (
    <View className="flex-1 bg-light-bg dark:bg-dark-bg">
      <View className="flex-row items-center px-2 pt-12 pb-4 border-b bg-light-surfaceElevated border-light-border dark:bg-dark-surfaceElevated dark:border-dark-border">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Icon name="CaretLeft" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text className="text-lg font-bold flex-1 text-center text-text-lightPrimary dark:text-text-darkPrimary" numberOfLines={1}>
          {list.name}
        </Text>
        {isOwner ? (
          <TouchableOpacity onPress={handleToggleVisibility} className="p-2 flex-row items-center" disabled={visibilityLoading}>
            {visibilityLoading ? (
               <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
               <Icon name={list.is_public ? "Eye" : "LockKey"} size={22} color={COLORS.textPrimary} />
            )}
          </TouchableOpacity>
        ) : (
          <View className="p-2">
            <Icon name={list.is_public ? "Eye" : "LockKey"} size={22} color={COLORS.textMuted} />
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-sm text-text-lightSecondary dark:text-text-darkSecondary">
            {list.type === 'watching' ? '🎬 İzleme Listesi' : '📚 Okuma Listesi'}
          </Text>
          {isOwner && (
            <TouchableOpacity onPress={() => setShowInviteModal(true)} className="flex-row items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-primary">
              <Icon name="UserPlus" size={16} color="#fff" />
              <Text className="text-white text-xs font-bold">Davet Et</Text>
            </TouchableOpacity>
          )}
          {!isOwner && list.is_public === 1 && (
             <TouchableOpacity onPress={handleToggleSave} disabled={saveLoading} className={`flex-row items-center gap-1.5 px-3 py-2 rounded-xl ${list.is_saved_by_user ? 'bg-transparent border border-brand-primary' : 'bg-brand-primary'}`}>
                {saveLoading ? (
                  <ActivityIndicator size="small" color={list.is_saved_by_user ? COLORS.primary : '#fff'} />
                ) : (
                  <>
                    <Icon name={list.is_saved_by_user ? "Check" : "BookmarkSimple"} size={16} color={list.is_saved_by_user ? COLORS.primary : '#fff'} />
                    <Text className={`text-xs font-bold ${list.is_saved_by_user ? 'text-brand-primary' : 'text-white'}`}>{list.is_saved_by_user ? 'Kaydedildi' : 'Kaydet'}</Text>
                  </>
                )}
             </TouchableOpacity>
          )}
        </View>

        {/* Üyeler */}
        <Text className="text-base font-bold mb-3 mt-2 text-text-lightPrimary dark:text-text-darkPrimary">Üyeler ({list.members?.length || 0})</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 py-1">
          {list.members?.map(m => (
            <View key={m.id} className="w-16 items-center mr-4">
              <View className="w-10 h-10 rounded-full items-center justify-center mb-1 bg-light-surfaceElevated dark:bg-dark-surfaceElevated">
                {m.profile_image ? (
                  <RNImage source={{ uri: `${API_BASE_URL}${m.profile_image}` }} className="w-full h-full rounded-[20px]" />
                ) : (
                  <Text className="font-bold text-text-lightPrimary dark:text-text-darkPrimary">{m.username[0].toUpperCase()}</Text>
                )}
              </View>
              <Text className="text-[11px] w-full text-center text-text-lightSecondary dark:text-text-darkSecondary" numberOfLines={1}>@{m.username}</Text>
              <Text className={`text-[10px] ${m.status === 'owner' ? 'text-brand-primary' : 'text-text-lightMuted dark:text-text-darkMuted'}`}>
                {m.status === 'owner' ? 'Kurucu' : m.status === 'pending' ? 'Bekliyor' : 'Üye'}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* İçerikler */}
        <View className="flex-row justify-between items-center mb-3 mt-2">
          <Text className="text-base font-bold m-0 text-text-lightPrimary dark:text-text-darkPrimary">İçerikler ({list.contents?.length || 0})</Text>
          {canAddContent && (
            <TouchableOpacity onPress={() => setShowContentModal(true)} className="flex-row items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-primary/20">
              <Icon name="Plus" size={14} color={COLORS.primary} />
              <Text className="text-xs font-bold text-brand-primary">İçerik Ekle</Text>
            </TouchableOpacity>
          )}
        </View>
        {list.contents?.length === 0 ? (
          <View className="items-center mt-8 px-6">
            <Icon name="FolderOpen" size={48} color={COLORS.textMuted} weight="light" />
            <Text className="mt-3 text-text-lightSecondary dark:text-text-darkSecondary">Bu listede henüz içerik yok.</Text>
            <Text className="text-xs mt-1 text-center text-text-lightMuted dark:text-text-darkMuted">İçerik sayfalarındaki "Listeye Ekle" butonunu kullanarak buraya ekleme yapabilirsiniz.</Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {list.contents?.map(content => (
              <View key={content.id} className="w-[48%] mb-4">
                <ContentCard item={content} onPress={() => router.push(`/detail/${content.id}`)} />
                <Text className="text-[10px] mt-1 text-center text-text-lightMuted dark:text-text-darkMuted">Ekleyen: @{content.added_by_username}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Davet Modalı */}
      {showInviteModal && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center z-[100]">
          <View className="w-[90%] p-6 rounded-2xl bg-light-surfaceElevated dark:bg-dark-surfaceElevated">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-text-lightPrimary dark:text-text-darkPrimary">Kullanıcı Davet Et</Text>
              <TouchableOpacity onPress={() => setShowInviteModal(false)}><Icon name="X" size={24} color={COLORS.textSecondary} /></TouchableOpacity>
            </View>
            <View className="rounded-xl px-3 border mb-4 bg-light-bg border-light-border dark:bg-dark-bg dark:border-dark-border">
              <TextInput
                className="h-11 text-text-lightPrimary dark:text-text-darkPrimary"
                placeholder="Kullanıcı adı ara..."
                placeholderTextColor={COLORS.textMuted}
                value={searchQuery}
                onChangeText={handleSearchUsers}
              />
            </View>
            {inviteLoading && <ActivityIndicator size="small" color={COLORS.primary} className="mb-4" />}
            <ScrollView className="max-h-[200px]">
              {searchResults.map(u => (
                <TouchableOpacity 
                  key={u.id} 
                  className="flex-row items-center justify-between py-2.5 border-b border-light-border dark:border-dark-border"
                >
                  <Text className="font-medium text-text-lightPrimary dark:text-text-darkPrimary">@{u.username}</Text>
                  <TouchableOpacity onPress={() => handleInviteUser(u.id)} className="px-3 py-1.5 rounded-lg bg-brand-primary/20">
                    <Text className="text-xs font-bold text-brand-primary">Davet Et</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
              {searchResults.length === 0 && searchQuery.length >= 2 && !inviteLoading && (
                <Text className="text-center py-2.5 text-text-lightMuted dark:text-text-darkMuted">Kullanıcı bulunamadı.</Text>
              )}
            </ScrollView>
          </View>
        </View>
      )}

      {/* İçerik Ekleme Modalı */}
      {showContentModal && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center z-[100]">
          <View className="w-[90%] p-6 rounded-2xl bg-light-surfaceElevated dark:bg-dark-surfaceElevated">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-text-lightPrimary dark:text-text-darkPrimary">İçerik Ara & Ekle</Text>
              <TouchableOpacity onPress={() => setShowContentModal(false)}><Icon name="X" size={24} color={COLORS.textSecondary} /></TouchableOpacity>
            </View>
            <View className="rounded-xl px-3 border mb-4 bg-light-bg border-light-border dark:bg-dark-bg dark:border-dark-border">
              <TextInput
                className="h-11 text-text-lightPrimary dark:text-text-darkPrimary"
                placeholder={list.type === 'watching' ? "Film veya dizi ara..." : "Kitap ara..."}
                placeholderTextColor={COLORS.textMuted}
                value={contentSearchQuery}
                onChangeText={handleSearchContents}
              />
            </View>
            {contentSearchLoading && <ActivityIndicator size="small" color={COLORS.primary} className="mb-4" />}
            <ScrollView className="max-h-[300px]">
              {contentSearchResults.map(c => (
                <TouchableOpacity 
                  key={c.id} 
                  className="flex-row items-center justify-between py-2.5 border-b border-light-border dark:border-dark-border"
                >
                  <View className="flex-1 pr-2.5">
                    <Text className="font-medium text-text-lightPrimary dark:text-text-darkPrimary" numberOfLines={1}>{c.title}</Text>
                    <Text className="text-[11px] text-text-lightSecondary dark:text-text-darkSecondary" numberOfLines={1}>{c.director_author}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleAddContent(c.id)} className="px-3 py-1.5 rounded-lg bg-brand-primary/20">
                    <Text className="text-xs font-bold text-brand-primary">Ekle</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
              {contentSearchResults.length === 0 && contentSearchQuery.length >= 2 && !contentSearchLoading && (
                <Text className="text-center py-2.5 text-text-lightMuted dark:text-text-darkMuted">İçerik bulunamadı.</Text>
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}
