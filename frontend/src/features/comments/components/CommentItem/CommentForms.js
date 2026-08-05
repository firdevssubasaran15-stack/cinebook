import React from 'react';
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import EmotionTagSelector from '@/features/feelings/components/EmotionTagSelector';
import { useLanguage } from '@/hooks/useLanguage';

export function CommentEditForm({ isFeeling, state, actions }) {
  const { colors: COLORS } = useTheme();
  const { t } = useLanguage();

  return (
    <View className="mt-2">
      {!isFeeling && (
        <TextInput
          className="bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl px-3 py-2 text-text-lightPrimary dark:text-text-darkPrimary text-xs italic mb-2"
          value={state.editQuote}
          onChangeText={actions.setEditQuote}
          placeholder={t('commentsSection.quotePlaceholder')}
          placeholderTextColor={`${COLORS.textMuted}90`}
          multiline
          numberOfLines={2}
        />
      )}
      <TextInput
        className="bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl p-3 text-text-lightPrimary dark:text-text-darkPrimary text-sm min-h-[80px]"
        value={state.editText}
        onChangeText={actions.setEditText}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
      {isFeeling && (
        <View style={{ marginTop: -10 }}>
          <EmotionTagSelector selected={state.editTags} onToggle={actions.handleToggleTag} />
        </View>
      )}
      <View className="flex-row justify-end items-center gap-3 mt-3">
        <TouchableOpacity className="py-2" onPress={actions.handleCancel} disabled={state.submitting}>
          <Text className="text-text-lightSecondary dark:text-text-darkSecondary font-semibold">{t('contentEdit.cancel')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`bg-brand-primary rounded-lg py-2 px-4 ${state.submitting ? 'opacity-60' : ''}`} 
          onPress={actions.handleSave} 
          disabled={state.submitting}
        >
          {state.submitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-semibold">{t('contentEdit.save')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function CommentReplyForm({ state, actions }) {
  const { colors: COLORS } = useTheme();
  const { t } = useLanguage();

  return (
    <View className="mt-3 pt-3 border-t border-light-border dark:border-dark-border">
      <TextInput
        className="bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl px-3 py-2 text-text-lightPrimary dark:text-text-darkPrimary text-sm mb-2"
        value={state.replyText}
        onChangeText={actions.setReplyText}
        placeholder={t('commentsSection.replyPlaceholder')}
        placeholderTextColor={COLORS.textMuted}
        multiline
        numberOfLines={2}
      />
      <View className="flex-row justify-end items-center gap-3 mt-1">
        <TouchableOpacity className="py-2" onPress={() => actions.setIsReplying(false)} disabled={state.replySubmitting}>
          <Text className="text-text-lightSecondary dark:text-text-darkSecondary font-semibold">{t('contentEdit.cancel')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`bg-brand-primary rounded-lg py-2 px-4 ${state.replySubmitting ? 'opacity-60' : ''}`} 
          onPress={actions.handleReplySubmit} 
          disabled={state.replySubmitting}
        >
          {state.replySubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-semibold">{t('commentsSection.reply')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
