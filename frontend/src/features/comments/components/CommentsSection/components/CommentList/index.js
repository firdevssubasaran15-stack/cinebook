import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import CommentThread from '../../../CommentThread';
import { CommentsSectionStyles as styles } from '../../styles';
import { useLanguage } from '@/hooks/useLanguage';

export default function CommentList({ state, actions, user, isModerator, privileges, onShare }) {
  const { colors: COLORS } = useTheme();
  const { t } = useLanguage();

  if (state.loading) {
    return <ActivityIndicator color={COLORS.primary} />;
  }

  if (state.commentTree.length === 0) {
    return (
      <Text className={styles.emptyState}>
        {t('commentsSection.empty')}
      </Text>
    );
  }

  return (
    <View className={styles.listContainer}>
      {state.commentTree.map((comment) => (
        <CommentThread
          key={comment.id}
          comment={comment}
          depth={0}
          user={user}
          isModerator={isModerator}
          privileges={privileges}
          onEdit={actions.handleEditComment}
          onToggleLike={actions.handleToggleLike}
          onToggleDislike={actions.handleToggleDislike}
          onReply={actions.handleReplyComment}
          onDelete={actions.handleDeleteComment}
          onShare={onShare}
        />
      ))}
    </View>
  );
}
