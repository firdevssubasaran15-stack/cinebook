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
import { Image } from 'expo-image';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import CommentsSection from '@/features/comments/components/CommentsSection';
import CommentItem from '@/features/comments/components/CommentItem';
import LibraryStatusSelector from '@/features/library/components/LibraryStatusSelector';
import EmotionTagSelector from '@/features/feelings/components/EmotionTagSelector';
import { useAuth } from '@/context/AuthContext';
import { GRADIENTS } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { API_BASE_URL } from '@/constants/api';
import { EMOTION_TAGS } from '@/constants/emotions';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@/features/icon/components/Icon';
import { useContentDetail } from '@/features/content/hooks/useContentDetail';
import { useFeelings } from '@/features/feelings/hooks/useFeelings';
import { detailStyles as styles } from '@/features/content/styles/detail.styles';
import { feelingsSectionStyles as fStyles } from '@/features/feelings/styles/feelingsSection.styles';
import { useShareManager } from '@/features/share/hooks/useShareManager';
import ShareBottomSheet from '@/features/share/components/ShareBottomSheet';

function FeelingsSection({ contentId, onShare }) {
  const { user, isAdmin, privileges } = useAuth();
  const { colors: COLORS } = useTheme();
  const isModerator = isAdmin || privileges?.can_moderate_content === 1;

  const {
    feelings,
    loading,
    tagFilter,
    setTagFilter,
    newText,
    setNewText,
    newTags,
    submitting,
    showForm,
    setShowForm,
    handleToggleTag,
    handleSubmit,
    handleDeleteFeeling,
    handleEditFeeling,
    handleToggleLike
  } = useFeelings(contentId, user);

  return (
    <View className={fStyles.mainContainer}>
      <View className={fStyles.headerRow}>
        <View className={fStyles.headerTitleRow}>
          <Icon name="Sparkle" size={20} color={COLORS.primary} weight="fill" />
          <Text className={fStyles.headerTitle}>Bana Hissettirdikleri</Text>
        </View>
        {privileges?.can_post_feelings !== 0 && (
          <TouchableOpacity
            className={fStyles.toggleFormButton}
            onPress={() => setShowForm(!showForm)}
          >
            <Text className={fStyles.toggleFormText}>{showForm ? 'İptal' : '+ Paylaş'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className={fStyles.tagsScroll}>
        <View className={fStyles.tagsRow}>
          {EMOTION_TAGS.map((tag) => {
            const isSelected = tagFilter === tag.id;
            const tagColor = COLORS[tag.id] || COLORS.textPrimary;
            return (
              <TouchableOpacity
                key={tag.id}
                className={`${fStyles.tagButtonBase} ${isSelected ? 'border-transparent' : fStyles.tagButtonUnselected}`}
                style={isSelected ? { backgroundColor: `${tagColor}25`, borderColor: tagColor } : {}}
                onPress={() => setTagFilter(isSelected ? null : tag.id)}
              >
                <View className={fStyles.tagIconContainer}>
                  <Icon name={tag.iconName} size={14} color={isSelected ? tagColor : COLORS.textSecondary} />
                </View>
                <Text className={`${fStyles.tagTextBase} ${isSelected ? '' : fStyles.tagTextUnselected}`} style={isSelected ? { color: tagColor } : {}}>{tag.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {showForm && (
        <View className={fStyles.formContainer}>
          <Text className={fStyles.formTitle}>Neler Hissettirdi?</Text>
          <TextInput
            className={fStyles.formInput}
            value={newText}
            onChangeText={setNewText}
            placeholder="Bu içerik sana neler hissettirdi? Özgürce yaz..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          <EmotionTagSelector selected={newTags} onToggle={handleToggleTag} />
          <TouchableOpacity
            className={`${fStyles.submitButtonBase} ${submitting ? 'opacity-60' : ''}`}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <LinearGradient colors={GRADIENTS.primary} className={fStyles.submitButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              {submitting ? <ActivityIndicator color="#fff" /> : (
                <View className={fStyles.submitButtonRow}>
                  <Text className={fStyles.submitButtonText}>Paylaş</Text>
                  <Icon name="Sparkle" size={16} color="#fff" weight="fill" />
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ActivityIndicator color={COLORS.primary} />
      ) : feelings.length === 0 ? (
        <Text className={fStyles.emptyText}>
          {tagFilter ? 'Bu etiketle paylaşım yok.' : 'Henüz kimse paylaşmamış. İlk sen ol!'}
        </Text>
      ) : (
        feelings.map((f) => (
          <CommentItem 
            key={f.id} 
            comment={f} 
            isFeeling 
            isOwner={user?.id === f.user_id}
            onEdit={handleEditFeeling}
            onToggleLike={handleToggleLike}
            onDelete={
              isModerator || f.user_id === user?.id 
                ? () => handleDeleteFeeling(f.id) 
                : undefined
            }
            onShare={onShare}
          />
        ))
      )}
    </View>
  );
}

// Ana Detay Ekranı
export default function DetailScreen() {
  const { colors: COLORS, isDark } = useTheme();
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { isAdmin } = useAuth();
  
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
    handleSaveEdit
  } = useContentDetail(id, navigation);

  if (loading) {
    return <View className={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  if (!content) {
    return <View className={styles.notFoundContainer}><Text className={styles.notFoundText}>İçerik bulunamadı.</Text></View>;
  }

  const typeIcon = content.type === 'movie' ? 'FilmStrip' : content.type === 'series' ? 'Television' : 'Books';
  const typeLabel = content.type === 'movie' ? 'Film' : content.type === 'series' ? 'Dizi' : 'Kitap';
  const authorLabel = content.type === 'book' ? 'Yazar' : 'Yönetmen';

  const coverUri = content.cover_image ? `${API_BASE_URL}${content.cover_image}` : null;

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView className={styles.scrollContainer}>
        <View className={styles.coverContainer}>
          {isEditing && editCover ? (
            <Image source={{ uri: editCover.uri }} className={styles.coverImage} contentFit="cover" />
          ) : coverUri ? (
            <Image source={{ uri: coverUri }} className={styles.coverImage} contentFit="cover" />
          ) : (
            <View className={styles.coverPlaceholder}>
              <Icon name={typeIcon} size={80} color={COLORS.textMuted} weight="light" />
            </View>
          )}
          
          {isEditing && (
            <TouchableOpacity 
              onPress={pickImage} 
              className={styles.changeCoverButton}
            >
              <Icon name="Camera" size={16} color="#fff" />
              <Text className={styles.changeCoverText}>Kapak Değiştir</Text>
            </TouchableOpacity>
          )}
          <LinearGradient colors={['transparent', isDark ? '#121212' : '#F9FAFB']} className={styles.gradientOverlay} />
        </View>

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
                <TouchableOpacity 
                  onPress={startEditing} 
                  className={styles.editButton}
                >
                  <Icon name="Pencil" size={14} color={COLORS.primary} weight="bold" />
                  <Text className={styles.editButtonText}>Düzenle</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleDeleteContent} 
                  className={styles.deleteButton}
                >
                  <Icon name="Trash" size={14} color="#ef4444" weight="bold" />
                  <Text className={styles.deleteButtonText}>Sil</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {isEditing ? (
            <View className={styles.editingContainer}>
              <View>
                <Text className={styles.editInputLabel}>Başlık</Text>
                <TextInput className={styles.editInput} value={editTitle} onChangeText={setEditTitle} />
              </View>
              <View>
                <Text className={styles.editInputLabel}>{authorLabel}</Text>
                <TextInput className={styles.editInput} value={editAuthor} onChangeText={setEditAuthor} />
              </View>
              <View>
                <Text className={styles.editInputLabel}>Özet</Text>
                <TextInput className={styles.editSummaryInput} value={editSummary} onChangeText={setEditSummary} multiline textAlignVertical="top" />
              </View>
              <View className={styles.editButtonsRow}>
                <TouchableOpacity className={styles.cancelEditButton} onPress={() => setIsEditing(false)}>
                  <Text className={styles.cancelEditText}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity className={styles.saveEditButton} onPress={handleSaveEdit} disabled={saving}>
                  {saving ? <ActivityIndicator size="small" color="#fff" /> : (
                    <>
                      <Icon name="Check" size={16} color="#fff" weight="bold" />
                      <Text className={styles.saveEditText}>Kaydet</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text className={styles.titleText}>{content.title}</Text>
              <Text className={styles.authorText}>{authorLabel}: {content.director_author}</Text>
              {content.summary ? (
                <View className={styles.summaryContainer}>
                  <Text className={styles.summaryTitle}>Özet</Text>
                  <Text className={styles.summaryText}>{content.summary}</Text>
                </View>
              ) : null}
            </>
          )}

          {content.top_emotions && content.top_emotions.length > 0 && (
            <View className={styles.topEmotionsContainer}>
              <Text className={styles.topEmotionsTitle}>Bu içerikte en çok hissedilenler:</Text>
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
