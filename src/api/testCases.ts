import axios from 'axios';
import { type TestFormData } from '../types/TestCase';

const VITE_API_BASE_URL = import.meta.env.VITE_API_URL;

export const getTestCases = async () => {
  const response = await axios.get(`${VITE_API_BASE_URL}/test-cases`);
  return response.data;
};

export const getTestCaseById = async (id: string) => {
  const response = await axios.get(`${VITE_API_BASE_URL}/test-cases/${id}`);
  return response.data;
};

export const createTestCase = async (data: TestFormData) => {
  const formData = new FormData();

  formData.append('titulo', data.titulo);
  formData.append('descricao', data.descricao);
  formData.append('tipoTeste', data.tipoTeste);
  formData.append('prioridade', data.prioridade);
  formData.append('id_userCriacao', data.id_userCriacao);
  formData.append('idResponsavel', data.idResponsavel);
  formData.append('tempoEstimado', data.tempoEstimado);
  formData.append('steps', data.steps);
  formData.append('resultadoEsperado', data.resultadoEsperado);
  formData.append('requisitoVinculado', data.requisitoVinculado);
  formData.append('status', data.status);

  formData.append('comentarios', JSON.stringify(data.comentarios));
  formData.append('anexos', JSON.stringify(data.anexos));

  data.scripts.forEach((script) => {
    if (script.file) {
      formData.append('scripts', script.file);
    }
  });

  const response = await axios.post(`${VITE_API_BASE_URL}/test-cases`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const updateTestCase = async (id: string, data: TestFormData) => {
  const formData = new FormData();

  formData.append('titulo', data.titulo);
  formData.append('descricao', data.descricao);
  formData.append('tipoTeste', data.tipoTeste);
  formData.append('prioridade', data.prioridade);
  formData.append('id_userCriacao', data.id_userCriacao);
  formData.append('idResponsavel', data.idResponsavel);
  formData.append('tempoEstimado', data.tempoEstimado);
  formData.append('steps', data.steps);
  formData.append('resultadoEsperado', data.resultadoEsperado);
  formData.append('requisitoVinculado', data.requisitoVinculado);
  formData.append('status', data.status);

  formData.append('comentarios', JSON.stringify(data.comentarios));
  formData.append('anexos', JSON.stringify(data.anexos));

  data.scripts.forEach((script) => {
    if (script.file) {
      formData.append('scripts', script.file);
    }
  });

  const response = await axios.put(`${VITE_API_BASE_URL}/test-cases/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const deleteTestCase = async (id: string) => {
  const response = await axios.delete(`${VITE_API_BASE_URL}/test-cases/${id}`);
  return response.data;
};
