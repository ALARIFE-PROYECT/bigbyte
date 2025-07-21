export class ConfigurationError extends Error {
    key: string;

  constructor(key: string, description: string) {
    super(description);
    this.key = key;
    this.name = 'ConfigurationError';
  }
}