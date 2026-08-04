import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';

import { useCommentsSection } from './useCommentsSection';
import CommentInputForm from './components/CommentInputForm';
import CommentList from './components/CommentList';
import { CommentsSectionStyles as styles } from './styles';

export default function CommentsSection({ contentId }) {
  const { user, isAdmin, privileges } = useAuth();
  const { colors: COLORS } = useTheme();
  
  const isModerator = isAdmin || privileges?.can_moderate_content === 1;
  const canComment = privileges?.can_comment !== 0;

  // Facade Hook
  const { state, actions } = useCommentsSection(contentId, user);

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Icon name="ChatCircle" size={20} color={COLORS.primary} weight="fill" />
        <Text className={styles.title}>Yorumlar</Text>
      </View>

      {canComment && <CommentInputForm state={state} actions={actions} />}

      <CommentList 
        state={state} 
        actions={actions} 
        user={user} 
        isModerator={isModerator} 
        privileges={privileges} 
      />
    </View>
  );
}
