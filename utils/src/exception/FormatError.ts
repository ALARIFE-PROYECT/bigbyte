export class FormatError extends Error {
    constructor(filePath: string) {
      super(`Incorrect file format: ${filePath}`);
      this.name = 'IncorrectFormat';
    }
  }