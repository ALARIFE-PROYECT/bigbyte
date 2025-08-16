/**
 * * Decorador
 * 
 * Decora la clase principal para iniciar el Logger
 */

import "reflect-metadata";
import { METADATA_DECORATOR_NAME } from "@bigbyte/utils/constant";
import { declareDecorator, executeDecorator } from "@bigbyte/events";
import UtilsLogger from "@bigbyte/utils/logger";
import { componentRegistry, ComponentType } from "@bigbyte/ioc";

import { DECORATOR_LOGGER_NAME, LIBRARY_NAME, METADATA_LOGGER_DECORATED } from "../constant";
import { LoggerService } from "../service/LoggerService";


const log = new UtilsLogger(LIBRARY_NAME);

export const Logger = (): ClassDecorator => {
    declareDecorator(DECORATOR_LOGGER_NAME);

    return (Target: Function): void => {
        log.dev(`${DECORATOR_LOGGER_NAME} decorator applied to ${Target.name}`);

        Reflect.defineMetadata(METADATA_LOGGER_DECORATED, true, Target);
        Reflect.defineMetadata(`${METADATA_DECORATOR_NAME}=${DECORATOR_LOGGER_NAME}`, true, Target);

        componentRegistry.add(LoggerService, [], { type: ComponentType.COMPONENT, injectable: true });

        executeDecorator(DECORATOR_LOGGER_NAME);
    }
}