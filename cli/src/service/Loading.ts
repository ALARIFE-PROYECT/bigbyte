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
