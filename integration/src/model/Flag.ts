/*
 * Copyright (c) 2025 Jose Eduardo Soria Garcia <alarifeproyect@gmail.com>
 *
 * This file is part of @bigbyte/integration.
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

import { HelpBase } from "./Help";

/**
 * * Tipo del flag
 * 
 * 'switch' ==> Controla la activacion o no de ese flag
 * 'value' ==> Se debe indicar un valor
 */
export enum FlagType {
    switch = 'switch',
    value = 'value',
    file = 'file'
}

export interface Flag extends HelpBase {
    /**
     * Nombre del flag, por ejemplo "--doctor"
    */
    name: string;

    /**
     * key del environment donde se replica el valor. Si no existe no se replica
    */
    env?: string;

    type: FlagType;

    /**
     * valor por defecto del flag
     * Se indica cuando el argv escala al environment
     */
    defaultValue?: any;
}

/**
 * * Datos de un flag
 * 
 * Contiene el flag configurado a su accion y el valor que se le asigna por argv
 * Recibido por parametros a la funcion que debe exportar una accion
 */
export interface FlagData {
    flag: Flag;
    value: string | undefined;
}

