
/**
 * Busca la environment variable en el entorno de ejecución.
 * * Almacenadas previamente en el process por el cli.js
 * 
 * * Solo mostrara las environment, el servicio principal sera CoreValueRegistry en core.
 */
export default {
    get(key: string) {
        return process.env[key];
    },
    has(key: string) {
        return Boolean(process.env[key]);
    },
    keys() {
        return Object.keys(process.env);
    },
    values() {
        return Object.values(process.env);
    }
}
