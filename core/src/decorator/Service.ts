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
 * Para registrar una clase como un Componente del subtipo Servicio en el contenedor de dependencias.
 */

import 'reflect-metadata';

import { METADATA_COMPONENT_TYPE, METADATA_DECORATOR_NAME } from '@bigbyte/utils/constant';
import { declareDecorator, decoratorExecEvent, executeDecorator } from "@bigbyte/events";
import Logger from '@bigbyte/utils/logger';
import { componentRegistry, ComponentType } from "@bigbyte/ioc";
import { checkUniqueDecorator } from '@bigbyte/utils/utilities';


import { DECORATOR_SERVICE_NAME, LIBRARY_NAME } from '../constant';


const log = new Logger(LIBRARY_NAME);

export const Service = (): ClassDecorator => {
    declareDecorator(DECORATOR_SERVICE_NAME);

    return (Target: Function): void => {
        log.dev(`${DECORATOR_SERVICE_NAME} decorator applied to ${Target.name}`);

        const componentType = ComponentType.SERVICE;

        Reflect.defineMetadata(METADATA_COMPONENT_TYPE, componentType, Target);
        Reflect.defineMetadata(`${METADATA_DECORATOR_NAME}=${DECORATOR_SERVICE_NAME}`, true, Target);

        decoratorExecEvent.on('last', () => {
            // Valida que la clase no tenga mas de un decorador
            checkUniqueDecorator(Target);

            const paramTypes = Reflect.getMetadata("design:paramtypes", Target) ?? [];
            componentRegistry.add(Target, paramTypes, { type: componentType });
        });

        executeDecorator(DECORATOR_SERVICE_NAME);
    }
}
