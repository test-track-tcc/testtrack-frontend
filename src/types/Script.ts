import { type TestCase } from './TestCase';

export interface Script {
  status: any;
  id: string;
  scriptPath: string;
  version: number;
  createdAt: string;
  testCase: TestCase;
}