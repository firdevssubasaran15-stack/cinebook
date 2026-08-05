import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Image as RNImage } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';
import ContentCard from '@/features/content/components/ContentCard';
import { API_BASE_URL } from '@/constants/api';
import { useSharedListDetail } from '@/features/shared-lists/hooks/useSharedListDetail';
import { sharedListDetailStyles as styles } from '@/features/shared-lists/styles/sharedListDetail.styles';

export default function SharedListDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { colors: COLORS } = useTheme();

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
      <View className={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} className={styles.backButton}>
          <Icon name="CaretLeft" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text className={styles.headerTitle} numberOfLines={1}>
          {list.name}
        </Text>
        {isOwner ? (
          <TouchableOpacity onPress={handleToggleVisibility} className={styles.visibilityButton} disabled={visibilityLoading}>
            {visibilityLoading ? (
               <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
               <Icon name={list.is_public ? "Eye" : "LockKey"} size={22} color={COLORS.textPrimary} />
            )}
          </TouchableOpacity>
        ) : (
          <View className={styles.visibilityIcon}>
            <Icon name={list.is_public ? "Eye" : "LockKey"} size={22} color={COLORS.textMuted} />
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View className={styles.topActionsRow}>
          <Text className={styles.listTypeSubtitle}>
            {list.type === 'watching' ? '🎬 İzleme Listesi' : '📚 Okuma Listesi'}
          </Text>
          {isOwner && (
            <TouchableOpacity onPress={() => setShowInviteModal(true)} className={styles.inviteButton}>
              <Icon name="UserPlus" size={16} color="#fff" />
              <Text className={styles.inviteButtonText}>Davet Et</Text>
            </TouchableOpacity>
          )}
          {!isOwner && list.is_public === 1 && (
             <TouchableOpacity onPress={handleToggleSave} disabled={saveLoading} className={`${styles.saveButtonBase} ${list.is_saved_by_user ? styles.saveButtonSaved : styles.saveButtonNotSaved}`}>
                {saveLoading ? (
                  <ActivityIndicator size="small" color={list.is_saved_by_user ? COLORS.primary : '#fff'} />
                ) : (
                  <>
                    <Icon name={list.is_saved_by_user ? "Check" : "BookmarkSimple"} size={16} color={list.is_saved_by_user ? COLORS.primary : '#fff'} />
                    <Text className={`${styles.saveButtonTextBase} ${list.is_saved_by_user ? styles.saveButtonTextSaved : styles.saveButtonTextNotSaved}`}>{list.is_saved_by_user ? 'Kaydedildi' : 'Kaydet'}</Text>
                  </>
                )}
             </TouchableOpacity>
          )}
        </View>

        {/* Üyeler */}
        <Text className={styles.sectionTitle}>Üyeler ({list.members?.length || 0})</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className={styles.membersScroll}>
          {list.members?.map(m => (
            <View key={m.id} className={styles.memberItem}>
              <View className={styles.memberAvatarContainer}>
                {m.profile_image ? (
                  <RNImage source={{ uri: `${API_BASE_URL}${m.profile_image}` }} className={styles.memberAvatarImage} />
                ) : (
                  <Text className={styles.memberAvatarFallback}>{m.username[0].toUpperCase()}</Text>
                )}
              </View>
              <Text className={styles.memberUsername} numberOfLines={1}>@{m.username}</Text>
              <Text className={`${styles.memberRoleBase} ${m.status === 'owner' ? styles.memberRoleOwner : styles.memberRoleOther}`}>
                {m.status === 'owner' ? 'Kurucu' : m.status === 'pending' ? 'Bekliyor' : 'Üye'}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* İçerikler */}
        <View className={styles.contentsHeaderRow}>
          <Text className={styles.contentsTitle}>İçerikler ({list.contents?.length || 0})</Text>
          {canAddContent && (
            <TouchableOpacity onPress={() => setShowContentModal(true)} className={styles.addContentButton}>
              <Icon name="Plus" size={14} color={COLORS.primary} />
              <Text className={styles.addContentButtonText}>İçerik Ekle</Text>
            </TouchableOpacity>
          )}
        </View>
        {list.contents?.length === 0 ? (
          <View className={styles.emptyContentsContainer}>
            <Icon name="FolderOpen" size={48} color={COLORS.textMuted} weight="light" />
            <Text className={styles.emptyContentsTitle}>Bu listede henüz içerik yok.</Text>
            <Text className={styles.emptyContentsSubtitle}>İçerik sayfalarındaki "Listeye Ekle" butonunu kullanarak buraya ekleme yapabilirsiniz.</Text>
          </View>
        ) : (
          <View className={styles.contentsGrid}>
            {list.contents?.map(content => (
              <View key={content.id} className={styles.contentItem}>
                <ContentCard item={content} onPress={() => router.push(`/detail/${content.id}`)} />
                <Text className={styles.contentAddedBy}>Ekleyen: @{content.added_by_username}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Davet Modalı */}
      {showInviteModal && (
        <View className={styles.modalOverlay}>
          <View className={styles.modalContainer}>
            <View className={styles.modalHeaderRow}>
              <Text className={styles.modalTitle}>Kullanıcı Davet Et</Text>
              <TouchableOpacity onPress={() => setShowInviteModal(false)}><Icon name="X" size={24} color={COLORS.textSecondary} /></TouchableOpacity>
            </View>
            <View className={styles.modalInputContainer}>
              <TextInput
                className={styles.modalInput}
                placeholder="Kullanıcı adı ara..."
                placeholderTextColor={COLORS.textMuted}
                value={searchQuery}
                onChangeText={handleSearchUsers}
              />
            </View>
            {inviteLoading && <ActivityIndicator size="small" color={COLORS.primary} className={styles.modalLoader} />}
            <ScrollView className={styles.modalScroll}>
              {searchResults.map(u => (
                <TouchableOpacity 
                  key={u.id} 
                  className={styles.searchResultItem}
                >
                  <Text className={styles.searchResultText}>@{u.username}</Text>
                  <TouchableOpacity onPress={() => handleInviteUser(u.id)} className={styles.searchResultActionBtn}>
                    <Text className={styles.searchResultActionText}>Davet Et</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
              {searchResults.length === 0 && searchQuery.length >= 2 && !inviteLoading && (
                <Text className={styles.emptySearchText}>Kullanıcı bulunamadı.</Text>
              )}
            </ScrollView>
          </View>
        </View>
      )}

      {/* İçerik Ekleme Modalı */}
      {showContentModal && (
        <View className={styles.modalOverlay}>
          <View className={styles.modalContainer}>
            <View className={styles.modalHeaderRow}>
              <Text className={styles.modalTitle}>İçerik Ara & Ekle</Text>
              <TouchableOpacity onPress={() => setShowContentModal(false)}><Icon name="X" size={24} color={COLORS.textSecondary} /></TouchableOpacity>
            </View>
            <View className={styles.modalInputContainer}>
              <TextInput
                className={styles.modalInput}
                placeholder={list.type === 'watching' ? "Film veya dizi ara..." : "Kitap ara..."}
                placeholderTextColor={COLORS.textMuted}
                value={contentSearchQuery}
                onChangeText={handleSearchContents}
              />
            </View>
            {contentSearchLoading && <ActivityIndicator size="small" color={COLORS.primary} className={styles.modalLoader} />}
            <ScrollView className={styles.modalScroll}>
              {contentSearchResults.map(c => (
                <TouchableOpacity 
                  key={c.id} 
                  className={styles.searchResultItem}
                >
                  <View className="flex-1 pr-2.5">
                    <Text className={styles.searchResultText} numberOfLines={1}>{c.title}</Text>
                    <Text className={styles.searchResultSubtitle} numberOfLines={1}>{c.director_author}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleAddContent(c.id)} className={styles.searchResultActionBtn}>
                    <Text className={styles.searchResultActionText}>Ekle</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
              {contentSearchResults.length === 0 && contentSearchQuery.length >= 2 && !contentSearchLoading && (
                <Text className={styles.emptySearchText}>İçerik bulunamadı.</Text>
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}
