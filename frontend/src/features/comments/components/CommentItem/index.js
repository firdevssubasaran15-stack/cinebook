import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useCommentItem } from './useCommentItem';
import CommentHeader from './CommentHeader';
import CommentActions from './CommentActions';
import CommentContent from './CommentContent';
import { CommentEditForm, CommentReplyForm } from './CommentForms';

export default function CommentItem({ 
  comment, 
  isFeeling = false, 
  isOwner = false, 
  onDelete, 
  onEdit, 
  onToggleLike, 
  onToggleDislike, 
  onReply 
}) {
  const { state, actions } = useCommentItem({ comment, isFeeling, onEdit, onReply });

  return (
    <View className={`bg-light-surfaceElevated dark:bg-dark-surfaceElevated rounded-2xl p-4 mb-4 border border-light-border dark:border-dark-border shadow-sm overflow-hidden ${isFeeling ? 'border-l-4 border-l-brand-primary' : ''}`}>
      {!isFeeling && state.gradientColors[0] !== 'transparent' && (
        <LinearGradient
          colors={state.gradientColors}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 1 }}
        />
      )}
      
      <View className="flex-row mb-3">
        <CommentHeader comment={comment} />
        
        <CommentActions 
          comment={comment}
          isFeeling={isFeeling}
          isOwner={isOwner}
          isEditing={state.isEditing}
          isReplying={state.isReplying}
          onEdit={onEdit}
          onDelete={onDelete}
          onReply={onReply}
          onToggleLike={onToggleLike}
          onToggleDislike={onToggleDislike}
          actions={actions}
        />
      </View>

      {state.isEditing ? (
        <CommentEditForm 
          isFeeling={isFeeling} 
          state={state} 
          actions={actions} 
        />
      ) : (
        <CommentContent 
          comment={comment} 
          isFeeling={isFeeling} 
        />
      )}

      {state.isReplying && !state.isEditing && (
        <CommentReplyForm 
          state={state} 
          actions={actions} 
        />
      )}
    </View>
  );
}
