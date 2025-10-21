import type { TestCase } from "./TestCase";
import type { PriorityType } from "./TestTypes";
import type { User } from "./User";

export const BugStatus = {
  OPEN: 'ABERTO',
  IN_PROGRESS: 'EM_ANDAMENTO',
  FIXED: 'CORRIGIDO',
  CLOSED: 'FECHADO',
  REOPENED: 'REABERTO',
} as const;

export type BugStatus = typeof BugStatus[keyof typeof BugStatus];

export interface Bug {
  id: string;
  title: string;
  description: string;
  status: BugStatus;
  priority: PriorityType;
  testCaseId: string;
  testCase?: TestCase;
  assignedDeveloperId: string | null;
  assignedDeveloper?: User | null;
  createdAt: string;
  updatedAt: string;
}
