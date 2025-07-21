import { Flag } from "./Flag";
import { HelpBase } from "./Help";


interface CommandBase {
  name: string; // nombre del comando existente o nuevo

  /**
   * Flags que aplican a cada comando o accion
   *
   * * Los argumentos heredados de otros ADDONS son validos siempre
   *
   * ['*'] ==> Significa que GUARDA en el valor flags de Arguments.ts todos los flags que se encuentran en process.argv.
   * ['-'] ==> Significa que IGNORA ningun flag en el valor flags de Arguments.ts.
   * TODO: ['N'] ==> Significa que solo envia los N flags del principio del array de process.argv.
   */
  flags?: Flag[] | '*' | '-';
}


export type Command = 
// declaracion de comandos para nuevos flags
CommandBase | 
// declaracion de nuevos comandos
CommandBase & { path: string, requiresMainFile?: boolean, } & HelpBase;
