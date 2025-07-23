import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { ROOT_PATH } from "@bigbyte/utils/constant";
import { NativeType } from "@bigbyte/utils";
import Logger from "@bigbyte/utils/logger";
import { Command, Flag, FlagData, FlagOptions } from "@bigbyte/utils/integration";

import { DEFAULT_ENV_FILE_PATH, LIBRARY_NAME } from "../../constant";
import { ARGV_FLAG_ENV } from "../../constant/argv";


const log = new Logger('Environment', LIBRARY_NAME);

export const readEnvironments = (command: Command, flagsData: FlagData[]): Map<string, NativeType> => {
    const environment: Map<string, NativeType> = new Map();

    // añado valores por flags
    flagsData.forEach((flagData: FlagData) => {
        if (flagData.flag.env) {
            environment.set(flagData.flag.env, flagData.value); // este value ya esta tipado correctamente
        }
    });

    // añado valores de archivo si existen
    const envFileArgv: FlagData | undefined = flagsData.find(flagData => flagData.flag.name === ARGV_FLAG_ENV);
    if (envFileArgv) {
        const envFilePath: string = envFileArgv.value as string; // este archivo ya esta validado
        log.dev(`Using default environment file: ${envFilePath}`);
        readEnvironment(command, flagsData, environment, envFilePath);
    } else {
        const defaultEnvFile: string = path.join(ROOT_PATH, DEFAULT_ENV_FILE_PATH);
        if (existsSync(defaultEnvFile)) {
            log.dev(`Using default environment file: ${defaultEnvFile}`);
            readEnvironment(command, flagsData, environment, defaultEnvFile);
        }
    }

    // añado los valores por defecto
    if (Array.isArray(command.flags)) {
        command.flags.forEach((flag: Flag) => {
            if (flag.env && !environment.has(flag.env) && 'defaultValue' in flag) {
                environment.set(flag.env, flag.defaultValue);
            }
        });
    }

    if ('environment' in command && command.environment?.DEFAULT_VALUES) {
        const defaultValues: Array<string> = Object.keys(command.environment.DEFAULT_VALUES ?? {});

        if (defaultValues.length > 0) {
            defaultValues.forEach((key: string) => {
                if (!environment.has(key)) {
                    let value: NativeType = command.environment!.DEFAULT_VALUES![key];
                    environment.set(key, value);
                }
            });
        }
    }

    log.dev(`Environment variables: ${environment}`);
    console.log("🚀 ~ readEnvironments ~ environment:", environment)

    return environment;
}

export const readEnvironment = (command: Command, flagsData: FlagData[], envData: Map<string, NativeType>, envPath: string) => {
    const getFlagDataByEnv = (env: string): FlagData | undefined => {
        return flagsData.find(flagData => flagData.flag.env === env);
    }

    const getValueType = (envName: string, value: string): NativeType => {
        const flag = (command.flags as Flag[]).find((flag: Flag) => flag.env === envName);

        if (!flag || flag.valueType === 'string') {
            return String(value);
        } else if (flag.valueType === 'boolean') {
            return value.toLowerCase() === 'true';
        } else if (flag.valueType === 'number') {
            return Number(value);
        }
    }

    const content = readFileSync(envPath, 'utf8');
    if (content) {
        const flags: FlagOptions | undefined = command.flags;
        const lines = content.split('\n');

        if (typeof flags === 'string') {
            // si el flags es string se añaden todos los valores sin tipar
            lines.forEach((line: string) => {
                if (line && !line.startsWith('#')) {
                    const [key, value] = line.split('=');

                    if (envData.has(key)) {
                        log.warn(`The environment ${key} is already configured from flag ${getFlagDataByEnv(key)?.flag.name}. The value of the flag is maintained over that of ${envPath}`);
                    } else if (key && value) {
                        envData.set(key, value.trim());
                    }
                }
            });
        } else if (Array.isArray(flags)) {
            // si tiene flags, se añaden todos con el tipo correcto
            lines.forEach((line: string) => {
                if (line && !line.startsWith('#')) {
                    const [key, value] = line.split('=');

                    if (envData.has(key)) {
                        log.warn(`The environment ${key} is already configured from flag ${getFlagDataByEnv(key)?.flag.name}. The value of the flag is maintained over that of ${envPath}`);
                    } else if (key && value) {
                        envData.set(key, getValueType(key, value.trim()));
                    }
                }
            });
        }
    }
}
