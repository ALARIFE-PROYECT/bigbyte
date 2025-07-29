import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { ROOT_PATH } from "@bigbyte/utils/constant";
import Logger from "@bigbyte/utils/logger";
import { Command, Flag, FlagData } from "@bigbyte/utils/integration";

import { DEFAULT_ENV_FILE_PATH, LIBRARY_NAME } from "../../constant";
import { ARGV_FLAG_ENV } from "../../constant/argv";


const log = new Logger(LIBRARY_NAME);

export const readEnvironments = (command: Command, flagsData: FlagData[]): Map<string, string | undefined> => {
    const environment: Map<string, string | undefined> = new Map();

    // añado valores por flags
    flagsData.forEach((flagData: FlagData) => {
        if (flagData.flag.env) {
            // El flagData.value ya es tipo string siempre
            environment.set(flagData.flag.env, flagData.value);
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
                environment.set(flag.env, !!flag.defaultValue ? String(flag.defaultValue) : undefined);
            }
        });
    }

    if ('environment' in command && command.environment?.DEFAULT_VALUES) {
        const defaultValues: Array<string> = Object.keys(command.environment.DEFAULT_VALUES ?? {});

        if (defaultValues.length > 0) {
            defaultValues.forEach((key: string) => {
                if (!environment.has(key)) {
                    let value = command.environment!.DEFAULT_VALUES![key];
                    environment.set(key, !!value ? String(value) : undefined);
                }
            });
        }
    }

    log.dev(`Environment variables: ${environment}`);
    return environment;
}

export const readEnvironment = (command: Command, flagsData: FlagData[], envData: Map<string, string | undefined>, envPath: string) => {
    const getFlagDataByEnv = (env: string): FlagData | undefined => {
        return flagsData.find(flagData => flagData.flag.env === env);
    }

    const content = readFileSync(envPath, 'utf8');
    if (content) {
        const lines = content.split('\n');
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
    }
}
