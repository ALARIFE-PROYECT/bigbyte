
/**
 * Busca los argumentos pasados al proceso de ejecución.
 * * Heredados previamente por el cli.js
 */

export interface ArgumentsService {
    get(key: string): string | undefined;
    getValue(key: string): string | undefined;
    has(key: string): boolean;
}

export const argumentsService: ArgumentsService = {
    get(key: string): string | undefined {
        return process.argv.find((arg) => arg.includes(key));
    },
    getValue(key: string): string | undefined {
        const arg = this.get(key);

        if (arg) {
            const [_, value] = arg.split('=');

            return value;
        }
        return undefined;
    },
    has(key: string): boolean {
        return Boolean(process.argv.includes(key));
    }
};
