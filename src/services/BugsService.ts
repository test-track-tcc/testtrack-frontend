import axios from 'axios';
import type { Bug } from '../types/Bug';
import type { User } from '../types/User'; 

export const BugsService = {

  getAllBugs: async (): Promise<Bug[]> => {
    try {
      const response = await axios.get<Bug[]>(`${import.meta.env.VITE_API_BASE_URL}/bugs`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao buscar bugs:', error.response?.data || error.message);
        throw new Error(`Falha ao buscar bugs: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Falha ao buscar bugs: erro desconhecido');
    }
  },

  assignDeveloper: async (bugId: string, developerId: string): Promise<Bug> => {
    try {
      const response = await axios.patch<Bug>(
        `${import.meta.env.VITE_API_BASE_URL}/bugs/${bugId}/assign`,
        { developerId }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao atribuir desenvolvedor:', error.response?.data || error.message);
        throw new Error(`Falha ao atribuir desenvolvedor: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Falha ao atribuir desenvolvedor: erro desconhecido');
    }
  },

  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await axios.get<User[]>(`${import.meta.env.VITE_API_BASE_URL}/users`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao buscar usuários:', error.response?.data || error.message);
        throw new Error(`Falha ao buscar usuários: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Falha ao buscar usuários: erro desconhecido');
    }
  },
};
