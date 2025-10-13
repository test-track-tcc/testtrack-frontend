import { type Project } from './Project';
import { type User } from './User';
import { type TestCase } from './TestCase';

export interface TestScenario {
  id: string;
  identifier: string;
  name: string;
  description: string;
  objective: string;
  relatedRequirements?: string[];
  preconditions?: string;
  acceptanceCriteria?: string;
  project: Project;
  author: User;
  testCases: TestCase[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestScenarioPayload {
  projectId: string;
  name: string;
  description: string;
  objective: string;
  relatedRequirements?: string[];
  preconditions?: string;
  acceptanceCriteria?: string;
  testCaseIds?: string[];
}

export type UpdateTestScenarioPayload = Partial<CreateTestScenarioPayload>;