/*
 * Copyright (c) 2025 Jose Eduardo Soria Garcia <alarifeproyect@gmail.com>
 *
 * This file is part of @bigbyte/core.
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
 * Decora la clase principal para iniciar el proceso
 */

import "reflect-metadata";

import { METADATA_COMPONENT_TYPE, METADATA_DECORATOR_NAME } from "@bigbyte/utils/constant";
import { declareDecorator, decoratorExecEvent, executeDecorator } from "@bigbyte/events";
import { componentRegistry, ComponentType } from "@bigbyte/ioc";
import Logger from "@bigbyte/utils/logger";
import { checkFirstDecorator } from "@bigbyte/utils/utilities";

import { DECORATOR_APP_NAME, LIBRARY_NAME } from "../constant";


const log = new Logger(LIBRARY_NAME);

export const App = (): ClassDecorator => {
    declareDecorator(DECORATOR_APP_NAME);

    return (Target: Function): void => {
        log.dev(`${DECORATOR_APP_NAME} decorator applied to ${Target.name}`);

        const componentType = ComponentType.MAIN;

        // Valido que el decorador @App() es el primero que se aplica a la clase
        checkFirstDecorator(Target);

        // Definicion d emetadatos
        Reflect.defineMetadata(METADATA_COMPONENT_TYPE, componentType, Target);
        Reflect.defineMetadata(`${METADATA_DECORATOR_NAME}=${DECORATOR_APP_NAME}`, true, Target);

        // Registro de evento
        decoratorExecEvent.on('last', () => {
            const paramTypes = Reflect.getMetadata("design:paramtypes", Target) ?? [];
            componentRegistry.add(Target, paramTypes, { type: componentType, injectable: false });

            decoratorExecEvent.emit('instantiated');
        });

        executeDecorator(DECORATOR_APP_NAME);
    }
}
