import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, TextInput, Modal } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Image } from 'expo-image';
import { API_BASE_URL } from '@/constants/api';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/features/icon/components/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import UserCommentItem from '@/features/comments/components/UserCommentItem';
import { GRADIENTS } from '@/constants/colors';
import { EMOTION_TAGS } from '@/constants/emotions';
import { useUserProfile } from '@/features/user/hooks/useUserProfile';
import { useProfileEdit } from '@/features/user/hooks/useProfileEdit';
import { useUserRelations } from '@/features/user/hooks/useUserRelations';
import { useShareManager } from '@/features/share/hooks/useShareManager';
import UserWeeklyEmotionBadge from '@/features/user/components/UserWeeklyEmotionBadge';
import UserSimilarityBadge from '@/features/user/components/UserSimilarityBadge';
import ShareBottomSheet from '@/features/share/components/ShareBottomSheet';
import { userProfileStyles as styles } from '@/features/user/styles/userProfile.styles';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const { colors: COLORS, isDark } = useTheme();
  const { user, updateUser } = useAuth();
  
  const {
    profile, setProfile, comments, publicLists,
    activeTab, setActiveTab, loading, followLoading,
    handleToggleFollow, handleToggleLike, handleToggleDislike
  } = useUserProfile(id, user);

  const {
    editProfileModal, setEditProfileModal, newUsername, setNewUsername,
    isSavingProfile, isUploadingImage, pickImage, handleSaveUsername
  } = useProfileEdit(user, updateUser, setProfile);

  const {
    userSearchQuery, userSearchResults, userSearchLoading, handleUserSearch,
    userListModal, setUserListModal, userList, userListLoading, openUserList
  } = useUserRelations(id);

  const { 
    isShareModalVisible, 
    shareData, 
    openShareSheet, 
    closeShareSheet, 
    handleShareAction 
  } = useShareManager();

  if (loading) {
    return (
      <View className={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const isMe = user?.id === parseInt(id);

  const renderHeader = () => (
    <View>
      <LinearGradient colors={isDark ? GRADIENTS.hero : [COLORS.surfaceElevated, COLORS.background]} style={styles.headerGradient}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="ArrowLeft" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.calendarButton} onPress={() => router.push('/calendar')}>
          <Icon name="CalendarBlank" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.profileInfoContainer}>
          {profile?.profile_image ? (
            <Image 
              source={{ uri: `${API_BASE_URL}${profile.profile_image}` }} 
              style={styles.profileImage}
              contentFit="cover" 
            />
          ) : (
            <View style={[styles.profileImageFallback, { backgroundColor: COLORS.primary }]}>
              <Text style={styles.profileImageFallbackText}>{profile?.username?.[0]?.toUpperCase()}</Text>
            </View>
          )}
          <Text style={[styles.username, { color: COLORS.textPrimary }]}>@{profile?.username}</Text>
          <Text style={[styles.joinDate, { color: COLORS.textMuted }]}>
            Katılım: {new Date(profile?.created_at).toLocaleDateString('tr-TR')}
          </Text>
          <UserWeeklyEmotionBadge 
            emotionId={profile?.weeklyEmotion} 
            profile={profile}
            onPress={openShareSheet} 
          />
          
          <UserSimilarityBadge 
            profile={profile} 
            currentUser={user} 
            onPress={openShareSheet} 
          />
        </View>

        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statItem} onPress={() => openUserList('followers')}>
            <Text style={[styles.statValue, { color: COLORS.textPrimary }]}>{profile?.followersCount || 0}</Text>
            <Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>Takipçi</Text>
          </TouchableOpacity>
          <View style={[styles.statDivider, { backgroundColor: COLORS.border }]} />
          <TouchableOpacity style={styles.statItem} onPress={() => openUserList('following')}>
            <Text style={[styles.statValue, { color: COLORS.textPrimary }]}>{profile?.followingCount || 0}</Text>
            <Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>Takip Edilen</Text>
          </TouchableOpacity>
        </View>

        {!isMe ? (
          <TouchableOpacity 
            style={[styles.actionButtonBase, {
              backgroundColor: profile?.isFollowing ? 'transparent' : COLORS.primary,
              borderColor: COLORS.primary,
            }]}
            onPress={handleToggleFollow}
            disabled={followLoading}
          >
            <Text style={[styles.actionButtonText, { color: profile?.isFollowing ? COLORS.primary : '#fff' }]}>
              {profile?.isFollowing ? 'Takiptesin' : 'Takip Et'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.actionButtonBase, { backgroundColor: 'transparent', borderColor: COLORS.border }]}
            onPress={() => {
              setNewUsername(user?.username || '');
              setEditProfileModal(true);
            }}
          >
            <Text style={[styles.actionButtonText, { color: COLORS.textPrimary }]}>
              Profili Düzenle
            </Text>
          </TouchableOpacity>
        )}
      </LinearGradient>

      <View className={styles.searchContainer}>
        <View className={styles.searchInputRow}>
          <Icon name="MagnifyingGlass" size={20} color={COLORS.textSecondary} />
          <TextInput
            className={styles.searchInput}
            placeholder="Kullanıcı ara..."
            placeholderTextColor={COLORS.textMuted}
            value={userSearchQuery}
            onChangeText={handleUserSearch}
          />
          {userSearchLoading && <ActivityIndicator size="small" color={COLORS.primary} style={{ marginLeft: 8 }} />}
        </View>
        
        {userSearchResults.length > 0 && (
          <View className={styles.searchResultsContainer}>
            {userSearchResults.map(u => (
              <TouchableOpacity 
                key={u.id} 
                className={styles.searchResultItem}
                onPress={() => {
                  handleUserSearch('');
                  router.push(`/user/${u.id}`);
                }}
              >
                {u.profile_image ? (
                  <Image source={{ uri: `${API_BASE_URL}${u.profile_image}` }} className={styles.searchResultImage} contentFit="cover" />
                ) : (
                  <View className={styles.searchResultImageFallback}>
                    <Text className="text-white font-bold">{u.username[0].toUpperCase()}</Text>
                  </View>
                )}
                <Text className={styles.searchResultText}>@{u.username}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View className={styles.tabsContainer}>
        <TouchableOpacity 
          className={`${styles.tabButtonBase} ${activeTab === 'comments' ? styles.tabButtonActive : styles.tabButtonInactive}`}
          onPress={() => setActiveTab('comments')}
        >
          <Text className={activeTab === 'comments' ? styles.tabTextActive : styles.tabTextInactive}>Yorumlar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`${styles.tabButtonBase} ${activeTab === 'lists' ? styles.tabButtonActive : styles.tabButtonInactive}`}
          onPress={() => setActiveTab('lists')}
        >
          <Text className={activeTab === 'lists' ? styles.tabTextActive : styles.tabTextInactive}>Listeler</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => null;

  return (
    <View className={styles.mainContainer}>
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
                className={styles.listItem}
                onPress={() => router.push(`/shared-list/${item.id}`)}
              >
                <View className="flex-1">
                  <Text className={styles.listTitle} numberOfLines={1}>{item.name}</Text>
                  <View className={styles.listStatsRow}>
                    <View className={styles.listStatItem}>
                      <Icon name="Users" size={14} color={COLORS.textSecondary} />
                      <Text className={styles.listStatText}>{item.member_count}</Text>
                    </View>
                    <View className={styles.listStatItem}>
                      <Icon name={item.type === 'watching' ? "MonitorPlay" : "BookOpen"} size={14} color={COLORS.textSecondary} />
                      <Text className={styles.listStatText}>{item.content_count}</Text>
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
          <View className={styles.emptyContainer}>
            <Icon name={activeTab === 'comments' ? "ChatCircle" : "List"} size={48} color={COLORS.border} />
            <Text className={styles.emptyText}>
              {activeTab === 'comments' ? 'Kullanıcı henüz hiç yorum yapmamış.' : 'Herkese açık bir liste bulunmuyor.'}
            </Text>
          </View>
        )}
        style={{ flex: 1 }}
        ListHeaderComponentStyle={{ marginBottom: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
        ListFooterComponent={renderFooter}
      />
      
      {/* Users List Modal */}
      <Modal
        visible={userListModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setUserListModal({ visible: false, type: null })}
      >
        <View className={styles.modalOverlay}>
          <View className={styles.listModalContainer}>
            <View className={styles.modalHeaderRow}>
              <Text className={styles.modalTitle}>
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
                    className={styles.modalUserItem}
                    onPress={() => {
                      setUserListModal({ visible: false, type: null });
                      router.push(`/user/${item.id}`);
                    }}
                  >
                    {item.profile_image ? (
                      <Image source={{ uri: `${API_BASE_URL}${item.profile_image}` }} className={styles.modalUserImage} contentFit="cover" />
                    ) : (
                      <View className={styles.modalUserImageFallback}>
                        <Text className="text-white font-bold text-base">{item.username[0].toUpperCase()}</Text>
                      </View>
                    )}
                    <Text className={styles.modalUserText}>@{item.username}</Text>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        visible={editProfileModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEditProfileModal(false)}
      >
        <View className={styles.modalOverlay}>
          <View className={styles.editModalContainer}>
            <Text className="text-lg font-bold mb-5 text-text-lightPrimary dark:text-text-darkPrimary">
              Profili Düzenle
            </Text>
            
            <TouchableOpacity onPress={pickImage} className={styles.editImageButton}>
              {profile?.profile_image ? (
                <Image 
                  source={{ uri: `${API_BASE_URL}${profile.profile_image}` }} 
                  className={styles.editImagePreview}
                  contentFit="cover" 
                />
              ) : (
                <View className={styles.editImageFallback}>
                  <Text className={styles.editImageFallbackText}>{profile?.username?.[0]?.toUpperCase()}</Text>
                </View>
              )}
              <View className={styles.editIconContainer}>
                {isUploadingImage ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Icon name="Camera" size={14} color="#fff" />
                )}
              </View>
            </TouchableOpacity>
            
            <View className="w-full mb-6">
              <Text className={styles.editInputLabel}>Kullanıcı Adı</Text>
              <TextInput
                className={styles.editInput}
                value={newUsername}
                onChangeText={setNewUsername}
                placeholder="Kullanıcı adı"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View className={styles.editButtonsRow}>
              <TouchableOpacity 
                className={styles.editCancelButton}
                onPress={() => setEditProfileModal(false)}
                disabled={isSavingProfile}
              >
                <Text className={styles.editCancelText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className={styles.editSaveButton}
                onPress={handleSaveUsername}
                disabled={isSavingProfile}
              >
                {isSavingProfile ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className={styles.editSaveText}>Kaydet</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ShareBottomSheet 
        visible={isShareModalVisible} 
        onClose={closeShareSheet} 
        shareData={shareData} 
        onShare={handleShareAction} 
      />
    </View>
  );
}
