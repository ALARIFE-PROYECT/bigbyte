import { Environment } from "./Environment";
import { Flag } from "./Flag";
import { HelpBase } from "./Help";

export type FlagOptions = Flag[] | '*' | '-';

interface CommandBase {
  /**
   * Nombre del comando | accion existente o nuevo
   */
  name: string;

  /**
   * Flags que aplican a cada comando o accion
   *
   * * Los argumentos heredados de otros ADDONS son validos siempre
   *
   * ['*'] ==> Significa que GUARDA en el valor flags de Arguments.ts todos los flags que se encuentran en process.argv.
   * ['-'] ==> Significa que IGNORA ningun flag en el valor flags de Arguments.ts.
   * TODO: ['N'] ==> Significa que solo envia los N flags del principio del array de process.argv.
   */
  flags?: FlagOptions;
}


export type Command =
  // declaracion de comandos para nuevos flags
  CommandBase |
  // declaracion de nuevos comandos
  CommandBase & {

    /**
     * Ruta del comando a ejecutar
     */
    path: string,

    /**
     * Indica si el ultimo argv del comando es la ruta del archivo a ejecutar.
     */
    requiresMainFile?: boolean,

    /**
     * Indica si se deben inyectar las environments al comando
     */
    injectEnvironment?: boolean;

    /**
     * Valores de entorno no mapeados por los flags
     */
    environment?: Environment;
  } & HelpBase;
