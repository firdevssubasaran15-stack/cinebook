import React from 'react';
import { View } from 'react-native';
import CommentItem from '../CommentItem';

/**
 * Recursive component to render a comment and all its nested replies.
 * Uses Composite Pattern for UI rendering.
 */
export default function CommentThread({
  comment,
  depth = 0,
  user,
  isModerator,
  privileges,
  onEdit,
  onToggleLike,
  onToggleDislike,
  onReply,
  onDelete,
}) {
  // Max depth is typically limited in UI to avoid squishing the layout.
  // We'll cap indentation visually at 4-5 levels, but still allow infinite replies in data.
  const visualDepth = Math.min(depth, 4);

  const isOwner = user?.id === comment.user_id;
  const canDelete = isModerator || isOwner;
  const canReply = privileges?.can_comment !== 0;

  return (
    <View className="w-full">
      <View
        style={{
          marginLeft: visualDepth > 0 ? 16 : 0,
          borderLeftWidth: visualDepth > 0 ? 2 : 0,
          borderColor: 'rgba(99, 102, 241, 0.3)', // brand-primary with opacity
          paddingLeft: visualDepth > 0 ? 12 : 0,
          marginTop: visualDepth > 0 ? -4 : 0,
        }}
      >
        <CommentItem
          comment={comment}
          isFeeling={false}
          isOwner={isOwner}
          onEdit={onEdit}
          onToggleLike={onToggleLike}
          onToggleDislike={onToggleDislike}
          onReply={canReply ? onReply : undefined}
          onDelete={canDelete ? () => onDelete(comment.id) : undefined}
        />
      </View>

      {/* Render children recursively */}
      {comment.children && comment.children.length > 0 && (
        <View className="w-full">
          {comment.children.map((child) => (
            <CommentThread
              key={child.id}
              comment={child}
              depth={depth + 1}
              user={user}
              isModerator={isModerator}
              privileges={privileges}
              onEdit={onEdit}
              onToggleLike={onToggleLike}
              onToggleDislike={onToggleDislike}
              onReply={onReply}
              onDelete={onDelete}
            />
          ))}
        </View>
      )}
    </View>
  );
}
