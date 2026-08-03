import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/constants/api';

export const authApi = {
  login: (username, password) =>
    apiClient.post(ENDPOINTS.LOGIN, { username, password }),

  register: (username, email, password) =>
    apiClient.post(ENDPOINTS.REGISTER, { username, email, password }),
};
