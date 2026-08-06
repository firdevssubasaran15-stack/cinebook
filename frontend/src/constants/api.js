// API Base URL — Cihazınızın IP adresini buraya yazın
// Örnek: 'http://192.168.1.100:3000'
// localhost ÇALIŞMAZ — mobil cihazda IP adresi kullanın
export const API_BASE_URL = 'http://192.168.1.153:3000';

export const ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',

  // Content
  CONTENT_LATEST: '/api/content/latest',
  CONTENT_RECOMMENDATION: '/api/content/recommendation',
  CONTENT_UNDISCOVERED: (mood, type) => `/api/content/undiscovered/${mood}${type ? `?type=${type}` : ''}`,
  CONTENT_BY_TYPE: (type) => `/api/content/type/${type}`,
  CONTENT_BY_ID: (id) => `/api/content/${id}`,
  CONTENT_CREATE: '/api/content',

  // Comments
  COMMENTS_FEED: '/api/comments/feed/latest',
  COMMENTS: (contentId) => `/api/comments/${contentId}`,
  COMMENT_DELETE: (commentId) => `/api/comments/${commentId}`,
  COMMENT_UPDATE: (commentId) => `/api/comments/${commentId}`,
  COMMENT_LIKE: (commentId) => `/api/comments/${commentId}/like`,
  COMMENT_DISLIKE: (commentId) => `/api/comments/${commentId}/dislike`,

  // Feelings
  FEELINGS: (contentId) => `/api/feelings/${contentId}`,
  FEELINGS_SEARCH: '/api/feelings/search',
  FEELING_DELETE: (feelingId) => `/api/feelings/${feelingId}`,
  FEELING_UPDATE: (feelingId) => `/api/feelings/${feelingId}`,
  FEELING_LIKE: (feelingId) => `/api/feelings/${feelingId}/like`,

  // Admin
  ADMIN_USERS: '/api/admin/users',
  ADMIN_SEARCH: '/api/admin/users/search',
  ADMIN_PRIVILEGES: (userId) => `/api/admin/users/${userId}/privileges`,

  // Users
  USER_PROFILE: (userId) => `/api/users/${userId}/profile`,
  USER_FOLLOW: (userId) => `/api/users/${userId}/follow`,
  USER_FOLLOWERS: (userId) => `/api/users/${userId}/followers`,
  USER_FOLLOWING: (userId) => `/api/users/${userId}/following`,
};
