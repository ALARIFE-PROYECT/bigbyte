/**
 * * Decorador
 * 
 * Decora la clase principal para iniciar el Logger
 */

import "reflect-metadata";
import { IpcMessage, THREAD_LOG_READY, THREAD_LOG_EMIT } from "@bigbyte/utils/ipc";
import { METADATA_CORE_COMPONENT_REGISTRY, METADATA_DECORATOR_NAME } from "@bigbyte/utils/constant";
import { ComponentType, declareDecorator, executeDecorator, MissingComponentRegistryError } from "@bigbyte/utils/registry";
import UtilsLogger from "@bigbyte/utils/logger";

import { DECORATOR_LOGGER_NAME, LIBRARY_NAME, METADATA_LOGGER_DECORATED } from "../constant";
import { configureLogger } from "../service/ConfigureLogger";
import { LoggerService } from "../service/LoggerService";


const log = new UtilsLogger(DECORATOR_LOGGER_NAME, LIBRARY_NAME);

/**
 * ! Debe ser el ultimo decorador aplicado a la clase principal siempre
 */
export const AppLogger = (): ClassDecorator => {
    declareDecorator(DECORATOR_LOGGER_NAME);

    return (Target: Function): void => {
        log.dev(`${DECORATOR_LOGGER_NAME} decorator applied to ${Target.name}`);

        Reflect.defineMetadata(METADATA_LOGGER_DECORATED, true, Target);
        Reflect.defineMetadata(`${METADATA_DECORATOR_NAME}=${DECORATOR_LOGGER_NAME}`, true, Target);

        process.on("message", (data: IpcMessage) => {
            console.log("🚀 ~ process.on ~ data:", data)
            if (data.type === THREAD_LOG_EMIT) {
                // TODO: se debe añadir al archivo de log o enviar a grafana si asi fuera necesario
            }
        });

        if (process?.send) {
            process?.send({ type: THREAD_LOG_READY });
        }

        const coreRegistry = Reflect.getMetadata(METADATA_CORE_COMPONENT_REGISTRY, Target);

        if (!coreRegistry) {
            throw new MissingComponentRegistryError();
        }

        configureLogger();
        coreRegistry.add(LoggerService, [], { type: ComponentType.COMPONENT, injectable: true });

        executeDecorator(DECORATOR_LOGGER_NAME);
    }
}