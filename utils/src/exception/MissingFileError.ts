export class MissingFileError extends Error {
  constructor(fileName: string, path: string) {
    super('Missing file: ' + fileName + ' in path: ' + path);
    this.name = 'MissingFileError';
  }
}