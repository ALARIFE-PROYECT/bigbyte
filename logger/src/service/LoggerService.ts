import { Logger } from "winston";
import { logger } from "./logger";

export class LoggerService {

    constructor() { }

    public error(...args: Parameters<Logger['error']>) {
        logger?.error(...args);
    }

    public warn(...args: Parameters<Logger['warn']>) {
        logger?.warn(...args);
    }

    public info(...args: Parameters<Logger['info']>) {
        logger?.info(...args);
    }

    public http(...args: Parameters<Logger['http']>) {
        logger?.http(...args);
    }

    public verbose(...args: Parameters<Logger['verbose']>) {
        logger?.verbose(...args);
    }

    public debug(...args: Parameters<Logger['debug']>) {
        logger?.debug(...args);
    }

    public silly(...args: Parameters<Logger['silly']>) {
        logger?.silly(...args);
    }
}
