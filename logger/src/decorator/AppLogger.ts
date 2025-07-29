/**
 * * Decorador
 * 
 * Decora la clase principal para iniciar el Logger
 */

import "reflect-metadata";
import { IpcMessage, THREAD_LOG_READY, THREAD_LOG_EMIT } from "@bigbyte/utils/ipc";
import { METADATA_CORE_COMPONENT_REGISTRY, METADATA_DECORATOR_NAME } from "@bigbyte/utils/constant";
import { ComponentType, declareDecorator, executeDecorator, MissingComponentRegistryError, decoratorExecEvent } from "@bigbyte/utils/registry";
import UtilsLogger, { logBuffer } from "@bigbyte/utils/logger";

import { DECORATOR_LOGGER_NAME, LIBRARY_NAME, METADATA_LOGGER_DECORATED } from "../constant";
import { configureLogger } from "../service/ConfigureLogger";
import { LoggerService } from "../service/LoggerService";


const log = new UtilsLogger(LIBRARY_NAME);

/**
 * ! Debe ser el ultimo decorador aplicado a la clase principal siempre
 */
export const AppLogger = (): ClassDecorator => {
    declareDecorator(DECORATOR_LOGGER_NAME);

    return (Target: Function): void => {
        log.dev(`${DECORATOR_LOGGER_NAME} decorator applied to ${Target.name}`);

        Reflect.defineMetadata(METADATA_LOGGER_DECORATED, true, Target);
        Reflect.defineMetadata(`${METADATA_DECORATOR_NAME}=${DECORATOR_LOGGER_NAME}`, true, Target);

        const coreRegistry = Reflect.getMetadata(METADATA_CORE_COMPONENT_REGISTRY, Target);

        if (!coreRegistry) {
            throw new MissingComponentRegistryError();
        }


        coreRegistry.add(LoggerService, [], { type: ComponentType.COMPONENT, injectable: true });

        // Se debe ejecutar cuando todos los decoradores muestren sus logs
        decoratorExecEvent.on('last', () => {
            const libraryLogger: Array<string> = [];

            // Datos de logger del thread del cli
            process.on("message", (message: IpcMessage) => {
                if (message.type === THREAD_LOG_EMIT) {
                    console.log("🚀 ~ AppLogger ~ message.data:", message.data)
                    libraryLogger.push(...message.data as Array<string>);
                }
            });

            if (process?.send) {
                process?.send({ type: THREAD_LOG_READY });
            }

            // datos de logger de los addons del thread del MainProcess
            libraryLogger.push(...logBuffer);
            console.log("🚀 ~ AppLogger ~ logBuffer:", logBuffer)

            configureLogger(libraryLogger);
        });

        executeDecorator(DECORATOR_LOGGER_NAME);
    }
}