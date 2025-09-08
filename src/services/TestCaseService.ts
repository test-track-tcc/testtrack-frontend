import axios from 'axios';
import { type CreateTestCasePayload, type TestCase } from '../types/TestCase';

export const TestCaseService = {
  getByProjectId: async (projectId: string): Promise<TestCase[]> => {
    try {
      const response = await axios.get<TestCase[]>(`${import.meta.env.VITE_API_BASE_URL}/test-cases/by-project/${projectId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar casos de teste para o projeto ${projectId}:`, error);
      throw error;
    }
  },

  create: async (payload: CreateTestCasePayload): Promise<TestCase> => {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (key !== 'scripts' && value) {
        formData.append(key, value as string);
      }
    });

    if (payload.scripts && payload.scripts.length > 0) {
      payload.scripts.forEach((file) => {
        formData.append('scripts', file);
      });
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/test-cases`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar caso de teste:', error);
      throw error;
    }
  },

  delete: async (testCaseId: string): Promise<void> => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/test-cases/${testCaseId}`);
    } catch (error) {
      console.error(`Erro ao deletar caso de teste ${testCaseId}:`, error);
      throw error;
    }
  }
};
