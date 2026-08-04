import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { libraryApi } from '@/api/endpoints/library.api';
import { sharedListsApi } from '@/api/endpoints/shared-lists.api';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@/features/icon/components/Icon';
import ContentCard from '@/features/content/components/ContentCard'; // Gerekirse veya özel Card kullanacağız
import { LIBRARY_TABS } from '@/constants/library';

export default function LibraryScreen() {
  const { user } = useAuth();
  const { colors: COLORS, isDark } = useTheme();
  
  const [items, setItems] = useState([]);
  const [sharedLists, setSharedLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('will_watch');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListType, setNewListType] = useState('watching');

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        setLoading(false);
        return;
      }
      fetchLibrary();
    }, [user])
  );

  const fetchLibrary = async () => {
    setLoading(true);
    try {
      const res = await libraryApi.getUserLibrary();
      setItems(res.data.data);
      const listsRes = await sharedListsApi.getMyLists();
      setSharedLists(listsRes.data.data);
    } catch(err) {
      console.log('Library error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    try {
      await sharedListsApi.createList(newListName, newListType);
      setShowCreateModal(false);
      setNewListName('');
      fetchLibrary();
    } catch (err) {
      console.log('Create list error:', err.response?.data || err.message);
      Alert.alert('Hata', err.response?.data?.message || 'Liste oluşturulurken bir hata oluştu.');
    }
  };

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-light-bg dark:bg-dark-bg">
        <Icon name="LockKey" size={48} color={COLORS.textMuted} />
        <Text className="text-base text-text-lightSecondary dark:text-text-darkSecondary mt-4">Kitaplığınızı görmek için giriş yapmalısınız.</Text>
      </View>
    );
  }

  // Aktif sekmeye göre filtreleme
  const filteredItems = items.filter(item => {
    if (activeTab === 'watching_reading') {
      return item.status === 'watching' || item.status === 'reading';
    }
    return item.status === activeTab;
  });

  return (
    <View className="flex-1 bg-light-bg dark:bg-dark-bg">
      <View className="pt-16 pb-5">
        <Text className="text-[22px] font-extrabold px-5 mb-4 text-text-lightPrimary dark:text-text-darkPrimary">📚 Kitaplığım</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {LIBRARY_TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.8}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 9999,
                  borderWidth: 1,
                  backgroundColor: isActive ? COLORS.primary : (isDark ? COLORS.surfaceElevated : COLORS.surfaceElevated),
                  borderColor: isActive ? COLORS.primary : (isDark ? COLORS.border : COLORS.border),
                }}
              >
                <Icon name={tab.icon} size={16} color={isActive ? '#fff' : COLORS.textPrimary} weight={isActive ? "fill" : "regular"} />
                <Text style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: isActive ? '#fff' : COLORS.textPrimary,
                }}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center"><ActivityIndicator size="large" color={COLORS.primary} /></View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {/* Listelerim Bölümü */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-text-lightPrimary dark:text-text-darkPrimary">Listelerim</Text>
            <View className="flex-row gap-2">
              <TouchableOpacity onPress={() => { setNewListType('watching'); setShowCreateModal(true); }} className="flex-row items-center gap-1 bg-brand-primary/20 px-2.5 py-1.5 rounded-xl">
                <Icon name="Plus" size={14} color={COLORS.primary} />
                <Text className="text-brand-primary text-xs font-semibold">İzleme</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setNewListType('reading'); setShowCreateModal(true); }} className="flex-row items-center gap-1 bg-brand-primary/20 px-2.5 py-1.5 rounded-xl">
                <Icon name="Plus" size={14} color={COLORS.primary} />
                <Text className="text-brand-primary text-xs font-semibold">Okuma</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {sharedLists.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 -mx-4 px-4">
              {sharedLists.map(list => (
                <TouchableOpacity 
                  key={list.id} 
                  className="w-[140px] p-3 rounded-2xl border bg-light-surfaceElevated border-light-border dark:bg-dark-surfaceElevated dark:border-dark-border mr-3"
                  onPress={() => router.push(`/shared-list/${list.id}`)}
                >
                  <View className="w-12 h-12 rounded-full items-center justify-center mb-3" style={{ backgroundColor: list.type === 'watching' ? '#E91E6320' : '#2196F320' }}>
                    <Icon name={list.type === 'watching' ? 'MonitorPlay' : 'BookOpen'} size={24} color={list.type === 'watching' ? '#E91E63' : '#2196F3'} weight="fill" />
                  </View>
                  <Text className="text-sm font-bold text-text-lightPrimary dark:text-text-darkPrimary mb-1" numberOfLines={1}>{list.name}</Text>
                  <Text className="text-[11px] text-text-lightSecondary dark:text-text-darkSecondary">{list.member_count} Üye • {list.content_count} İçerik</Text>
                </TouchableOpacity>
              ))}
              <View className="w-8" />
            </ScrollView>
          )}

          <Text className="text-lg font-bold text-text-lightPrimary dark:text-text-darkPrimary mb-4">Kişisel Kitaplığım</Text>
          {filteredItems.length === 0 ? (
            <View className="items-center mt-16">
              <Icon name="FolderOpen" size={48} color={COLORS.textMuted} weight="light" />
              <Text className="mt-3 text-[15px] text-text-lightSecondary dark:text-text-darkSecondary">Bu listede henüz içerik yok.</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {filteredItems.map(item => (
                <View key={item.library_id} className="w-[48%] mb-4">
                  <ContentCard item={item} onPress={() => router.push(`/detail/${item.id}`)} />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* Yeni Liste Modalı */}
      {showCreateModal && (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 justify-center items-center z-50">
          <View className="w-[80%] p-6 rounded-2xl bg-light-surfaceElevated dark:bg-dark-surfaceElevated">
            <Text className="text-lg font-bold text-text-lightPrimary dark:text-text-darkPrimary mb-4">Yeni {newListType === 'watching' ? 'İzleme' : 'Okuma'} Listesi</Text>
            <View className="bg-light-bg dark:bg-dark-bg rounded-xl px-3.5 border border-light-border dark:border-dark-border mb-4">
              <TextInput
                className="text-text-lightPrimary dark:text-text-darkPrimary h-11"
                placeholder="Liste Adı"
                placeholderTextColor={COLORS.textMuted}
                value={newListName}
                onChangeText={setNewListName}
                autoFocus
              />
            </View>
            <View className="flex-row justify-end gap-3">
              <TouchableOpacity onPress={() => setShowCreateModal(false)} className="py-2">
                <Text className="text-text-lightSecondary dark:text-text-darkSecondary font-semibold">İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreateList} className="bg-brand-primary rounded-lg py-2 px-4">
                <Text className="text-white font-semibold">Oluştur</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
