import axios from 'axios';
import { type Report } from '../types/Report';

const formatDateForApi = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const ReportService = {
  getAll: async (): Promise<Report[]> => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/reports`);
      console.error(response)
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar relatórios:`, error);
      throw error;
    }
  },

  getByProjectId: async (projectId: string): Promise<Report[]> => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/reports/project/${projectId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar relatórios para o projeto ${projectId}:`, error);
      throw error;
    }
  },

  generatePersonalized: async (projectId: string, startDate: Date, endDate: Date): Promise<{ message: string }> => {
    try {
      const startDateStr = formatDateForApi(startDate);
      const endDateStr = formatDateForApi(endDate);

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/reports/trigger-personalized-report/${projectId}/${startDateStr}/${endDateStr}`
      );
      return response.data;
    } catch (error) {
      console.error(`Erro ao gerar relatório personalizado:`, error);
      throw error;
    }
  },

  downloadReport: async (reportId: string, fileName: string): Promise<void> => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/reports/${reportId}/download`, {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error(`Erro ao baixar o relatório ${reportId}:`, error);
      throw error;
    }
  },
};