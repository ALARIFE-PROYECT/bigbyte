import { log } from "./log";

export class LoggerService {

    constructor() { }

    public error(...args: any[]) {
        log.error(...args);
    }

    public warn(...args: any[]) {
        log.warn(...args);
    }

    public info(...args: any[]) {
        log.info(...args);
    }

    public debug(...args: any[]) {
        log.debug(...args);
    }
}
