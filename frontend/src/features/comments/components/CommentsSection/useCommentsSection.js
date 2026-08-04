import { useState } from 'react';
import { Alert } from 'react-native';
import { useCommentsData } from './hooks/useCommentsData';
import { useCommentActions } from './hooks/useCommentActions';

export function useCommentsSection(contentId, user) {
  const [newComment, setNewComment] = useState('');
  const [newQuote, setNewQuote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Data Layer Hook
  const { comments, setComments, commentTree, loading, fetchComments } = useCommentsData(contentId);

  // Actions Layer Hook
  const actionsLayer = useCommentActions({ contentId, user, setComments, fetchComments });

  // Facade: Combine everything for the UI
  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('Uyarı', 'Yorum boş olamaz.');
      return;
    }
    setSubmitting(true);
    try {
      await actionsLayer.handleCreate(newComment.trim(), newQuote.trim());
      setNewComment('');
      setNewQuote('');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    state: {
      comments,
      commentTree,
      loading,
      newComment,
      newQuote,
      submitting,
    },
    actions: {
      setNewComment,
      setNewQuote,
      handleSubmitComment,
      handleDeleteComment: actionsLayer.handleDelete,
      handleEditComment: actionsLayer.handleEdit,
      handleReplyComment: actionsLayer.handleReply,
      handleToggleLike: actionsLayer.handleToggleLike,
      handleToggleDislike: actionsLayer.handleToggleDislike,
    }
  };
}
