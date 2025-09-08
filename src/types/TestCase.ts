import { type Project } from './Project';

export interface CreateTestCasePayload {
  projectId: string;
  title: string;
  description: string;
  testType: string;
  priority: string;
  idCreatedBy: string;
  idResponsible?: string;
  timeEstimated?: string;
  steps: string;
  expectedResult: string;
  taskLink?: string;
  scripts?: File[];
}

export const TestType = {
  FUNCIONAL: 'FUNCIONAL',
  REGRESSAO: 'REGRESSAO',
  DESEMPENHO: 'DESEMPENHO',
  SEGURANCA: 'SEGURANCA',
  USABILIDADE: 'USABILIDADE',
  INTEGRACAO: 'INTEGRACAO',
  ACEITACAO: 'ACEITACAO',
  AUTOMATIZADO: 'AUTOMATIZADO',
  MANUAL: 'MANUAL',
} as const;
export type TestType = typeof TestType[keyof typeof TestType];

export const Priority = {
  BAIXA: 'BAIXA',
  MEDIA: 'MEDIA',
  ALTA: 'ALTA',
  CRITICA: 'CRITICA',
} as const;
export type Priority = typeof Priority[keyof typeof Priority];

export const TestCaseStatus = {
  PENDENTE: 'PENDENTE',
  EM_ANDAMENTO: 'EM_ANDAMENTO',
  APROVADO: 'APROVADO',
  REPROVADO: 'REPROVADO',
  BLOQUEADO: 'BLOQUEADO',
  CANCELADO: 'CANCELADO',
} as const;
export type TestCaseStatus = typeof TestCaseStatus[keyof typeof TestCaseStatus];

export interface Comment {
  idUser: string;
  comment: string;
  date: string;
}

export interface TestCase {
  id: string;
  title: string;
  description: string;
  testType: TestType;
  priority: Priority;
  idCreatedBy: string;
  idResponsible: string | null;
  timeEstimated: string | null;
  timeSpent: string;
  steps: string;
  expectedResult: string;
  taskLink: string | null;
  status: TestCaseStatus;
  project: Project;
  comments: Comment[] | null;
  attachment: string[] | null;
  scripts: string[] | null;
  createdAt: string;
  updatedAt: string;
}