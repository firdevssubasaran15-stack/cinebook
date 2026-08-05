import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import CommentsSection from '@/features/comments/components/CommentsSection';
import LibraryStatusSelector from '@/features/library/components/LibraryStatusSelector';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { API_BASE_URL } from '@/constants/api';
import { EMOTION_TAGS } from '@/constants/emotions';
import Icon from '@/features/icon/components/Icon';
import { useContentDetail } from '@/features/content/hooks/useContentDetail';
import { detailStyles as styles } from '@/features/content/styles/detail.styles';
import { useShareManager } from '@/features/share/hooks/useShareManager';
import ShareBottomSheet from '@/features/share/components/ShareBottomSheet';
import FeelingsSection from '@/features/feelings/components/FeelingsSection';
import ContentEditForm from '@/features/content/components/ContentEditForm';
import ContentCover from '@/features/content/components/ContentCover';
import { useLanguage } from '@/hooks/useLanguage';

// Ana Detay Ekranı
export default function DetailScreen() {
  const { colors: COLORS, isDark } = useTheme();
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  
  const { 
    isShareModalVisible, 
    shareData, 
    openShareSheet, 
    closeShareSheet, 
    handleShareAction 
  } = useShareManager();

  const {
    content,
    loading,
    isEditing,
    setIsEditing,
    editTitle,
    setEditTitle,
    editAuthor,
    setEditAuthor,
    editSummary,
    setEditSummary,
    editCover,
    saving,
    handleDeleteContent,
    startEditing,
    pickImage,
    handleSaveEdit,
    isPickingImage
  } = useContentDetail(id, navigation);

  if (loading) {
    return <View className={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  if (!content) {
    return <View className={styles.notFoundContainer}><Text className={styles.notFoundText}>{t('detail.notFoundText')}</Text></View>;
  }

  const typeIcon = content.type === 'movie' ? 'FilmStrip' : content.type === 'series' ? 'Television' : 'Books';
  const typeLabel = content.type === 'movie' ? t('detail.movie') : content.type === 'series' ? t('detail.series') : t('detail.book');
  const authorLabel = content.type === 'book' ? t('detail.author') : t('detail.director');

  const coverUri = content.cover_image ? `${API_BASE_URL}${content.cover_image}` : null;

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView className={styles.scrollContainer}>
        <ContentCover
          isEditing={isEditing}
          editCover={editCover}
          coverUri={coverUri}
          typeIcon={typeIcon}
          isPickingImage={isPickingImage}
          saving={saving}
          onPickImage={pickImage}
        />

        <View className={styles.contentInfoContainer}>
          <View className={styles.headerRow}>
            <View className={styles.typeBadge}>
              <View className={styles.typeBadgeRow}>
                <Icon name={typeIcon} size={14} color={COLORS.primary} weight="bold" />
                <Text className={styles.typeBadgeText}>{typeLabel}</Text>
              </View>
            </View>
            
            {isAdmin && !isEditing && (
              <View className={styles.adminButtonsRow}>
                <TouchableOpacity onPress={startEditing} className={styles.editButton}>
                  <Icon name="Pencil" size={14} color={COLORS.primary} weight="bold" />
                  <Text className={styles.editButtonText}>{t('detail.edit')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeleteContent} className={styles.deleteButton}>
                  <Icon name="Trash" size={14} color="#ef4444" weight="bold" />
                  <Text className={styles.deleteButtonText}>{t('detail.delete')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {isEditing ? (
            <ContentEditForm
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              editAuthor={editAuthor}
              setEditAuthor={setEditAuthor}
              editSummary={editSummary}
              setEditSummary={setEditSummary}
              authorLabel={authorLabel}
              saving={saving}
              onCancel={() => setIsEditing(false)}
              onSave={handleSaveEdit}
            />
          ) : (
            <>
              <Text className={styles.titleText}>{content.title}</Text>
              <Text className={styles.authorText}>{authorLabel}: {content.director_author}</Text>
              {content.summary ? (
                <View className={styles.summaryContainer}>
                  <Text className={styles.summaryTitle}>{t('detail.summary')}</Text>
                  <Text className={styles.summaryText}>{content.summary}</Text>
                </View>
              ) : null}
            </>
          )}

          {content.top_emotions && content.top_emotions.length > 0 && (
            <View className={styles.topEmotionsContainer}>
              <Text className={styles.topEmotionsTitle}>{t('detail.topEmotionsTitle')}</Text>
              <View className={styles.topEmotionsRow}>
                {content.top_emotions.map(tagId => {
                  const tagData = EMOTION_TAGS.find(t => t.id === tagId);
                  if (!tagData) return null;
                  const tagColor = COLORS[tagId] || COLORS.textPrimary;
                  return (
                    <View key={tagId} className={styles.topEmotionTag} style={{ backgroundColor: `${tagColor}15`, borderColor: `${tagColor}40` }}>
                      <Icon name={tagData.iconName} size={14} color={tagColor} weight="fill" />
                      <Text className={styles.topEmotionText} style={{ color: tagColor }}>{tagData.label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          <LibraryStatusSelector contentId={id} type={content.type} />
        </View>

        <CommentsSection contentId={id} onShare={openShareSheet} />
        <FeelingsSection contentId={id} onShare={openShareSheet} />

        <View className="h-12" />
      </ScrollView>
      <ShareBottomSheet 
        visible={isShareModalVisible} 
        onClose={closeShareSheet} 
        shareData={shareData} 
        onShare={handleShareAction} 
      />
    </KeyboardAvoidingView>
  );
}
