import React from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from '@/features/icon/components/Icon';
import { useTheme } from '@/context/ThemeContext';
import { CommentInputStyles as styles } from '../../styles';
import { useLanguage } from '@/hooks/useLanguage';

export default function CommentInputForm({ state, actions }) {
  const { colors: COLORS } = useTheme();
  const { t } = useLanguage();

  return (
    <View className={styles.container}>
      <View className={styles.inputWrapper}>
        <TextInput
          className={styles.quoteInput}
          value={state.newQuote}
          onChangeText={actions.setNewQuote}
          placeholder={t('commentsSection.quotePlaceholder')}
          placeholderTextColor={`${COLORS.textMuted}90`}
          multiline
        />
        <TextInput
          className={styles.textInput}
          value={state.newComment}
          onChangeText={actions.setNewComment}
          placeholder={t('commentsSection.commentPlaceholder')}
          placeholderTextColor={COLORS.textMuted}
          multiline
        />
      </View>
      <TouchableOpacity
        className={`${styles.submitButton} ${state.submitting ? styles.submitButtonDisabled : ''}`}
        onPress={actions.handleSubmitComment}
        disabled={state.submitting}
      >
        {state.submitting ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Icon name="PaperPlaneRight" size={18} color="#fff" weight="fill" />
        )}
      </TouchableOpacity>
    </View>
  );
}
