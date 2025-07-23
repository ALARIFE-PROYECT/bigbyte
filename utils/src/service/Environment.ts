import { NativeType } from "../model/NativeType";

/**
 * Busca la environment variable en el entorno de ejecución.
 * * Almacenadas previamente en el process por el cli.js
 * 
 * * Trabaja en paralelo con el registry de coreValueStore
 */
export interface EnvironmentService {
    get(key: string): NativeType;
    has(key: string): boolean;
    keys(): Array<string>;
    values(): Array<string | undefined>;
}

export const environmentService: EnvironmentService =  {
    get(key: string): NativeType {
        return process.env[key];
    },
    has(key: string): boolean {
        return Boolean(process.env[key]);
    },
    keys(): Array<string> {
        return Object.keys(process.env);
    },
    values(): Array<string | undefined> {
        return Object.values(process.env);
    }
};
