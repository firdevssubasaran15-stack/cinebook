import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, FlatList, TextInput, Modal } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL } from '@/constants/api';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { usersApi } from '@/api/endpoints/users.api';
import { commentsApi } from '@/api/endpoints/comments.api';
import { sharedListsApi } from '@/api/endpoints/shared-lists.api';
import Icon from '@/features/icon/components/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import UserCommentItem from '@/features/comments/components/UserCommentItem';
import { GRADIENTS } from '@/constants/colors';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const { colors: COLORS, isDark } = useTheme();
  const { user, updateUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [comments, setComments] = useState([]);
  const [publicLists, setPublicLists] = useState([]);
  const [activeTab, setActiveTab] = useState('comments'); // 'comments' | 'lists'
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [userSearchLoading, setUserSearchLoading] = useState(false);

  const [userListModal, setUserListModal] = useState({ visible: false, type: null });
  const [userList, setUserList] = useState([]);
  const [userListLoading, setUserListLoading] = useState(false);

  const [editProfileModal, setEditProfileModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const fetchData = async () => {
    try {
      const [profileRes, commentsRes, listsRes] = await Promise.all([
        usersApi.getProfile(id),
        usersApi.getUserComments(id),
        sharedListsApi.getUserPublicLists(id)
      ]);
      setProfile(profileRes.data.data);
      setComments(commentsRes.data.data);
      setPublicLists(listsRes.data.data);
    } catch (err) {
      Alert.alert('Hata', 'Kullanıcı profili yüklenemedi.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleToggleFollow = async () => {
    if (!user) {
      Alert.alert('Uyarı', 'Takip etmek için giriş yapmalısınız.');
      return;
    }
    
    // Optimsitic UI Update
    setProfile(prev => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followersCount: prev.isFollowing ? prev.followersCount - 1 : prev.followersCount + 1
    }));
    
    setFollowLoading(true);
    try {
      await usersApi.toggleFollow(id);
    } catch (err) {
      // Revert optimistic update
      setProfile(prev => ({
        ...prev,
        isFollowing: !prev.isFollowing,
        followersCount: prev.isFollowing ? prev.followersCount - 1 : prev.followersCount + 1
      }));
      Alert.alert('Hata', err.response?.data?.message || 'İşlem başarısız.');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUserSearch = async (query) => {
    setUserSearchQuery(query);
    if (!query || query.trim().length < 2) {
      setUserSearchResults([]);
      return;
    }
    setUserSearchLoading(true);
    try {
      const res = await usersApi.searchUsers(query);
      setUserSearchResults(res.data.data);
    } catch (err) {
      console.log('User search error:', err.message);
    } finally {
      setUserSearchLoading(false);
    }
  };

  const openUserList = async (type) => {
    setUserListModal({ visible: true, type });
    setUserListLoading(true);
    try {
      const res = type === 'followers' ? await usersApi.getFollowers(id) : await usersApi.getFollowing(id);
      setUserList(res.data.data);
    } catch (err) {
      Alert.alert('Hata', 'Kullanıcı listesi alınamadı.');
      setUserListModal({ visible: false, type: null });
    } finally {
      setUserListLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Hata', 'Kamera rulonuza erişim izni gereklidir.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      handleUpload(result.assets[0]);
    }
  };

  const handleUpload = async (imageAsset) => {
    setIsUploadingImage(true);
    const formData = new FormData();
    const uri = imageAsset.uri;
    const fileType = imageAsset.mimeType || 'image/jpeg';
    const fileName = imageAsset.fileName || `profile_${Date.now()}.jpg`;
    formData.append('image', { uri, name: fileName, type: fileType });
    try {
      const res = await usersApi.updateProfileImage(formData);
      updateUser(res.data);
      setProfile(prev => ({ ...prev, profile_image: res.data.profile_image }));
      Alert.alert('Başarılı', 'Profil resminiz güncellendi.');
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || 'Resim yüklenemedi.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveUsername = async () => {
    if (!newUsername || newUsername.trim() === user?.username) {
      setEditProfileModal(false);
      return;
    }
    setIsSavingProfile(true);
    try {
      const res = await usersApi.updateUsername(newUsername);
      updateUser(res.data.data);
      setProfile(prev => ({ ...prev, username: res.data.data.username }));
      Alert.alert('Başarılı', 'Kullanıcı adınız güncellendi.');
      setEditProfileModal(false);
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || 'Kullanıcı adı güncellenemedi.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-light-bg dark:bg-dark-bg">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const isMe = user?.id === parseInt(id);

  const handleToggleLike = async (commentId) => {
    if (!user) {
      Alert.alert('Uyarı', 'Beğenmek için giriş yapmalısınız.');
      return;
    }

    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const isLiked = c.is_liked_by_user;
        const isDisliked = c.is_disliked_by_user;
        return {
          ...c,
          is_liked_by_user: !isLiked,
          like_count: isLiked ? c.like_count - 1 : c.like_count + 1,
          is_disliked_by_user: false,
          dislike_count: isDisliked ? c.dislike_count - 1 : c.dislike_count
        };
      }
      return c;
    }));

    try {
      await commentsApi.toggleLike(commentId);
    } catch (err) {
      fetchData(); // Revert on error
    }
  };

  const handleToggleDislike = async (commentId) => {
    if (!user) {
      Alert.alert('Uyarı', 'Beğenmemek için giriş yapmalısınız.');
      return;
    }

    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const isDisliked = c.is_disliked_by_user;
        const isLiked = c.is_liked_by_user;
        return {
          ...c,
          is_disliked_by_user: !isDisliked,
          dislike_count: isDisliked ? c.dislike_count - 1 : c.dislike_count + 1,
          is_liked_by_user: false,
          like_count: isLiked ? c.like_count - 1 : c.like_count
        };
      }
      return c;
    }));

    try {
      await commentsApi.toggleDislike(commentId);
    } catch (err) {
      fetchData(); // Revert on error
    }
  };

  const renderHeader = () => (
    <View>
      <LinearGradient colors={isDark ? GRADIENTS.hero : [COLORS.surfaceElevated, COLORS.background]} className="pt-15 pb-10 px-5 items-center rounded-b-[30px] shadow-sm">
        <TouchableOpacity className="absolute top-[50px] left-5 p-2.5 z-10" onPress={() => router.back()}>
          <Icon name="ArrowLeft" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        {isMe && (
          <TouchableOpacity className="absolute top-[50px] right-20 p-2.5 z-10" onPress={() => router.push('/settings')}>
            <Icon name="Gear" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity className="absolute top-[50px] right-5 p-2.5 z-10" onPress={() => router.push('/calendar')}>
          <Icon name="CalendarBlank" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <View className="items-center mb-6">
          {profile?.profile_image ? (
            <Image 
              source={{ uri: `${API_BASE_URL}${profile.profile_image}` }} 
              className="w-20 h-20 rounded-[40px] mb-3"
              contentFit="cover" 
            />
          ) : (
            <View className="w-20 h-20 rounded-[40px] justify-center items-center mb-3 bg-brand-primary">
              <Text className="text-white text-4xl font-bold">{profile?.username?.[0]?.toUpperCase()}</Text>
            </View>
          )}
          <Text className="text-[22px] font-extrabold mb-1 text-text-lightPrimary dark:text-text-darkPrimary">@{profile?.username}</Text>
          <Text className="text-xs text-text-lightMuted dark:text-text-darkMuted">
            Katılım: {new Date(profile?.created_at).toLocaleDateString('tr-TR')}
          </Text>
          {profile?.weeklyEmotion && (() => {
            const emotionData = require('@/constants/emotions').EMOTION_TAGS.find(e => e.id === profile.weeklyEmotion);
            const emotionLabel = emotionData ? emotionData.label : profile.weeklyEmotion;
            const tagColor = emotionData ? (COLORS[emotionData.id] || COLORS.textPrimary) : COLORS.primary;
            return (
              <View className="flex-row items-center mt-3">
                <Text className="text-[13px] mr-1.5 text-text-lightSecondary dark:text-text-darkSecondary">Bu hafta en çok hissedilen:</Text>
                <View className="flex-row items-center px-2.5 py-1 rounded-xl" style={{ backgroundColor: tagColor + '20' }}>
                  {emotionData && <Icon name={emotionData.iconName} size={14} color={tagColor} style={{ marginRight: 4 }} />}
                  <Text style={{ color: tagColor }} className="text-[13px] font-bold">{emotionLabel}</Text>
                </View>
              </View>
            );
          })()}
          
          {profile?.similarityPercentage != null && (
            <View className="flex-row items-center mt-2.5 px-3 py-1.5 rounded-2xl border" style={{ borderColor: `${COLORS.primary}40`, backgroundColor: `${COLORS.primary}10` }}>
              <Icon name="Sparkle" size={16} color={COLORS.primary} weight="fill" />
              <Text className="text-[13px] font-bold ml-1.5 text-brand-primary">
                Seninle %{profile.similarityPercentage} benzer zevke sahip
              </Text>
            </View>
          )}
        </View>

        <View className="flex-row items-center mb-6">
          <TouchableOpacity className="items-center px-6" onPress={() => openUserList('followers')}>
            <Text className="text-xl font-bold mb-1 text-text-lightPrimary dark:text-text-darkPrimary">{profile?.followersCount || 0}</Text>
            <Text className="text-[13px] text-text-lightSecondary dark:text-text-darkSecondary">Takipçi</Text>
          </TouchableOpacity>
          <View className="w-px h-7 bg-light-border dark:bg-dark-border" />
          <TouchableOpacity className="items-center px-6" onPress={() => openUserList('following')}>
            <Text className="text-xl font-bold mb-1 text-text-lightPrimary dark:text-text-darkPrimary">{profile?.followingCount || 0}</Text>
            <Text className="text-[13px] text-text-lightSecondary dark:text-text-darkSecondary">Takip Edilen</Text>
          </TouchableOpacity>
        </View>

        {!isMe ? (
          <TouchableOpacity 
            className={`px-8 py-3 rounded-full min-w-[160px] items-center border ${profile?.isFollowing ? 'bg-transparent border-brand-primary' : 'bg-brand-primary border-brand-primary'}`}
            onPress={handleToggleFollow}
            disabled={followLoading}
          >
            <Text className={`text-[15px] font-bold ${profile?.isFollowing ? 'text-brand-primary' : 'text-white'}`}>
              {profile?.isFollowing ? 'Takiptesin' : 'Takip Et'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            className="bg-transparent border border-light-border dark:border-dark-border px-8 py-3 rounded-full min-w-[160px] items-center"
            onPress={() => {
              setNewUsername(user?.username || '');
              setEditProfileModal(true);
            }}
          >
            <Text className="text-[15px] font-bold text-text-lightPrimary dark:text-text-darkPrimary">
              Profili Düzenle
            </Text>
          </TouchableOpacity>
        )}
      </LinearGradient>

      {/* User Search Bar moved to top */}
      <View className="mx-5 mt-5 mb-2.5 z-[99]">
        <View className="flex-row items-center rounded-2xl px-4 py-3 border bg-light-surfaceElevated border-light-border dark:bg-black/5 dark:border-dark-border">
          <Icon name="MagnifyingGlass" size={20} color={COLORS.textSecondary} />
          <TextInput
            className="flex-1 ml-3 text-base text-text-lightPrimary dark:text-text-darkPrimary"
            placeholder="Kullanıcı ara..."
            placeholderTextColor={COLORS.textMuted}
            value={userSearchQuery}
            onChangeText={handleUserSearch}
          />
          {userSearchLoading && <ActivityIndicator size="small" color={COLORS.primary} style={{ marginLeft: 8 }} />}
        </View>
        
        {userSearchResults.length > 0 && (
          <View className="mt-2 rounded-2xl p-2 border bg-light-surfaceElevated border-light-border dark:bg-dark-surfaceElevated dark:border-dark-border">
            {userSearchResults.map(u => (
              <TouchableOpacity 
                key={u.id} 
                className="flex-row items-center p-3 rounded-xl"
                onPress={() => {
                  setUserSearchQuery('');
                  setUserSearchResults([]);
                  router.push(`/user/${u.id}`);
                }}
              >
                {u.profile_image ? (
                  <Image source={{ uri: `${API_BASE_URL}${u.profile_image}` }} className="w-9 h-9 rounded-full mr-3" contentFit="cover" />
                ) : (
                  <View className="w-9 h-9 rounded-full mr-3 bg-brand-primary justify-center items-center">
                    <Text className="text-white font-bold">{u.username[0].toUpperCase()}</Text>
                  </View>
                )}
                <Text className="font-medium text-text-lightPrimary dark:text-text-darkPrimary">@{u.username}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View className="flex-row mx-5 mb-2.5 rounded-xl p-1 bg-light-surfaceElevated dark:bg-black/5">
        <TouchableOpacity 
          className={`flex-1 py-2.5 items-center rounded-lg ${activeTab === 'comments' ? 'bg-brand-primary' : 'bg-transparent'}`}
          onPress={() => setActiveTab('comments')}
        >
          <Text className={`font-bold ${activeTab === 'comments' ? 'text-white' : 'text-text-lightSecondary dark:text-text-darkSecondary'}`}>Yorumlar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 py-2.5 items-center rounded-lg ${activeTab === 'lists' ? 'bg-brand-primary' : 'bg-transparent'}`}
          onPress={() => setActiveTab('lists')}
        >
          <Text className={`font-bold ${activeTab === 'lists' ? 'text-white' : 'text-text-lightSecondary dark:text-text-darkSecondary'}`}>Listeler</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => null;

  return (
    <View className="flex-1 bg-light-bg dark:bg-dark-bg">
      <FlatList
        data={activeTab === 'comments' ? comments : publicLists}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => {
          if (activeTab === 'comments') {
            return <UserCommentItem comment={item} onToggleLike={handleToggleLike} onToggleDislike={handleToggleDislike} />;
          } else {
            return (
              <TouchableOpacity
                className="mx-5 mb-3 p-4 rounded-2xl flex-row items-center border bg-light-surfaceElevated border-light-border dark:bg-dark-surfaceElevated dark:border-dark-border"
                onPress={() => router.push(`/shared-list/${item.id}`)}
              >
                <View className="flex-1">
                  <Text className="text-base font-bold text-text-lightPrimary dark:text-text-darkPrimary" numberOfLines={1}>{item.name}</Text>
                  <View className="flex-row items-center mt-2 gap-3">
                    <View className="flex-row items-center">
                      <Icon name="Users" size={14} color={COLORS.textSecondary} />
                      <Text className="text-xs ml-1 text-text-lightSecondary dark:text-text-darkSecondary">{item.member_count}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Icon name={item.type === 'watching' ? "MonitorPlay" : "BookOpen"} size={14} color={COLORS.textSecondary} />
                      <Text className="text-xs ml-1 text-text-lightSecondary dark:text-text-darkSecondary">{item.content_count}</Text>
                    </View>
                  </View>
                </View>
                <Icon name="CaretRight" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            );
          }
        }}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={() => (
          <View className="p-10 items-center justify-center">
            <Icon name={activeTab === 'comments' ? "ChatCircle" : "List"} size={48} color={COLORS.border} />
            <Text className="mt-3 text-[15px] text-text-lightSecondary dark:text-text-darkSecondary">
              {activeTab === 'comments' ? 'Kullanıcı henüz hiç yorum yapmamış.' : 'Herkese açık bir liste bulunmuyor.'}
            </Text>
          </View>
        )}
        style={{ flex: 1 }}
        ListHeaderComponentStyle={{ marginBottom: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
        ListFooterComponent={renderFooter}
      />
      
      <Modal
        visible={userListModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setUserListModal({ visible: false, type: null })}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-[85%] max-h-[70%] rounded-3xl p-5 bg-light-bg dark:bg-dark-bg">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-text-lightPrimary dark:text-text-darkPrimary">
                {userListModal.type === 'followers' ? 'Takipçiler' : 'Takip Edilenler'}
              </Text>
              <TouchableOpacity onPress={() => setUserListModal({ visible: false, type: null })}>
                <Icon name="X" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
            
            {userListLoading ? (
              <ActivityIndicator size="large" color={COLORS.primary} className="my-5" />
            ) : userList.length === 0 ? (
              <Text className="text-center my-5 text-text-lightSecondary dark:text-text-darkSecondary">
                {userListModal.type === 'followers' ? 'Henüz takipçi yok.' : 'Henüz kimseyi takip etmiyor.'}
              </Text>
            ) : (
              <FlatList
                data={userList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="flex-row items-center py-2.5 border-b border-light-border dark:border-dark-border"
                    onPress={() => {
                      setUserListModal({ visible: false, type: null });
                      router.push(`/user/${item.id}`);
                    }}
                  >
                    {item.profile_image ? (
                      <Image source={{ uri: `${API_BASE_URL}${item.profile_image}` }} className="w-10 h-10 rounded-full mr-3" contentFit="cover" />
                    ) : (
                      <View className="w-10 h-10 rounded-full mr-3 bg-brand-primary justify-center items-center">
                        <Text className="text-white font-bold text-base">{item.username[0].toUpperCase()}</Text>
                      </View>
                    )}
                    <Text className="text-base font-medium text-text-lightPrimary dark:text-text-darkPrimary">@{item.username}</Text>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={editProfileModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEditProfileModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-[85%] rounded-3xl p-6 items-center bg-light-bg dark:bg-dark-bg">
            <Text className="text-lg font-bold mb-5 text-text-lightPrimary dark:text-text-darkPrimary">
              Profili Düzenle
            </Text>
            
            <TouchableOpacity onPress={pickImage} className="relative mb-6">
              {profile?.profile_image ? (
                <Image 
                  source={{ uri: `${API_BASE_URL}${profile.profile_image}` }} 
                  className="w-[100px] h-[100px] rounded-full"
                  contentFit="cover" 
                />
              ) : (
                <View className="w-[100px] h-[100px] rounded-full bg-brand-primary justify-center items-center">
                  <Text className="text-white text-4xl font-bold">{profile?.username?.[0]?.toUpperCase()}</Text>
                </View>
              )}
              <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-brand-primary justify-center items-center border-2 border-light-bg dark:border-dark-bg">
                {isUploadingImage ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Icon name="Camera" size={14} color="#fff" />
                )}
              </View>
            </TouchableOpacity>
            
            <View className="w-full mb-6">
              <Text className="text-sm mb-2 text-text-lightSecondary dark:text-text-darkSecondary">Kullanıcı Adı</Text>
              <TextInput
                className="w-full h-12 rounded-xl px-4 text-base border bg-light-surfaceElevated border-light-border text-text-lightPrimary dark:bg-dark-surfaceElevated dark:border-dark-border dark:text-text-darkPrimary"
                value={newUsername}
                onChangeText={setNewUsername}
                placeholder="Kullanıcı adı"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View className="flex-row gap-3 w-full">
              <TouchableOpacity 
                className="flex-1 py-3 rounded-xl items-center border bg-light-surfaceElevated border-light-border dark:bg-dark-surfaceElevated dark:border-dark-border"
                onPress={() => setEditProfileModal(false)}
                disabled={isSavingProfile}
              >
                <Text className="font-semibold text-text-lightPrimary dark:text-text-darkPrimary">İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-1 py-3 rounded-xl items-center bg-brand-primary"
                onPress={handleSaveUsername}
                disabled={isSavingProfile}
              >
                {isSavingProfile ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-white font-semibold">Kaydet</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
