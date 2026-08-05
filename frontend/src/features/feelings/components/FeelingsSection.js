import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { GRADIENTS } from '@/constants/colors';
import { EMOTION_TAGS } from '@/constants/emotions';

import Icon from '@/features/icon/components/Icon';
import EmotionTagSelector from '@/features/feelings/components/EmotionTagSelector';
import CommentItem from '@/features/comments/components/CommentItem';
import { useFeelings } from '@/features/feelings/hooks/useFeelings';
import { feelingsSectionStyles as fStyles } from '@/features/feelings/styles/feelingsSection.styles';

export default function FeelingsSection({ contentId, onShare }) {
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
