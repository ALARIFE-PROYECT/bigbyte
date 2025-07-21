export interface CompilationErrorData {
  resume: string;
  code?: number;
}

export class CompilationError extends Error {
  constructor(error: CompilationErrorData) {
    super(`TypeScript compilation failed with code ${error.code}: \n ${error.resume}`);
    this.name = 'CompilationError';
  }
}
