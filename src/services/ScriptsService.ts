import axios from 'axios';
import { type Script } from '../types/Script';

export const ScriptService = {
  async getAllByProject(projectId: string): Promise<Script[]> {
    try {
      const response = await axios.get<Script[]>(`${import.meta.env.VITE_API_BASE_URL}/scripts/by-project/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch scripts:', error);
      throw error;
    }
  },
};