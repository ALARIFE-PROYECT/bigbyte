import { SourceFile } from 'ts-morph';
import Logger from '@bigbyte/utils/logger';

import { LIBRARY_NAME } from '../../../constant';


const log = new Logger(LIBRARY_NAME);

export class FunctionScanner {
  constructor() {}

  public scan(file: SourceFile) {
    for (const func of file.getFunctions()) {
      const name = func.getName() || '<anonymous>';

      // TODO: almacenar tambien funciones sueltas
      // * Se usara para los middlewares y funciones de utilidad
    }
  }
}
