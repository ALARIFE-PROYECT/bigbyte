export class DuplicateClassError extends Error {
  constructor(description: string) {
    super(description);
    this.name = 'DuplicateClassError';
  }
}