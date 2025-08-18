export class OrderDecoratorsError extends Error {
  constructor(decorators: string[]) {
    super(`The @App() decorator must be the first decorator declared, that is, the one just above the class. These decorators are configured before @App: ${decorators.join(', ')}.`);
      this.name = 'OrderDecoratorsError';
    }
  }