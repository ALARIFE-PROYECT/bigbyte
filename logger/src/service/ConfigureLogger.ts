import winston from 'winston';
import moment from 'moment';
import { TransformableInfo } from 'logform';
import { SPLAT } from 'triple-beam'
import TransportStream from 'winston-transport';
import { environmentService } from '@bigbyte/utils/environment';
import UtilsLogger from "@bigbyte/utils/logger";

import { initInterval } from './IntervalService';
import { ENV_TRACE_LOG_FILE, ENV_TRACE_LOG_FILE_SIZE_INTERVAL, ENV_TRACE_LOG_FILE_TIME_INTERVAL, LIBRARY_NAME } from '../constant';
import { join } from 'path';
import { writeFileSync } from 'fs';

const winstonConfigured: boolean = false;
const log = new UtilsLogger(LIBRARY_NAME);
const winstonBuffer: Array<string> = [];

winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'green',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'magenta'
});

const format = ({ level, message, stack, ...e }: TransformableInfo) => {
    let formattedMeta = '';

    if (stack) {
        formattedMeta += '\n' + stack
    }
    else if (e['0']) {
        formattedMeta += JSON.stringify(e['0'], null, 2);
    }
    else if (e[SPLAT]) {
        formattedMeta += JSON.stringify(e[SPLAT], null, 2);
    }

    const date = moment().format('YYYY-MM-DD HH:mm:ss');
    let value = `[${level}] [${date}] ${message} ${formattedMeta}`;

    if (!winstonConfigured) {
        winstonBuffer.push(value);
    }

    return value;
};

const consoleFormat = winston.format.printf(format);
const transports: TransportStream[] = [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.splat(),
            consoleFormat
        )
    }),
]

export let logger: winston.Logger = winston.createLogger({
    levels: winston.config.npm.levels,
    transports
});

export const configureLogger = (logBuffer: Array<string>) => {
    logBuffer.push(...winstonBuffer);
    console.log("🚀 ~ configureLogger ~ winstonBuffer:", winstonBuffer)

    const path = environmentService.get(ENV_TRACE_LOG_FILE);
    if (path) {
        log.info(`Logger configured to write logs to file: ${path}`);

        transports.push(
            new winston.transports.File({
                filename: path + '/trace.log',
                format: winston.format.combine(
                    winston.format.uncolorize(),
                    winston.format.json(),
                    consoleFormat
                )
            })
        );

        const filePath = join(path, 'trace.log');
        writeFileSync(filePath, logBuffer.map(line => `${line}\n`).join(''), { encoding: 'utf-8' });

        const logFileTimeInterval = environmentService.get(ENV_TRACE_LOG_FILE_TIME_INTERVAL);
        const logFileSizeInterval = environmentService.get(ENV_TRACE_LOG_FILE_SIZE_INTERVAL);
        if (logFileTimeInterval || logFileSizeInterval) {
            log.info(`Logger configured to rotate logs every ${logFileTimeInterval ? `${logFileTimeInterval} minutes.` : `${logFileSizeInterval} bytes.`}`);

            initInterval(path, logFileTimeInterval, logFileTimeInterval);
        }
    }

    logger = winston.createLogger({
        levels: winston.config.npm.levels,
        transports
    });
}
