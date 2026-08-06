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
import Icon from '@/features/icon/components/Icon';
import { useContentDetail } from '@/features/content/hooks/useContentDetail';
import { detailStyles as styles } from '@/features/content/styles/detail.styles';
import { useShareManager } from '@/features/share/hooks/useShareManager';
import ShareBottomSheet from '@/features/share/components/ShareBottomSheet';
import FeelingsSection from '@/features/feelings/components/FeelingsSection';
import ContentEditForm from '@/features/content/components/ContentEditForm';
import ContentCover from '@/features/content/components/ContentCover';
import { useLanguage } from '@/hooks/useLanguage';
import ContentHeader from '@/features/content/components/ContentHeader';
import ContentInfo from '@/features/content/components/ContentInfo';
import TopEmotionsList from '@/features/content/components/TopEmotionsList';

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
    multiLang,
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
          <ContentHeader 
            typeIcon={typeIcon} 
            typeLabel={typeLabel} 
            isAdmin={isAdmin} 
            isEditing={isEditing} 
            onEdit={startEditing} 
            onDelete={handleDeleteContent} 
          />

          {isEditing ? (
            <ContentEditForm
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              editAuthor={editAuthor}
              setEditAuthor={setEditAuthor}
              multiLang={multiLang}
              authorLabel={authorLabel}
              saving={saving}
              onCancel={() => setIsEditing(false)}
              onSave={handleSaveEdit}
            />
          ) : (
            <ContentInfo content={content} authorLabel={authorLabel} />
          )}

          <TopEmotionsList topEmotions={content.top_emotions} />

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
