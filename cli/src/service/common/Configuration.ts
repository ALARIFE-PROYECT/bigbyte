import Logger from "@bigbyte/utils/logger";
import { Addon, Command, Configuration, Flag, FlagType } from "@bigbyte/utils/integration";

import { LIBRARY_NAME } from "../../constant";
import { ConfigurationError } from "../../exception";


const log = new Logger(LIBRARY_NAME);

const commands: Command[] = [];
let newCommands: Command[] = [];
let commandDeclaration: Command[] = [];

const processConfiguration = (configuration: Configuration) => {
    if (configuration.newCommands) {
        // se comprueba que no se añadan comandos con el mismo nombre
        configuration.newCommands.forEach((newCommand) => {
            const index = newCommands.findIndex(c => c.name === newCommand.name);

            if (index !== -1) {
                throw new ConfigurationError(newCommand.name, `Command with name ${newCommand.name} already exists. Cannot add new command with the same name.`);
            }

            newCommands.push(newCommand);
        });
    }

    if (configuration.commandDeclaration) {
        commandDeclaration.push(...configuration.commandDeclaration);
    }
}

const checkCommandFlags = (command: Command) => {
    // compruebo los flags del comando
    if ('flags' in command) {
        if (Array.isArray(command.flags)) {
            command.flags.forEach((flag) => {
                if (!flag.name || !flag.type) {
                    throw new ConfigurationError(command.name, `Flag in command ${command.name} must have a name and type.`);
                }

                if (!Object.values(FlagType).includes(flag.type)) {
                    throw new ConfigurationError(command.name, `Flag in command ${command.name} has an invalid type: ${flag.type}.`);
                }

                if(!flag.env && flag.defaultValue) {
                    throw new ConfigurationError(command.name, `The flag in the ${command.name} command has a default value but does not have an environment value key set.`);

                }
            });
        } else if (typeof command.flags === 'string') {
            if (!['-', '*'].includes(command.flags)) {
                throw new ConfigurationError(command.name, `Flag in command ${command.name} must be either '-' or '*' or Flag[].`);
            }
        }
    }
}

const combinedCommands = () => {
    newCommands.forEach((newCommand) => {
        // compruebo los datos del comando
        if ('path' in newCommand && !newCommand.path) {
            throw new ConfigurationError(newCommand.name, `Command with name ${newCommand.name} must have a path to its implementation.`);
        }

        if ('description' in newCommand && !newCommand.description || 'detail' in newCommand && !newCommand.detail) {
            throw new ConfigurationError(newCommand.name, `Command with name ${newCommand.name} must have a description and detail.`);
        }

        checkCommandFlags(newCommand);

        commands.push(newCommand);
    });

    commandDeclaration.forEach((declaredCommand) => {
        const index = commands.findIndex(c => c.name === declaredCommand.name);

        if (index === -1) {
            throw new ConfigurationError(declaredCommand.name, `Command with name ${declaredCommand.name} does not exist. Cannot declare flags for a non-existing command.`);
        }

        // si el comando es string pero la declaracion es un array
        if (Array.isArray(declaredCommand.flags) && typeof commands[index].flags === 'string') {
            throw new ConfigurationError(declaredCommand.name, `Command with name ${declaredCommand.name} already has a flag declared as '-' or '*'. Cannot add new flags.`);
        }

        // si el comando tiene flags pero la declaracion es un string
        if (Array.isArray(commands[index].flags) && typeof declaredCommand.flags === 'string') {
            throw new ConfigurationError(declaredCommand.name, `Command with name ${declaredCommand.name} already has flags declared as an array. Cannot add a string flag.`);
        }

        checkCommandFlags(declaredCommand);

        /**
         * si ambos son array, se combinan
         * 
         * * El caso de que el new sea undefined y se intente declara un flag: string --> no se contempla. EL flag: string SOLO SE DECLARA EN CREACION DE COMANDO
         */
        if (Array.isArray(commands[index].flags) && Array.isArray(declaredCommand.flags)) {
            (commands[index].flags as Flag[]).push(...declaredCommand.flags);
        }
    });
};

export const readConfigurations = (addons: Addon[]): Command[] => {
    addons.forEach((addon) => {
        if (addon.configuration) {
            processConfiguration(addon.configuration);
        }
    });

    combinedCommands();

    newCommands = [];
    commandDeclaration = [];

    return commands;
}

export const getCommand = (name: string): Command | undefined => {
    return commands.find(command => command.name === name);
}
