import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/features/icon/components/Icon';
import UserCommentItem from '@/features/comments/components/UserCommentItem';
import { useUserProfile } from '@/features/user/hooks/useUserProfile';
import { useProfileEdit } from '@/features/user/hooks/useProfileEdit';
import { useUserRelations } from '@/features/user/hooks/useUserRelations';
import { useShareManager } from '@/features/share/hooks/useShareManager';
import ShareBottomSheet from '@/features/share/components/ShareBottomSheet';
import { userProfileStyles as styles } from '@/features/user/styles/userProfile.styles';
import { useLanguage } from '@/hooks/useLanguage';

// Extracted UI Components
import UserProfileHeader from '@/features/user/components/UserProfileHeader';
import UserListModal from '@/features/user/components/UserListModal';
import EditProfileModal from '@/features/user/components/EditProfileModal';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const { colors: COLORS, isDark } = useTheme();
  const { user, updateUser } = useAuth();
  const { t, currentLanguage } = useLanguage();
  
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
    isShareModalVisible, shareData, openShareSheet, closeShareSheet, handleShareAction 
  } = useShareManager();

  if (loading) {
    return (
      <View className={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const isMe = user?.id === parseInt(id);

  return (
    <View className={styles.mainContainer}>
      <FlatList
        data={activeTab === 'comments' ? comments : publicLists}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <UserProfileHeader
            profile={profile}
            isMe={isMe}
            user={user}
            COLORS={COLORS}
            isDark={isDark}
            t={t}
            currentLanguage={currentLanguage}
            openShareSheet={openShareSheet}
            openUserList={openUserList}
            handleToggleFollow={handleToggleFollow}
            followLoading={followLoading}
            setNewUsername={setNewUsername}
            setEditProfileModal={setEditProfileModal}
            userSearchQuery={userSearchQuery}
            handleUserSearch={handleUserSearch}
            userSearchLoading={userSearchLoading}
            userSearchResults={userSearchResults}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        }
        renderItem={({ item }) => {
          if (activeTab === 'comments') {
            return <UserCommentItem comment={item} onToggleLike={handleToggleLike} onToggleDislike={handleToggleDislike} />;
          } else {
            return (
              <TouchableOpacity className={styles.listItem} onPress={() => router.push(`/shared-list/${item.id}`)}>
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
              {activeTab === 'comments' ? t('userProfile.noComments') : t('userProfile.noPublicLists')}
            </Text>
          </View>
        )}
        style={{ flex: 1 }}
        ListHeaderComponentStyle={{ marginBottom: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
      />
      
      <UserListModal 
        userListModal={userListModal}
        setUserListModal={setUserListModal}
        userListLoading={userListLoading}
        userList={userList}
        COLORS={COLORS}
        t={t}
      />

      <EditProfileModal 
        editProfileModal={editProfileModal}
        setEditProfileModal={setEditProfileModal}
        pickImage={pickImage}
        profile={profile}
        isUploadingImage={isUploadingImage}
        newUsername={newUsername}
        setNewUsername={setNewUsername}
        COLORS={COLORS}
        isSavingProfile={isSavingProfile}
        handleSaveUsername={handleSaveUsername}
        t={t}
      />

      <ShareBottomSheet 
        visible={isShareModalVisible} 
        onClose={closeShareSheet} 
        shareData={shareData} 
        onShare={handleShareAction} 
      />
    </View>
  );
}
