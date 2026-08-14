export type CodeLanguage = 'javascript' | 'python';

export const NO_OUTPUT = 'No console output.';

export interface CodeInputField {
  id: string;
  label: string;
  defaultValue: string;
  type?: 'number' | 'text';
  min?: number;
  max?: number;
  maxLength?: number;
}

export interface CodeTestCase {
  id: string;
  label: string;
  expectedOutput: Readonly<Record<CodeLanguage, string>>;
  inputs?: Readonly<Record<string, string>>;
}

export interface CodeExampleConfig {
  testCases: readonly CodeTestCase[];
  inputs?: readonly CodeInputField[];
  prepareJavaScript?: (code: string, inputs: Readonly<Record<string, string>>) => string;
}
