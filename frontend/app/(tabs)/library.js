import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';
import ContentCard from '@/features/content/components/ContentCard';
import { useLibrary } from '@/features/library/hooks/useLibrary';
import { libraryStyles as styles } from '@/features/library/styles/library.styles';
import { useLanguage } from '@/hooks/useLanguage';
import LibraryTabs from '@/features/library/components/LibraryTabs';
import CreateListModal from '@/features/library/components/CreateListModal';

export default function LibraryScreen() {
  const { user } = useAuth();
  const { colors: COLORS, isDark } = useTheme();
  const { t } = useLanguage();
  
  const {
    loading,
    activeTab,
    setActiveTab,
    sharedLists,
    filteredItems,
    showCreateModal,
    setShowCreateModal,
    newListName,
    setNewListName,
    newListType,
    setNewListType,
    handleCreateList
  } = useLibrary(user);

  if (!user) {
    return (
      <View className={styles.unauthenticatedContainer}>
        <Icon name="LockKey" size={48} color={COLORS.textMuted} />
        <Text className={styles.unauthenticatedText}>{t('library.loginToView')}</Text>
      </View>
    );
  }

  return (
    <View className={styles.mainContainer}>
      <View className={styles.headerContainer}>
        <Text className={styles.headerTitle}>{t('library.myLibraryTitle')}</Text>
        <LibraryTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>

      {loading ? (
        <View className={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {/* Listelerim Bölümü */}
          <View className={styles.listsHeaderContainer}>
            <Text className={styles.listsHeaderTitle}>{t('library.myLists')}</Text>
            <View className={styles.createListButtonsContainer}>
              <TouchableOpacity onPress={() => { setNewListType('watching'); setShowCreateModal(true); }} className={styles.createListButton}>
                <Icon name="Plus" size={14} color={COLORS.primary} />
                <Text className={styles.createListButtonText}>{t('library.watchListBtn')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setNewListType('reading'); setShowCreateModal(true); }} className={styles.createListButton}>
                <Icon name="Plus" size={14} color={COLORS.primary} />
                <Text className={styles.createListButtonText}>{t('library.readListBtn')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {sharedLists.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className={styles.sharedListsScroll}>
              {sharedLists.map(list => (
                <TouchableOpacity 
                  key={list.id} 
                  className={styles.sharedListCard}
                  onPress={() => router.push(`/shared-list/${list.id}`)}
                >
                  <View className={styles.sharedListIconContainer} style={{ backgroundColor: list.type === 'watching' ? '#E91E6320' : '#2196F320' }}>
                    <Icon name={list.type === 'watching' ? 'MonitorPlay' : 'BookOpen'} size={24} color={list.type === 'watching' ? '#E91E63' : '#2196F3'} weight="fill" />
                  </View>
                  <Text className={styles.sharedListTitle} numberOfLines={1}>{list.name}</Text>
                  <Text className={styles.sharedListSubtitle}>{t('library.memberCount', { count: list.member_count })} • {t('library.contentCount', { count: list.content_count })}</Text>
                </TouchableOpacity>
              ))}
              <View className="w-8" />
            </ScrollView>
          )}

          <Text className={styles.personalLibraryTitle}>{t('library.personalLibrary')}</Text>
          {filteredItems.length === 0 ? (
            <View className={styles.emptyLibraryContainer}>
              <Icon name="FolderOpen" size={48} color={COLORS.textMuted} weight="light" />
              <Text className={styles.emptyLibraryText}>{t('library.emptyLibrary')}</Text>
            </View>
          ) : (
            <View className={styles.gridContainer}>
              {filteredItems.map(item => (
                <View key={item.library_id} className={styles.gridItem}>
                  <ContentCard item={item} onPress={() => router.push(`/detail/${item.id}`)} />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      <CreateListModal 
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        listType={newListType}
        listName={newListName}
        setListName={setNewListName}
        onCreate={handleCreateList}
      />
    </View>
  );
}
