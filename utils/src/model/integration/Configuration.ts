import { Command } from "./Command";
import { Environment } from "./Environment";

/**
 * Configuracion para la integracion de otras addons con el CLI y entre addons
 * 
 * Rules:
 * * Los datos no se sobre escriben, el primero que se declara se almacena
 */
export interface Configuration {
    environment?: Environment;

    // declaracion de nuevos comandos
    newCommands?: Command[];

    // declaracion de comandos para nuevos flags
    commandDeclaration?: Command[];
}