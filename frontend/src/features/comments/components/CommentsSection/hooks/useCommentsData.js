import { useState, useCallback, useEffect } from 'react';
import { commentsApi } from '@/api/endpoints/comments.api';
import { useCommentTree } from '@/features/comments/hooks/useCommentTree';

export function useCommentsData(contentId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const commentTree = useCommentTree(comments);

  const fetchComments = useCallback(async () => {
    try {
      const res = await commentsApi.getByContentId(contentId);
      setComments(res.data.data);
    } catch (err) {
      console.log('Comments error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [contentId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    setComments,
    commentTree,
    loading,
    fetchComments,
  };
}
