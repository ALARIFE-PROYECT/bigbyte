/**
 * Este servicio accedera a todos los buffers de logs y los concatenara
 * 
 * * loggerBuffer from utils => cli thread
 * * loggerBuffer from utils => main thread
 * * winstonBuffer from logger => main thread
 */

import { IpcMessage, THREAD_LOG_EMIT, THREAD_LOG_READY } from "@bigbyte/utils/ipc";
import { logBuffer } from "@bigbyte/utils/logger";





const getLogBuffer = (): Promise<Array<string>> => {
    return new Promise((resolve, reject) => {
        // Datos de logger del thread del cli
        process.on("message", (message: IpcMessage) => {
            if (message.type === THREAD_LOG_EMIT) {
                return resolve(message.data as Array<string>);
            }
        });

        if (process?.send) {
            process?.send({ type: THREAD_LOG_READY });
        }
    });
}
