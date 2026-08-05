import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';
import ContentCard from '@/features/content/components/ContentCard';
import { LIBRARY_TABS } from '@/constants/library';
import { useLibrary } from '@/features/library/hooks/useLibrary';
import { libraryStyles as styles } from '@/features/library/styles/library.styles';

export default function LibraryScreen() {
  const { user } = useAuth();
  const { colors: COLORS, isDark } = useTheme();
  
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
        <Text className={styles.unauthenticatedText}>Kitaplığınızı görmek için giriş yapmalısınız.</Text>
      </View>
    );
  }

  return (
    <View className={styles.mainContainer}>
      <View className={styles.headerContainer}>
        <Text className={styles.headerTitle}>📚 Kitaplığım</Text>
        
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
        <View className={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {/* Listelerim Bölümü */}
          <View className={styles.listsHeaderContainer}>
            <Text className={styles.listsHeaderTitle}>Listelerim</Text>
            <View className={styles.createListButtonsContainer}>
              <TouchableOpacity onPress={() => { setNewListType('watching'); setShowCreateModal(true); }} className={styles.createListButton}>
                <Icon name="Plus" size={14} color={COLORS.primary} />
                <Text className={styles.createListButtonText}>İzleme</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setNewListType('reading'); setShowCreateModal(true); }} className={styles.createListButton}>
                <Icon name="Plus" size={14} color={COLORS.primary} />
                <Text className={styles.createListButtonText}>Okuma</Text>
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
                  <Text className={styles.sharedListSubtitle}>{list.member_count} Üye • {list.content_count} İçerik</Text>
                </TouchableOpacity>
              ))}
              <View className="w-8" />
            </ScrollView>
          )}

          <Text className={styles.personalLibraryTitle}>Kişisel Kitaplığım</Text>
          {filteredItems.length === 0 ? (
            <View className={styles.emptyLibraryContainer}>
              <Icon name="FolderOpen" size={48} color={COLORS.textMuted} weight="light" />
              <Text className={styles.emptyLibraryText}>Bu listede henüz içerik yok.</Text>
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

      {/* Yeni Liste Modalı */}
      {showCreateModal && (
        <View className={styles.modalOverlay}>
          <View className={styles.modalContainer}>
            <Text className={styles.modalTitle}>Yeni {newListType === 'watching' ? 'İzleme' : 'Okuma'} Listesi</Text>
            <View className={styles.modalInputContainer}>
              <TextInput
                className={styles.modalInput}
                placeholder="Liste Adı"
                placeholderTextColor={COLORS.textMuted}
                value={newListName}
                onChangeText={setNewListName}
                autoFocus
              />
            </View>
            <View className={styles.modalButtonsContainer}>
              <TouchableOpacity onPress={() => setShowCreateModal(false)} className={styles.modalCancelButton}>
                <Text className={styles.modalCancelText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreateList} className={styles.modalCreateButton}>
                <Text className={styles.modalCreateText}>Oluştur</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
