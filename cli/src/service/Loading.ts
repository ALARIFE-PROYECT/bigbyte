/*
 * Copyright (c) 2025 Jose Eduardo Soria Garcia <alarifeproyect@gmail.com>
 *
 * This file is part of @bigbyte/cli.
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

import logUpdate from "log-update";
import { log } from "node:console";
import EventEmitter from "node:events";

export const loadingScreen = (action?: string): EventEmitter => {
    const emitter = new EventEmitter();
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;

    const interval = setInterval(() => {
        const frame = frames[i = ++i % frames.length];
        let value = `${frame}`;

        if (action) {
            value += ` ${action}`;
        }

        logUpdate(value);
    }, 80);

    emitter.on('finish', () => {
        logUpdate.clear();
        logUpdate.done();
        clearInterval(interval);
    });

    return emitter;
}
