import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '@/features/icon/components/Icon';
import { useTheme } from '@/context/ThemeContext';

export default function CommentActions({ 
  comment, 
  isFeeling, 
  isOwner, 
  isEditing, 
  isReplying,
  onEdit, 
  onDelete, 
  onReply, 
  onToggleLike, 
  onToggleDislike,
  actions 
}) {
  const { colors: COLORS } = useTheme();

  return (
    <View className="flex-row items-center gap-1.5 ml-2">
      {isOwner && onEdit && !isEditing && (
        <TouchableOpacity onPress={() => actions.setIsEditing(true)} className="p-1.5 rounded-full items-center justify-center bg-brand-primary/10">
          <Icon name="Pencil" size={16} color={COLORS.primary} weight="bold" />
        </TouchableOpacity>
      )}
      {onDelete && (
        <TouchableOpacity onPress={onDelete} className="p-1.5 rounded-full items-center justify-center bg-status-error/10">
          <Icon name="Trash" size={16} color={COLORS.error} weight="bold" />
        </TouchableOpacity>
      )}
      {onReply && !isFeeling && !isEditing && (
        <TouchableOpacity onPress={() => actions.setIsReplying(!isReplying)} className="p-1.5 rounded-full items-center justify-center">
          <Icon name="ChatCircle" size={16} color={COLORS.primary} weight={isReplying ? "fill" : "bold"} />
        </TouchableOpacity>
      )}
      {onToggleLike && (
        <TouchableOpacity 
          onPress={() => onToggleLike(comment.id)} 
          className={`flex-row items-center gap-1 p-1.5 rounded-full ${comment.is_liked_by_user ? 'bg-status-error/20' : 'bg-light-border dark:bg-dark-border/20'}`}
        >
          <Icon 
            name="Heart" 
            size={16} 
            color={comment.is_liked_by_user ? COLORS.error : COLORS.textMuted} 
            weight={comment.is_liked_by_user ? "fill" : "bold"} 
          />
          <Text style={{ fontSize: 12, fontWeight: '600', color: comment.is_liked_by_user ? COLORS.error : COLORS.textMuted }}>
            {comment.like_count || 0}
          </Text>
        </TouchableOpacity>
      )}
      {onToggleDislike && !isFeeling && (
        <TouchableOpacity 
          onPress={() => onToggleDislike(comment.id)} 
          className={`flex-row items-center gap-1 p-1.5 rounded-full ${comment.is_disliked_by_user ? 'bg-brand-primary/20' : 'bg-light-border dark:bg-dark-border/20'}`}
        >
          <Icon 
            name="ThumbsDown" 
            size={16} 
            color={comment.is_disliked_by_user ? COLORS.primary : COLORS.textMuted} 
            weight={comment.is_disliked_by_user ? "fill" : "bold"} 
          />
          <Text style={{ fontSize: 12, fontWeight: '600', color: comment.is_disliked_by_user ? COLORS.primary : COLORS.textMuted }}>
            {comment.dislike_count || 0}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
