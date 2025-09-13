import axios from "axios";
import { type CustomTestType, type CreateTestTypePayload, type UpdateTestTypePayload } from "../types/CustomTestType";

export const CustomTestTypeService = {
  findAllByOrg: async (orgId: string): Promise<CustomTestType[]> => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/organization/${orgId}/custom-test-types`);
    return response.data;
  },

  create: async (orgId: string, payload: CreateTestTypePayload): Promise<CustomTestType> => {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/organization/${orgId}/custom-test-types`, payload);
    return response.data;
  },

  update: async (orgId: string, typeId: string, payload: UpdateTestTypePayload): Promise<CustomTestType> => {
    const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/organization/${orgId}/custom-test-types/${typeId}`, payload);
    return response.data;
  },

  remove: async (orgId: string, typeId: string): Promise<void> => {
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/organization/${orgId}/custom-test-types/${typeId}`);
  },
};