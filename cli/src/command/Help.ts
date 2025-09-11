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

import { LIBRARY_ORGANIZATION_NAME } from "@bigbyte/utils/constant";
import { Command, CommandData, Flag } from "@bigbyte/integration";

const showCommand = (command: Command) => {
    console.log(`Help for command: ${command.name} \n`);
    if ('detail' in command) {
        console.log(`Detail: ${command.detail} \n`);
    }

    if ('flags' in command) {
        if (typeof command.flags === 'string') {
            if (command.flags === '*') {
                console.log('Flags: All flags from process.argv are accepted.');
            } else if (command.flags === '-') {
                console.log('Flags: No flags are accepted.');
            }
        } else if (Array.isArray(command.flags)) {
            console.log('Flags:');
            command.flags.forEach(flag => {
                if ('name' in flag && 'description' in flag) {
                    console.log(`  ${flag.name}: ${flag.description}`);
                } else {
                    console.log(`  ${flag}: No description available.`);
                }
            });
        }
    }
}

export default ({ commands }: CommandData) => {
    const argv = process.argv.slice(3);

    console.log(`This is the help for using the ${LIBRARY_ORGANIZATION_NAME} library cli \n`);

    if (argv.length === 0) {
        console.log('Commands: \n');
        commands.forEach(command => {
            if ('description' in command) {
                console.log(`  * ${command.name} - ${command.description}`);
            }
        });
    } else if (argv.length === 1) {
        const commandName: string = argv[0];
        const command: Command | undefined = commands.find(cmd => cmd.name === commandName);

        if (command) {
            showCommand(command);
        } else {
            console.log(`The command "${commandName}" does not exist.`);
        }
    } else if (argv.length === 2) {
        const commandName: string = argv[0];
        const flagName: string = argv[1];
        const command: Command | undefined = commands.find(cmd => cmd.name === commandName);

        if (command) {
            if ('flags' in command && Array.isArray(command.flags)) {
                const flag: Flag | undefined = command.flags.find(f => f.name === flagName);
                if (flag) {
                    console.log(`Help for flag "${flag.name}" in command "${command.name}" \n`);
                    console.log(`Detail: ${flag.detail}`);
                } else {
                    console.log(`The flag "${flagName}" does not exist in the command "${commandName}".`);
                }
            } else {
                console.log(`The flag "${flagName}" is not defined in the command "${commandName}".`);
            }
        } else {
            console.log(`The command "${commandName}" does not exist.`);
        }
    } else {
        console.log('Too many parameters provided. Use "help" for instructions.');
    }
}
