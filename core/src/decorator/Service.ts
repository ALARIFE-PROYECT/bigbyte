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
