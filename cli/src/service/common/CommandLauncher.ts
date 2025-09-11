/*
 * Copyright (c) 2025 Jose Eduardo Soria Garcia <alarifeproyect@gmail.com>
 *
 * This file is part of @bigbyte/cli.
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

import { CommandData } from "@bigbyte/integration";
import { ConfigurationError } from "../../exception";

export const launchCommand = (data: CommandData) => {
    const { command } = data;
    if ('path' in command) {
        const commandDependency = require(command.path.replace('.ts', '.js'));

        if (!commandDependency.default || typeof commandDependency.default !== 'function') {
            throw new ConfigurationError('command', `The command at path ${command.path} does not export a default function.`);
        }

        // Funcion exportada por el comando
        commandDependency.default(data);
    }

}