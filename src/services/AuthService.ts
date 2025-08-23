import axios from 'axios';
import { type UserLoginData, type AuthResponse } from '../types/User';
import { getItem } from '../utils/authStorage';

export const AuthService = {
  login: async (data: UserLoginData): Promise<AuthResponse> => {
    try {
      const response = await axios.post<AuthResponse>(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Falha ao realizar o login. Tente novamente.');
      }
      throw new Error('Ocorreu um erro inesperado.');
    }
  },

  logout: async (): Promise<void> => {
    try {
      const token = getItem('authToken'); 
      if (token) {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Erro ao chamar o endpoint de logout:', error);
    }
  },
};