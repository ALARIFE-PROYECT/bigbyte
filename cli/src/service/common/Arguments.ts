import path from "node:path";
import { existsSync } from "node:fs";
import { Command, Flag, FlagType, FlagData, MainFile } from "@bigbyte/utils/integration";
import { ROOT_PATH } from "@bigbyte/utils/constant";
import Logger from "@bigbyte/utils/logger";

import { MissingArgumentError } from "../../exception/MissingArgumentError";

import { BIN_NAME, LIBRARY_NAME } from "../../constant";
import { MissingFileError } from "../../exception";



const log = new Logger('Arguments', LIBRARY_NAME);

/**
 * Configura y valida el path del archivo a ejecutar
 */
export const getMainFile = (argv: string[]): MainFile => {
    const targetAppPath = argv[argv.length - 1];
    const targetAppFileName = path.basename(targetAppPath);

    if (!targetAppFileName || !targetAppFileName.includes('.ts')) {
        throw new MissingArgumentError('[MAIN_FILE]', 'The path of the application to be executed has not been provided.');
    }

    argv.pop(); // Remove the target app path from argv

    return {
        name: targetAppFileName,
        path: targetAppPath
    };
}

export const readArguments = (command: Command, argv: string[]): FlagData[] => {
    const flagsData: FlagData[] = [];

    if ('flags' in command) {
        if (typeof command.flags === 'string') {
            /**
             * Para el caso de '*' no se hara nada
             * * No se cargaran valores ni configuraciones, sera la accion la que se encargue de ello
             */
            if (command.flags === '-' && argv.length > 0) {
                throw new MissingArgumentError('flags', `The command "${command.name}" does not accept any flags.`);
            }
        } else if (Array.isArray(command.flags)) {
            argv.forEach((argument) => {
                const flags: Flag[] = command.flags as Flag[]
                const flag = flags.find(f => argument.includes(f.name));

                if (!flag) {
                    throw new MissingArgumentError('flags', `The flag "${argument}" is not valid for the command "${command.name}". Use "${BIN_NAME} help ${command.name}" for instructions.`);
                }

                if ((flag?.type === FlagType.file || flag?.type === FlagType.value) && !argument.includes('=')) {
                    throw new MissingArgumentError('flags', `The flag "${argument}" is not valid for the command "${command.name}". Use "${BIN_NAME} help ${command.name}" for instructions.`);
                } else if (flag?.type === FlagType.switch && argument !== flag.name) {
                    throw new MissingArgumentError('flags', `The flag "${argument}" is not valid for the command "${command.name}". Use "${BIN_NAME} help ${command.name}" for instructions.`);
                }

                // configurar valores y temas de flags
                if (flag.type === FlagType.switch) {
                    flagsData.push({
                        flag,
                        value: true
                    });
                } else if (flag.type === FlagType.value) {
                    const argvSplit = argument.split('=');
                    const value = argvSplit[1];

                    if (!value) {
                        throw new MissingArgumentError(`--${flag.name}`, `The flag "${argument}" requires a value. Use "${BIN_NAME} help ${command.name}" for instructions.`);
                    }

                    flagsData.push({ flag, value });
                } else if (flag.type === FlagType.file) {
                    const argvSplit = argument.split('=');

                    const splitFilePath = argvSplit[1];
                    if (!splitFilePath) {
                        throw new MissingArgumentError(`--${flag.name}`, `The flag "${argument}" requires a file path. Use "${BIN_NAME} help ${command.name}" for instructions.`);
                    }

                    const filePath = path.join(ROOT_PATH, splitFilePath);
                    const fileName = path.basename(filePath);

                    if (!filePath || !existsSync(filePath)) {
                        throw new MissingFileError(fileName, filePath);
                    }

                    flagsData.push({
                        flag,
                        value: filePath
                    });
                }
            });
        }
    }
    
    log.dev(`Flags data: ${flagsData}`);
    return flagsData;
}

