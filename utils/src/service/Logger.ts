import moment from "moment";
import argv from "./Arguments";
import { ARGV_FLAG_DEBUG } from "../constant";
import { DEV_LIBRARIES_LOG, DEV_MODE, DEV_ORIGINS_LOG } from "../constant/development";

export const logBuffer: Array<string> = [];

export interface LoggerOptions {
    header?: boolean;
}


export default class Logger {

    private origin: string;

    private library?: string;

    private options: LoggerOptions = {
        header: true
    }

    constructor(origin: string, library?: string) {
        this.origin = origin;
        this.library = library;
    }

    private message(type: 'INFO' | 'DEBUG' | 'ERROR' | 'WARN' | 'DEV', ...message: any[]) {
        const date = moment().format('YYYY-MM-DD HH:mm:ss');
        let result = '';

        if (this.options.header === true) {
            if (this.library) {
                result += `[${this.library}] `;
            }

            result += `[${this.origin}] ${date} ${type} `;
        }

        message.forEach((msg: any) => {
            if (typeof msg === 'object') {
                result += `${JSON.stringify(msg)} `;
            } else {
                result += `${msg} `;
            }
        });

        if (type !== 'DEV') {
            logBuffer.push(result);
        }

        return result;
    }
    
    public error(...message: any[]) {
        console.error(this.message('ERROR', ...message));
    }

    public warn(...message: any[]) {
        console.warn(this.message('WARN', ...message));
    }

    public info(...message: any[]) {
        console.log(this.message('INFO', ...message));
    }

    public debug(...message: any[]) {
        if (argv.has(ARGV_FLAG_DEBUG)) {
            console.log(this.message('DEBUG', ...message));
        }
    }

    public dev(...message: any[]) {
        const isLibrary = this.library && DEV_LIBRARIES_LOG.includes(this.library) || DEV_LIBRARIES_LOG.includes('*');
        const isOrigin = DEV_ORIGINS_LOG.includes(this.origin) || DEV_ORIGINS_LOG.includes('*');
    
        if (DEV_MODE && (isLibrary || isOrigin)) {
            console.log(this.message('DEV', ...message));
        }
    }

    setOptions(options: LoggerOptions) {
        this.options = options;
    }
}
