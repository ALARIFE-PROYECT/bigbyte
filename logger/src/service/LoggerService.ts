import { logger } from "./logger";

export class LoggerService {

    constructor() { }

    public error(...args: any[]) {
        logger.error(...args);
    }

    public warn(...args: any[]) {
        logger.warn(...args);
    }

    public info(...args: any[]) {
        logger.info(...args);
    }

    public debug(...args: any[]) {
        logger.debug(...args);
    }
}
