/*
 * Copyright (c) 2025 Jose Eduardo Soria Garcia <alarifeproyect@gmail.com>
 *
 * This file is part of @bigbyte/events.
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

import { EventEmitter } from "node:events";

export type EventType = 'first' | 'last' | 'instantiated' | string;

export const decoratorExecEvent = new EventEmitter(); // evento lanzado al ejecutar un decorador
let decoratorSequence: string[] = [];

export const declareDecorator = (name: string) => {
    decoratorSequence.push(name);
}

export const executeDecorator = (name: string) => {
    const index = decoratorSequence.indexOf(name);

    decoratorExecEvent.emit(name);

    if (index === decoratorSequence.length - 1) {
        decoratorExecEvent.emit('first', name);
    }

    if (index === 0) {
        decoratorExecEvent.emit('last', name);
        
        decoratorExecEvent.removeAllListeners();
        decoratorSequence = [];
    }
}
