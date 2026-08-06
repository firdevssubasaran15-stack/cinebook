import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';
import ContentCard from '@/features/content/components/ContentCard';
import { useSharedListDetail } from '@/features/shared-lists/hooks/useSharedListDetail';
import { sharedListDetailStyles as styles } from '@/features/shared-lists/styles/sharedListDetail.styles';
import { useLanguage } from '@/hooks/useLanguage';

import SharedListHeader from '@/features/shared-lists/components/SharedListHeader';
import SharedListTopActions from '@/features/shared-lists/components/SharedListTopActions';
import SharedListMembers from '@/features/shared-lists/components/SharedListMembers';
import InviteUserModal from '@/features/shared-lists/components/InviteUserModal';
import AddContentModal from '@/features/shared-lists/components/AddContentModal';

export default function SharedListDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { colors: COLORS } = useTheme();
  const { t } = useLanguage();

  const {
    list,
    loading,
    showInviteModal,
    setShowInviteModal,
    searchQuery,
    searchResults,
    inviteLoading,
    visibilityLoading,
    saveLoading,
    showContentModal,
    setShowContentModal,
    contentSearchQuery,
    contentSearchResults,
    contentSearchLoading,
    handleSearchUsers,
    handleInviteUser,
    handleSearchContents,
    handleAddContent,
    handleToggleVisibility,
    handleToggleSave
  } = useSharedListDetail(id);

  if (loading || !list) {
    return <View className={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  const isOwner = list.owner_id === user?.id;
  const canAddContent = isOwner || list.members?.some(m => m.id === user?.id && m.status === 'accepted');

  return (
    <View className={styles.mainContainer}>
      <SharedListHeader 
        list={list}
        isOwner={isOwner}
        visibilityLoading={visibilityLoading}
        handleToggleVisibility={handleToggleVisibility}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <SharedListTopActions 
          list={list}
          isOwner={isOwner}
          saveLoading={saveLoading}
          setShowInviteModal={setShowInviteModal}
          handleToggleSave={handleToggleSave}
        />

        <SharedListMembers members={list.members} />

        <View className={styles.contentsHeaderRow}>
          <Text className={styles.contentsTitle}>{t('sharedList.contents')} ({list.contents?.length || 0})</Text>
          {canAddContent && (
            <TouchableOpacity onPress={() => setShowContentModal(true)} className={styles.addContentButton}>
              <Icon name="Plus" size={14} color={COLORS.primary} />
              <Text className={styles.addContentButtonText}>{t('sharedList.addContent')}</Text>
            </TouchableOpacity>
          )}
        </View>
        {list.contents?.length === 0 ? (
          <View className={styles.emptyContentsContainer}>
            <Icon name="FolderOpen" size={48} color={COLORS.textMuted} weight="light" />
            <Text className={styles.emptyContentsTitle}>{t('sharedList.emptyContentsTitle')}</Text>
            <Text className={styles.emptyContentsSubtitle}>{t('sharedList.emptyContentsSubtitle')}</Text>
          </View>
        ) : (
          <View className={styles.contentsGrid}>
            {list.contents?.map(content => (
              <View key={content.id} className={styles.contentItem}>
                <ContentCard item={content} onPress={() => router.push(`/detail/${content.id}`)} />
                <Text className={styles.contentAddedBy}>{t('sharedList.addedBy')}: @{content.added_by_username}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <InviteUserModal 
        visible={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        searchQuery={searchQuery}
        setSearchQuery={handleSearchUsers}
        searchResults={searchResults}
        inviteLoading={inviteLoading}
        handleInviteUser={handleInviteUser}
      />

      <AddContentModal 
        visible={showContentModal}
        onClose={() => setShowContentModal(false)}
        listType={list.type}
        searchQuery={contentSearchQuery}
        setSearchQuery={handleSearchContents}
        searchResults={contentSearchResults}
        loading={contentSearchLoading}
        handleAddContent={handleAddContent}
      />
    </View>
  );
}
