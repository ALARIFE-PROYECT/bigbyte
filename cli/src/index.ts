#!/usr/bin/env node

import { environmentPreSet, readEnvironments } from "./service/common/Environment";
environmentPreSet();

import { Addon, Command, CommandData, Dependency, FlagData, MainFile } from "@bigbyte/utils/integration";

import { BIN_NAME } from "./constant";
import { MissingArgumentError } from "./exception";

import { readAddons } from "./service/common/Addon"
import { getMainFile, readArguments } from "./service/common/Arguments";
import { getCommand, readConfigurations } from "./service/common/Configuration";

import { launchCommand } from "./service/common/CommandLauncher";
import { getDependencies } from "./service/common/Package";

const dependencies: Dependency[] = getDependencies();
const addons: Addon[] = readAddons(dependencies);
const commands: Command[] = readConfigurations(addons);

const argv = process.argv.slice(2);

if (argv.length === 0) {
    throw new MissingArgumentError(`${BIN_NAME} [COMMAND]`, `At least one parameter is required, use "${BIN_NAME} help" for instructions.`);
}

const action: string = argv[0];
const command: Command | undefined = getCommand(action);

if (!command) {
    throw new MissingArgumentError('command', `The command "${action}" is not valid. Use "${BIN_NAME} help" for instructions.`);
}

argv.shift(); // Remove the action from argv

let mainFile: MainFile | undefined;
if ('requiresMainFile' in command && command.requiresMainFile === true) {
    mainFile = getMainFile(argv);
}

const flagsData: FlagData[] = readArguments(command, argv);

let environmentValues: Map<string, string | undefined> | undefined = undefined;
if ('injectEnvironment' in command && command.injectEnvironment === true) {
    environmentValues = readEnvironments(command, flagsData);
}


launchCommand({
    mainFile,
    command,
    flagsData,
    environmentValues,
    dependencies,
    addons,
    commands
} as CommandData);
