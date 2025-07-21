import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import Logger from "@bigbyte/utils/logger";
import { FlagData } from "@bigbyte/utils/lib/model/integration";

import { DEFAULT_ENV_FILE_PATH, LIBRARY_NAME } from "../../constant";
import { ARGV_FLAG_ENV } from "../../constant/argv";
import { ROOT_PATH } from "@bigbyte/utils/constant";


const log = new Logger('Environment', LIBRARY_NAME);

export const readEnvironments = (defaultValues: Map<string, string>, flagsData: FlagData[]): Map<string, string> => {
    const environment: Map<string, string> = new Map();

    // añado valores por flags
    flagsData.forEach((flagData: FlagData) => {
        if (flagData.flag.env) {
            environment.set(flagData.flag.env, String(flagData.value));
        }
    });

    // añado valores de archivo si existen
    const envFileArgv: FlagData | undefined = flagsData.find(flagData => flagData.flag.name === ARGV_FLAG_ENV);
    if (envFileArgv) {
        const envFilePath: string = envFileArgv.value as string; // este archivo ya esta validado
        log.dev(`Using default environment file: ${envFilePath}`);
        readEnvironment(environment, flagsData, envFilePath);
    } else {
        const defaultEnvFile: string = path.join(ROOT_PATH, DEFAULT_ENV_FILE_PATH);
        if (existsSync(defaultEnvFile)) {
            log.dev(`Using default environment file: ${defaultEnvFile}`);
            readEnvironment(environment, flagsData, defaultEnvFile);
        }
    }

    // añado los valores por defecto
    defaultValues.forEach((value: string, key: string) => {
        if (!environment.has(key)) {
            environment.set(key, value);
        }
    });

    log.dev(`Environment variables: ${environment}`);
    return environment;
}

export const readEnvironment = (envData: Map<string, string>, flagsData: FlagData[], envPath: string) => {
    const getFlagDataByEnv = (env: string): FlagData | undefined => {
        return flagsData.find(flagData => flagData.flag.env === env);
    }

    const content = readFileSync(envPath, 'utf8');
    if (content) {
        // variables de entorno del archivo
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
