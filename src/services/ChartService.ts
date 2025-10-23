// Caminho: src/services/ChartService.ts
// (Novo arquivo)

import axios from 'axios';
import { type TestStatusMetrics } from '../types/Metrics';

export const ChartService = {
  /**
   * Busca as métricas de status de teste para o dashboard.
   */
  getTestStatusMetrics: async (
    organizationId: string,
    period: string,
    testType: string,
  ): Promise<TestStatusMetrics> => {
    try {
      // Passa os filtros como query params
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/chart/test-status-metrics/${organizationId}`,
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