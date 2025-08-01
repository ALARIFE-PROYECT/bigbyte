/**
 * * Decorador
 * 
 * Decora la clase principal para iniciar el Logger
 */

import "reflect-metadata";
import { METADATA_CORE_COMPONENT_REGISTRY, METADATA_DECORATOR_NAME } from "@bigbyte/utils/constant";
import { ComponentType, declareDecorator, executeDecorator, MissingComponentRegistryError, decoratorExecEvent } from "@bigbyte/utils/registry";
import UtilsLogger from "@bigbyte/utils/logger";

import { DECORATOR_LOGGER_NAME, LIBRARY_NAME, METADATA_LOGGER_DECORATED } from "../constant";
// import { configureLogger } from "../service/ConfigureLogger";
import { LoggerService } from "../service/LoggerService";


const log = new UtilsLogger(LIBRARY_NAME);

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
            // configureLogger();
        });

        executeDecorator(DECORATOR_LOGGER_NAME);
    }
}