import { router } from 'expo-router';

export function useUserCommentItem({ comment, onToggleLike, onToggleDislike }) {
  const getGradientColors = () => {
    const likes = comment.like_count || 0;
    const dislikes = comment.dislike_count || 0;
    const total = likes + dislikes;
    
    if (total === 0) return ['transparent', 'transparent'];
    
    const score = (likes - dislikes) / total;
    
    if (score > 0) {
      return [`rgba(34, 197, 94, ${0.05 + (score * 0.15)})`, 'transparent'];
    } else if (score < 0) {
      return [`rgba(239, 68, 68, ${0.05 + (Math.abs(score) * 0.15)})`, 'transparent'];
    }
    return ['transparent', 'transparent'];
  };

  const handlePressContent = () => {
    router.push(`/detail/${comment.content_id}`);
  };

  const handleLike = () => {
    if (onToggleLike) {
      onToggleLike(comment.id);
    }
  };

  const handleDislike = () => {
    if (onToggleDislike) {
      onToggleDislike(comment.id);
    }
  };

  return {
    actions: {
      handlePressContent,
      handleLike,
      handleDislike
    },
    gradientColors: getGradientColors()
  };
}
