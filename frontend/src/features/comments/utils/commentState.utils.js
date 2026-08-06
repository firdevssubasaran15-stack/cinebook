export const optimisticLikeUpdate = (comments, commentId) => {
  return comments.map(c => {
    if (c.id === commentId) {
      const isLiked = c.is_liked_by_user;
      const isDisliked = c.is_disliked_by_user;
      return {
        ...c,
        is_liked_by_user: !isLiked,
        like_count: isLiked ? (c.like_count || 1) - 1 : (c.like_count || 0) + 1,
        is_disliked_by_user: false,
        dislike_count: isDisliked ? (c.dislike_count || 1) - 1 : (c.dislike_count || 0)
      };
    }
    return c;
  });
};

export const optimisticDislikeUpdate = (comments, commentId) => {
  return comments.map(c => {
    if (c.id === commentId) {
      const isDisliked = c.is_disliked_by_user;
      const isLiked = c.is_liked_by_user;
      return {
        ...c,
        is_disliked_by_user: !isDisliked,
        dislike_count: isDisliked ? (c.dislike_count || 1) - 1 : (c.dislike_count || 0) + 1,
        is_liked_by_user: false,
        like_count: isLiked ? (c.like_count || 1) - 1 : (c.like_count || 0)
      };
    }
    return c;
  });
};
