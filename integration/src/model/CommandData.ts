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

import { Addon } from "./Addon";
import { Command } from "./Command";
import { Dependency } from "./Dependency";
import { FlagData } from "./Flag";
import { MainFile } from "./MainFile";

export interface CommandData {
    /**
     * Archivo objetivo si lo hubiera.
     */
    mainFile?: MainFile;

    /**
     * Valores de comando actual
     */
    command: Command;
    flagsData: FlagData[];

    /**
     * Valores de las variables de entorno.
     */
    environmentValues?: Map<string, string | undefined>;

    /**
     * Lista de dependencias del framework.
     */
    dependencies: Dependency[];

    /**
     * A partir de las dependencias se extrae la configuración de los addons.
     */
    addons: Addon[];

    /**
     * lista de comandos disponibles
     */
    commands: Command[];
}