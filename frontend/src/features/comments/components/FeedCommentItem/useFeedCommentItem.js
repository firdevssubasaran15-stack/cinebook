import { router } from 'expo-router';

export function useFeedCommentItem({ comment, onToggleLike, onToggleDislike }) {
  const handlePressContent = () => {
    router.push(`/detail/${comment.content_id}`);
  };

  const handlePressUser = () => {
    router.push(`/user/${comment.user_id}`);
  };

  const handleLike = () => {
    if (onToggleLike) onToggleLike(comment.id);
  };

  const handleDislike = () => {
    if (onToggleDislike) onToggleDislike(comment.id);
  };

  return {
    actions: {
      handlePressContent,
      handlePressUser,
      handleLike,
      handleDislike
    }
  };
}
