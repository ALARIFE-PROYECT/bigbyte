import { NativeType } from "../NativeType";
import { Addon } from "./Addon";
import { Command } from "./Command";
import { Dependency } from "./Dependency";
import { FlagData } from "./Flag";
import { MainFile } from "./MainFile";

export interface CommandData {
    /**
     * Archivo objetivo si lo hubiera.
     */
    mainFile?: MainFile;

    /**
     * Valores de comando actual
     */
    command: Command;
    flagsData: FlagData[];

    /**
     * Valores de las variables de entorno.
     */
    environmentValues?: Map<string, NativeType>;

    /**
     * Lista de dependencias del framework.
     */
    dependencies: Dependency[];

    /**
     * A partir de las dependencias se extrae la configuración de los addons.
     */
    addons: Addon[];

    /**
     * lista de comandos disponibles
     */
    commands: Command[];
}