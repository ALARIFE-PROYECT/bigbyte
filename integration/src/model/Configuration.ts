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

import { Command } from "./Command";

/**
 * Configuracion para la integracion de otras addons con el CLI y entre addons
 * 
 * Rules:
 * * Los datos no se sobre escriben, el primero que se declara se almacena
 */
export interface Configuration {
    // declaracion de nuevos comandos
    newCommands?: Command[];

    // declaracion de comandos para nuevos flags
    commandDeclaration?: Command[];
}