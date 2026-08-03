import { useState } from 'react';

export function useCommentItem({ comment, isFeeling, onEdit, onReply }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text || '');
  const [editQuote, setEditQuote] = useState(comment.quote || '');
  const [editTags, setEditTags] = useState(comment.tags || []);
  const [submitting, setSubmitting] = useState(false);

  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);

  const getGradientColors = () => {
    if (isFeeling) return ['transparent', 'transparent'];
    const likes = comment.like_count || 0;
    const dislikes = comment.dislike_count || 0;
    const total = likes + dislikes;
    
    if (total === 0) return ['transparent', 'transparent'];
    
    const score = (likes - dislikes) / total;
    
    if (score > 0) {
      // Yeşil glow
      return [`rgba(34, 197, 94, ${0.05 + (score * 0.15)})`, 'transparent'];
    } else if (score < 0) {
      // Kırmızı glow
      return [`rgba(239, 68, 68, ${0.05 + (Math.abs(score) * 0.15)})`, 'transparent'];
    }
    return ['transparent', 'transparent'];
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim() || !onReply) return;
    setReplySubmitting(true);
    try {
      await onReply(comment.id, replyText.trim());
      setReplyText('');
      setIsReplying(false);
    } catch (err) {
      // Error handled by parent
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleToggleTag = (tagId) => {
    setEditTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSave = async () => {
    if (!onEdit) return;
    if (!isFeeling && !editText.trim()) return;
    if (isFeeling && !editText.trim() && editTags.length === 0) return;
    
    setSubmitting(true);
    try {
      await onEdit(comment.id, editText.trim(), isFeeling ? editTags : editQuote.trim() || null);
      setIsEditing(false);
    } catch (err) {
      // Error handled by parent
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(comment.text || '');
    setEditQuote(comment.quote || '');
    setEditTags(comment.tags || []);
  };

  return {
    state: {
      isEditing,
      editText,
      editQuote,
      editTags,
      submitting,
      isReplying,
      replyText,
      replySubmitting,
      gradientColors: getGradientColors()
    },
    actions: {
      setIsEditing,
      setEditText,
      setEditQuote,
      setIsReplying,
      setReplyText,
      handleReplySubmit,
      handleToggleTag,
      handleSave,
      handleCancel
    }
  };
}
