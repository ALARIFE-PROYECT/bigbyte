import winston from 'winston';
import moment from 'moment';
import { TransformableInfo } from 'logform';
import { SPLAT } from 'triple-beam'
import TransportStream from 'winston-transport';
import { environmentService } from '@bigbyte/utils/environment';

import { initInterval } from './IntervalService';
import { ENV_TRACE_LOG_FILE, ENV_TRACE_LOG_FILE_SIZE_INTERVAL, ENV_TRACE_LOG_FILE_TIME_INTERVAL } from '../constant';

export let logger: winston.Logger | undefined;
export const configureLogger = () => {
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

    const path = environmentService.get(ENV_TRACE_LOG_FILE);
    if (path) {
        transports.push(
            new winston.transports.File({
                filename: path + '/combined.log',
                format: winston.format.combine(
                    winston.format.uncolorize(),
                    winston.format.json(),
                    consoleFormat
                )
            })
        );

        const logFileTimeInterval = environmentService.get(ENV_TRACE_LOG_FILE_TIME_INTERVAL);
        const logFileSizeInterval = environmentService.get(ENV_TRACE_LOG_FILE_SIZE_INTERVAL);
        if (logFileTimeInterval || logFileSizeInterval) {
            initInterval(path, logFileTimeInterval, logFileTimeInterval);
        }
    }

    logger = winston.createLogger({
        levels: winston.config.npm.levels,
        transports
    });
}
