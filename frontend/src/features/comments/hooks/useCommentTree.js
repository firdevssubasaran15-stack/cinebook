import { useMemo } from 'react';

/**
 * Custom hook to build a hierarchical comment tree from a flat list of comments.
 * O(N) complexity using a hash map.
 * 
 * @param {Array} comments - Flat list of comments from API.
 * @returns {Array} - Tree structure of comments.
 */
export function useCommentTree(comments) {
  return useMemo(() => {
    if (!comments || !Array.isArray(comments)) return [];

    const commentMap = {};
    const rootComments = [];

    // Initialize all comments in the map with a children array
    comments.forEach(comment => {
      commentMap[comment.id] = { ...comment, children: [] };
    });

    // Build the tree by assigning children to their parents
    comments.forEach(comment => {
      if (comment.parent_id) {
        if (commentMap[comment.parent_id]) {
          commentMap[comment.id].replyingTo = commentMap[comment.parent_id].username;
          commentMap[comment.parent_id].children.push(commentMap[comment.id]);
        } else {
          // If parent is missing, treat as root to avoid orphan comments
          rootComments.push(commentMap[comment.id]);
        }
      } else {
        // Root comment
        rootComments.push(commentMap[comment.id]);
      }
    });

    return rootComments;
  }, [comments]);
}
