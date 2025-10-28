import type { CustomTestType } from './CustomTestType';
import { type Project } from './Project';
import { type User } from './User';
import type { TestScenario } from './TestScenario';
import { type DeviceType } from '../components/common/DeviceSelector';

export const FunctionalTestFramework = {
  SELENIUM: 'SELENIUM',
  CYPRESS: 'CYPRESS',
  ROBOT_FRAMEWORK: 'ROBOT_FRAMEWORK',
} as const;
export type FunctionalTestFramework = typeof FunctionalTestFramework[keyof typeof FunctionalTestFramework];

export interface CreateTestCasePayload {
  projectId: string;
  title: string;
  description: string;
  testType?: TestType | null;
  customTestTypeId?: string | null;
  priority: Priority;
  createdById: string;
  responsibleId?: string;
  estimatedTime?: string;
  timeSpent?: string;
  executionDate?: string | null;
  steps: string;
  status: TestCaseStatus;
  expectedResult: string;
  testScenarioId?: string;
  taskLink?: string;
  scripts?: File[];
  targetDevice: "" | DeviceType | undefined;
  customTargetDevice: string;
  functionalFramework?: FunctionalTestFramework | null;
  bugResponsibleId: string | null;
}

export type UpdateTestCasePayload = Partial<CreateTestCasePayload>;

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
  NONE: 'NENHUM',
  LOW: 'BAIXA',
  MEDIUM: 'MEDIA',
  HIGH: 'ALTA',
  CRITICAL: 'CRITICA',
} as const;
export type Priority = typeof Priority[keyof typeof Priority];

export const TestCaseStatus = {
  NAO_INICIADO: 'NAO_INICIADO',
  PENDENTE: 'PENDENTE',
  EM_ANDAMENTO: 'EM_ANDAMENTO',
  APROVADO: 'APROVADO',
  REPROVADO: 'REPROVADO',
  BLOQUEADO: 'BLOQUEADO',
  CANCELADO: 'CANCELADO',
  CONCLUIDO: 'CONCLUIDO',
} as const;
export type TestCaseStatus = typeof TestCaseStatus[keyof typeof TestCaseStatus];

export interface Comment {
  id: string;
  idUser: string;
  comment: string;
  date: string;
  attachments: [];
  createdAt: Date;
  author: User;
  text: string;
}

export interface TestCase {
  id: string;
  title: string;
  description: string;
  testType?: TestType | null;
  customTestTypeId?: string | null;
  prefix: string;
  customTestType?: CustomTestType;
  priority: Priority;
  createdBy: User;
  responsible: User | null;
  bugResponsible?: User | null;
  bugResponsibleId: string | null;
  estimatedTime: string | null;
  timeSpent: string;
  executionDate: string;
  steps: string;
  expectedResult: string;
  taskLink: string | null;
  status: TestCaseStatus;
  testScenario: TestScenario;
  project: Project;
  targetDevice: "" | DeviceType | undefined;
  customTargetDevice: string;
  functionalFramework?: FunctionalTestFramework | null;
  projectSequenceId: number;
  comments: Comment[] | null;
  attachments: string[] | null;
  scripts: any[] | null;
  createdAt: string;
  updatedAt: string;
}