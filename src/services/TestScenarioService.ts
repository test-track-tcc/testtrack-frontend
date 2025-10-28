import axios from 'axios';
import { type TestScenario, type CreateTestScenarioPayload, type UpdateTestScenarioPayload } from '../types/TestScenario';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/test-scenarios`;

export const TestScenarioService = {
  getByProjectId: async (projectId: string): Promise<TestScenario[]> => {
    const response = await axios.get(API_BASE_URL);
    return response.data.filter((scenario: TestScenario) => scenario.project.id === projectId);
  },

  getAll: async (): Promise<TestScenario[]> => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  },

  create: async (payload: CreateTestScenarioPayload): Promise<TestScenario> => {
    const response = await axios.post(API_BASE_URL, payload);
    return response.data;
  },

  update: async (id: string, payload: UpdateTestScenarioPayload): Promise<TestScenario> => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`);
  },
};