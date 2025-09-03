import axios from 'axios';
import { type UserRegister, type User } from '../types/User';

export const UsersService = {

  create: async (data: UserRegister): Promise<UserRegister> => {
    try {
      const response = await axios.post<UserRegister>(`${import.meta.env.VITE_API_BASE_URL}/users`, data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error('Falha ao criar teste: erro desconhecido');
      }
      throw error;
    }
  },

  getUserByEmail: async (email: string): Promise<User | null> => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/email/${email}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            console.error('Erro ao buscar usuário por email:', error);
            throw error;
        }
    }
};
