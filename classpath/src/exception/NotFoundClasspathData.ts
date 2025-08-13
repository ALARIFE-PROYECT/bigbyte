export class NotFoundClasspathData extends Error {
    constructor(description: string) {
      super(description);
      this.name = 'NotFoundClasspathData';
    }
  }