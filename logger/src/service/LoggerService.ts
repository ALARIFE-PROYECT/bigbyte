/*
 * Copyright (c) 2025 Jose Eduardo Soria Garcia <alarifeproyect@gmail.com>
 *
 * This file is part of @bigbyte/logger.
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
