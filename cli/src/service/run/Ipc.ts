import { ChildProcess } from "node:child_process";
import { IpcMessage, THREAD_LOG_READY, THREAD_LOG_EMIT } from "@bigbyte/utils/ipc";
import { logBuffer } from "@bigbyte/utils/logger";


export const initIpc = (targetProcess: ChildProcess) => {
    targetProcess.on("message", (data: IpcMessage) => {
        if(data.type === THREAD_LOG_READY) {
            targetProcess.send({
                type: THREAD_LOG_EMIT,
                data: logBuffer
            });
        }
    });
}
