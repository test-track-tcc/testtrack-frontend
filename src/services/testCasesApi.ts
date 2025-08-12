import axios from 'axios';
import type { TesteData } from '../types/types'; 

export const testCasesApi = {

  createTeste: async (data: TesteData): Promise<TesteData> => {
    try {
      const response = await axios.post<TesteData>(import.meta.env.API_BASE_URL, data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao criar teste:', error.response?.data || error.message);
        throw new Error(`Falha ao criar teste: ${error.response?.data?.message || error.message}`);
      } else if (error instanceof Error) {
        console.error('Erro ao criar teste:', error.message);
        throw new Error(`Falha ao criar teste: ${error.message}`);
      } else {
        console.error('Erro ao criar teste:', error);
        throw new Error('Falha ao criar teste: erro desconhecido');
      }
    }
  },

  getAllTestes: async (): Promise<TesteData[]> => {
    try {
      const response = await axios.get<TesteData[]>(import.meta.env.API_BASE_URL);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao buscar testes:', error.response?.data || error.message);
        throw new Error(`Falha ao buscar testes: ${error.response?.data?.message || error.message}`);
      } else if (error instanceof Error) {
        console.error('Erro ao buscar testes:', error.message);
        throw new Error(`Falha ao buscar testes: ${error.message}`);
      } else {
        console.error('Erro ao buscar testes:', error);
        throw new Error('Falha ao buscar testes: erro desconhecido');
      }
    }
  },
};
