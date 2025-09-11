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

import { Environment } from "./Environment";
import { Flag } from "./Flag";
import { HelpBase } from "./Help";

export type FlagOptions = Flag[] | '*' | '-';

interface CommandBase {
  /**
   * Nombre del comando | accion existente o nuevo
   */
  name: string;

  /**
   * Flags que aplican a cada comando o accion
   *
   * * Los argumentos heredados de otros ADDONS son validos siempre
   *
   * ['*'] ==> Significa que GUARDA en el valor flags de Arguments.ts todos los flags que se encuentran en process.argv.
   * ['-'] ==> Significa que IGNORA ningun flag en el valor flags de Arguments.ts.
   * TODO: ['N'] ==> Significa que solo envia los N flags del principio del array de process.argv.
   */
  flags?: FlagOptions;
}


export type Command =
  // declaracion de comandos para nuevos flags
  CommandBase |
  // declaracion de nuevos comandos
  CommandBase & {

    /**
     * Ruta del comando a ejecutar
     */
    path: string,

    /**
     * Indica si el ultimo argv del comando es la ruta del archivo a ejecutar.
     */
    requiresMainFile?: boolean,

    /**
     * Indica si se deben inyectar las environments al comando
     */
    injectEnvironment?: boolean;

    /**
     * Valores de entorno no mapeados por los flags
     */
    environment?: Environment;
  } & HelpBase;
