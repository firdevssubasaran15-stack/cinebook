import React from 'react';
import { View, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useFeedCommentItem } from './useFeedCommentItem';
import { useContentColorPalette } from '../../hooks/useContentColorPalette';
import { useAmbientShadow } from '../../../home/hooks/useAmbientShadow';
import FeedCommentUserHeader from './FeedCommentUserHeader';
import FeedCommentContext from './FeedCommentContext';
import FeedCommentBody from './FeedCommentBody';
import FeedCommentActions from './FeedCommentActions';

import { useTheme } from '@/context/ThemeContext';

export default function FeedCommentItem({ comment, onToggleLike, onToggleDislike, onShare }) {
  const { actions } = useFeedCommentItem({ comment, onToggleLike, onToggleDislike });
  const { gradientColors, themeColor } = useContentColorPalette(
    comment.content_type,
    comment.like_count,
    comment.dislike_count
  );
  
  const { animatedShadowStyle } = useAmbientShadow(themeColor);

  return (
    <Animated.View 
      className="rounded-2xl border bg-light-surfaceElevated dark:bg-dark-surfaceElevated p-4 mb-4 overflow-hidden"
      style={[
        { borderColor: themeColor + '60' }, // 60 for better visibility of border color
        animatedShadowStyle
      ]}
    >
      {/* Subtle Transparent Gradient Overlay */}
      {gradientColors && gradientColors[0] !== 'transparent' && (
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
          themeColor={themeColor}
        />

        <FeedCommentBody 
          comment={comment} 
        />

        <FeedCommentActions 
          comment={comment} 
          onLike={actions.handleLike} 
          onDislike={actions.handleDislike} 
          onShare={onShare}
        />
    </Animated.View>
  );
}
