import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useUserCommentItem } from './useUserCommentItem';
import UserCommentContext from './UserCommentContext';
import UserCommentBody from './UserCommentBody';
import UserCommentFooter from './UserCommentFooter';

export default function UserCommentItem({ comment, onToggleLike, onToggleDislike }) {
  const { actions, gradientColors } = useUserCommentItem({ comment, onToggleLike, onToggleDislike });

  return (
    <View className="rounded-2xl border bg-light-surfaceElevated border-light-border dark:bg-dark-surfaceElevated dark:border-dark-border p-4 mb-4 mx-5 overflow-hidden">
      {gradientColors[0] !== 'transparent' && (
        <LinearGradient
          colors={gradientColors}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 1 }}
        />
      )}
      
      <UserCommentContext 
        comment={comment} 
        onPressContent={actions.handlePressContent} 
      />
      
      <UserCommentBody 
        comment={comment} 
      />
      
      <UserCommentFooter 
        comment={comment} 
        onLike={actions.handleLike} 
        onDislike={actions.handleDislike} 
      />
    </View>
  );
}
