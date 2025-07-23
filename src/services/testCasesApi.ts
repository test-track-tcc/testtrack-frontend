import { api } from './index.ts';
import type { TesteData } from '../types/types'; 

export const TestCasesService = {
  async getAll(): Promise<TesteData[]> {
    try {
      const response = await api.get<TesteData[]>(`${import.meta.env.VITE_API_BASE_URL}/${import.meta.env.VITE_TESTCASES_API}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao buscar testes:', error.message);
        throw new Error(`Falha ao buscar testes: ${error.message}`);
      } else {
        console.error('Erro ao buscar testes:', error);
        throw new Error('Falha ao buscar testes: erro desconhecido');
      }
    }
  },

  async create(testData: TesteData): Promise<TesteData> {
    try {
      const response = await api.post<TesteData>(`${import.meta.env.VITE_API_BASE_URL}/${import.meta.env.VITE_TESTCASES_API}`, testData);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao criar teste:', error.message);
        throw new Error(`Falha ao criar teste: ${error.message}`);
      } else {
        console.error('Erro ao criar teste:', error);
        throw new Error('Falha ao criar teste: erro desconhecido');
      }
    }
  },
}