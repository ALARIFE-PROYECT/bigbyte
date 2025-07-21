import { EventEmitter } from "node:events";

export type EventType = 'first' | 'last' | string;

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
