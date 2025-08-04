/**
 * * Decorador
 * 
 * Para registrar una clase como un Componente del subtipo Servicio en el contenedor de dependencias.
 */

import 'reflect-metadata';

import { METADATA_COMPONENT_TYPE, METADATA_DECORATOR_NAME } from '@bigbyte/utils/constant';
import { ComponentType } from '@bigbyte/utils/registry';
import { declareDecorator, DecoratorError, decoratorExecEvent, executeDecorator, getDecorators } from "@bigbyte/utils/decorator";
import Logger from '@bigbyte/utils/logger';

import { DECORATOR_SERVICE_NAME, LIBRARY_NAME } from '../constant';
import coreRegistry from '../container/CoreComponentRegistry';


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
            const keys = Reflect.getMetadataKeys(Target);
            const decorators = getDecorators(keys);
            if (decorators.length > 1) {
                throw new DecoratorError(`Class ${Target.name} is decorated with ${decorators.join(', ')} and @Service() does not allow it.`);
            }

            const paramTypes = Reflect.getMetadata("design:paramtypes", Target) ?? [];
            coreRegistry.add(Target, paramTypes, { type: componentType });
        });

        executeDecorator(DECORATOR_SERVICE_NAME);
    }
}
