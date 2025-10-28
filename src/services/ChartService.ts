import axios from 'axios';
import { type TestStatusMetrics } from '../types/Metrics';

export const ChartService = {
  getTestStatusMetrics: async (
    projectId: string,
    period: string,
    testType: string,
  ): Promise<TestStatusMetrics> => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/chart/test-status-metrics/${projectId}`,
        {
          params: {
            period,
            testType,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar métricas do dashboard:`, error);
      throw error;
    }
  },
};