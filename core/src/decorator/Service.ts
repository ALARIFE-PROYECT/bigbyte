/**
 * * Decorador
 * 
 * Para registrar una clase como un Componente del subtipo Servicio en el contenedor de dependencias.
 */

import 'reflect-metadata';

import { METADATA_COMPONENT_TYPE, METADATA_DECORATOR_NAME } from '@bigbyte/utils/constant';
import { ComponentType, declareDecorator, executeDecorator } from '@bigbyte/utils/registry';
import Logger from '@bigbyte/utils/logger';

import { DECORATOR_SERVICE_NAME, LIBRARY_NAME } from '../constant';
import coreRegistry from '../container/CoreComponentRegistry';


const log = new Logger(LIBRARY_NAME);

export const Service = (): ClassDecorator => {
    declareDecorator(DECORATOR_SERVICE_NAME);

    return (Target: Function): void => {
        executeDecorator(DECORATOR_SERVICE_NAME);
        log.dev(`${DECORATOR_SERVICE_NAME} decorator applied to ${Target.name}`);

        const componentType = ComponentType.SERVICE;

        Reflect.defineMetadata(METADATA_COMPONENT_TYPE, componentType, Target);
        Reflect.defineMetadata(`${METADATA_DECORATOR_NAME}=${DECORATOR_SERVICE_NAME}`, true, Target);

        const paramTypes = Reflect.getMetadata("design:paramtypes", Target) ?? [];
        coreRegistry.add(Target, paramTypes, { type: componentType });
    }
}
