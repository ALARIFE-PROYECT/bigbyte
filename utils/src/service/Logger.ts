/*
 * Copyright (c) 2025 Jose Eduardo Soria Garcia <alarifeproyect@gmail.com>
 *
 * This file is part of @bigbyte/utils.
 *
 * Licensed under the Apache-2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License in the LICENSE file
 * at the root of this project.
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND.
 */

import moment from "moment";
import { argumentsService } from "./ArgumentService";
import { ARGV_FLAG_DEBUG } from "../constant";
import { DEV_LIBRARIES_LOG, DEV_MODE, DEV_ORIGINS_LOG } from "../constant/development";
import { environmentService } from "./EnvironmentService";
import { createWriteStream, existsSync, mkdirSync, WriteStream } from "node:fs";
import chalk from "chalk";


/** Constantes de acceso a para archivo de trazas */
const ENV_TRACE_LOG_FILE = 'TRACE_LOG_FILE'
const ARGV_TRACE_LOG_FILE = '--trace-log-file';

let stream: WriteStream | undefined;
const initStream = (): WriteStream | undefined => {
    const path = argumentsService.getValue(ARGV_TRACE_LOG_FILE) || environmentService.get(ENV_TRACE_LOG_FILE);

    if (path) {
        if (!stream) {
            if(!existsSync(path)) {
                try {
                    mkdirSync(path, { recursive: true });
                } catch (error) {
                    console.error(`Error creating log directory:`, error);
                }                
            }

            stream = createWriteStream(path + '/trace.log', { flags: 'a' });
        }

        return stream;
    }

    return undefined;
}

export interface LoggerOptions {
    header?: boolean;
    banner?: boolean;
}

export default class Logger {

    private origin?: string;

    private options: LoggerOptions = {
        header: true,
        banner: false
    }

    /**
     * Constructor
     * 
     * @param origin Libreria o nombre del origen del log.
     */
    constructor(origin?: string) {
        this.origin = origin;
        stream = initStream();
    }

    private getColoredLevel(level: 'INFO' | 'DEBUG' | 'ERROR' | 'WARN' | 'DEV'): string {
        switch (level) {
            case 'INFO':
                return chalk.green(level);
            case 'DEBUG':
                return chalk.blue(level);
            case 'ERROR':
                return chalk.red(level);
            case 'WARN':
                return chalk.yellow(level);
            case 'DEV':
                return chalk.magenta(level);
        }
    }

    private message(type: 'INFO' | 'DEBUG' | 'ERROR' | 'WARN' | 'DEV', ...message: any[]) {
        if (this.options.banner === true) {
            stream?.write(message[0] as string);
            return message[0] as string;
        }

        let logResult = '';
        let fileResult = '';

        if (this.options.header === true) {
            const date = moment().format('YYYY-MM-DD HH:mm:ss');

            logResult += `[${this.getColoredLevel(type)}] [${date}] `;
            fileResult += `[${type}] [${date}] `;

            if (this.origin) {
                logResult += `[${this.origin}] `;
                fileResult += `[${this.origin}] `;
            }
        }

        message.forEach((msg: any) => {
            if (typeof msg === 'object') {
                const v = JSON.stringify(msg)

                logResult += `${v}`;
                fileResult += `${v}`;
            } else {
                logResult += `${msg}`;
                fileResult += `${msg}`;
            }
        });

        if (type !== 'DEV') {
            stream?.write(fileResult + (!this.options.banner ? '\n' : ''));
        }

        return logResult;
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
        if (argumentsService.has(ARGV_FLAG_DEBUG)) {
            console.log(this.message('DEBUG', ...message));
        }
    }

    public dev(...message: any[]) {
        if (this.origin) {
            const isLibrary = DEV_LIBRARIES_LOG.includes(this.origin) || DEV_LIBRARIES_LOG.includes('*');
            const isOrigin = DEV_ORIGINS_LOG.includes(this.origin) || DEV_ORIGINS_LOG.includes('*');

            if (DEV_MODE && (isLibrary || isOrigin)) {
                console.log(this.message('DEV', ...message));
            }
        }
    }

    setOptions(options: LoggerOptions) {
        this.options = options;
    }
}
