import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/constants/api';

export const commentsApi = {
  getFeed: () => apiClient.get(ENDPOINTS.COMMENTS_FEED),
  getByContentId: (contentId) => apiClient.get(ENDPOINTS.COMMENTS(contentId)),
  create: (contentId, text, quote, parentId = null) => apiClient.post(ENDPOINTS.COMMENTS(contentId), { text, quote, parent_id: parentId }),
  delete: (commentId) => apiClient.delete(ENDPOINTS.COMMENT_DELETE(commentId)),
  update: (commentId, text, quote) => apiClient.put(ENDPOINTS.COMMENT_UPDATE(commentId), { text, quote }),
  toggleLike: (commentId) => apiClient.post(ENDPOINTS.COMMENT_LIKE(commentId)),
  toggleDislike: (commentId) => apiClient.post(ENDPOINTS.COMMENT_DISLIKE(commentId)),
};
