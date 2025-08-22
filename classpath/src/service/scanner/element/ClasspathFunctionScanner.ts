import { SourceFile } from 'ts-morph';

export class ClasspathFunctionScanner {
  constructor() {}

  public scan(file: SourceFile) {
    for (const func of file.getFunctions()) {
      const name = func.getName() || '<anonymous>';

      // TODO: almacenar tambien funciones sueltas
      // * Se usara para los middlewares y funciones de utilidad
    }
  }
}
