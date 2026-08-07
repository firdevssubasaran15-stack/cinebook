import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/constants/api';

export const authApi = {
  login: (username, password) =>
    apiClient.post(ENDPOINTS.LOGIN, { username, password }),

  register: (username, email, password) =>
    apiClient.post(ENDPOINTS.REGISTER, { username, email, password }),

  forgotPassword: (username, email) =>
    apiClient.post(ENDPOINTS.FORGOT_PASSWORD, { username, email }),

  verifyOtp: (email, code) =>
    apiClient.post(ENDPOINTS.VERIFY_OTP, { email, code }),

  resetPassword: (email, code, newPassword) =>
    apiClient.post(ENDPOINTS.RESET_PASSWORD, { email, code, newPassword }),
};
