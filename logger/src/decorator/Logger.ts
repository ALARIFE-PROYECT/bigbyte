/*
 * Copyright (c) 2025 Jose Eduardo Soria Garcia <alarifeproyect@gmail.com>
 *
 * This file is part of @bigbyte/logger.
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
import { checkDecoratorExists } from "@bigbyte/utils/utilities";

import { DECORATOR_LOGGER_NAME, LIBRARY_NAME, METADATA_LOGGER_DECORATED } from "../constant";
import { LoggerService } from "../service/LoggerService";


const log = new UtilsLogger(LIBRARY_NAME);

export const Logger = (): ClassDecorator => {
    declareDecorator(DECORATOR_LOGGER_NAME);

    return (Target: Function): void => {
        log.dev(`${DECORATOR_LOGGER_NAME} decorator applied to ${Target.name}`);

        // Valida que @App ya fue aplicado
        checkDecoratorExists(Target, '@App');

        Reflect.defineMetadata(METADATA_LOGGER_DECORATED, true, Target);
        Reflect.defineMetadata(`${METADATA_DECORATOR_NAME}=${DECORATOR_LOGGER_NAME}`, true, Target);

        componentRegistry.add(LoggerService, [], { type: ComponentType.COMPONENT, injectable: true });

        executeDecorator(DECORATOR_LOGGER_NAME);
    }
}