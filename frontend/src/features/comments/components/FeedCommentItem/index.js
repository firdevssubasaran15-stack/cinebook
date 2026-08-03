import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useFeedCommentItem } from './useFeedCommentItem';
import FeedCommentUserHeader from './FeedCommentUserHeader';
import FeedCommentContext from './FeedCommentContext';
import FeedCommentBody from './FeedCommentBody';
import FeedCommentActions from './FeedCommentActions';

export default function FeedCommentItem({ comment, onToggleLike, onToggleDislike }) {
  const { actions, gradientColors } = useFeedCommentItem({ comment, onToggleLike, onToggleDislike });

  return (
    <View className="rounded-2xl border bg-light-surfaceElevated border-light-border dark:bg-dark-surfaceElevated dark:border-dark-border p-4 mb-4 overflow-hidden">
      {gradientColors[0] !== 'transparent' && (
        <LinearGradient
          colors={gradientColors}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 1 }}
        />
      )}

      <FeedCommentUserHeader 
        comment={comment} 
        onPressUser={actions.handlePressUser} 
      />

      <FeedCommentContext 
        comment={comment} 
        onPressContent={actions.handlePressContent} 
      />

      <FeedCommentBody 
        comment={comment} 
      />

      <FeedCommentActions 
        comment={comment} 
        onLike={actions.handleLike} 
        onDislike={actions.handleDislike} 
      />
    </View>
  );
}
