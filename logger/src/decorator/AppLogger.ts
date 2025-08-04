/**
 * * Decorador
 * 
 * Decora la clase principal para iniciar el Logger
 */

import "reflect-metadata";
import { METADATA_CORE_COMPONENT_REGISTRY, METADATA_DECORATOR_NAME } from "@bigbyte/utils/constant";
import { ComponentType, MissingComponentRegistryError } from "@bigbyte/utils/registry";
import { declareDecorator, executeDecorator } from "@bigbyte/utils/decorator";
import UtilsLogger from "@bigbyte/utils/logger";

import { DECORATOR_LOGGER_NAME, LIBRARY_NAME, METADATA_LOGGER_DECORATED } from "../constant";
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

        executeDecorator(DECORATOR_LOGGER_NAME);
    }
}