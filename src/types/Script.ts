import { type TestCase } from './TestCase';

export interface Script {
  id: string;
  scriptPath: string;
  version: number;
  createdAt: string;
  testCase: TestCase;
}