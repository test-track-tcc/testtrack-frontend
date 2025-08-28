import axios from 'axios';
import { type UserRegister } from '../types/User';

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
};
