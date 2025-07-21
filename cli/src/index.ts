#!/usr/bin/env node

import { Addon, Command, CommandData, Dependency, FlagData, MainFile } from "@bigbyte/utils/integration";

import { BIN_NAME } from "./constant";
import { MissingArgumentError } from "./exception";

import { readAddons } from "./service/common/Addon"
import { getMainFile, readArguments } from "./service/common/Arguments";
import { getCommand, getEnvDefaultValue, readConfigurations } from "./service/common/Configuration";
import { readEnvironments } from "./service/common/Environment";
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
const envDefaultValues: Map<string, string> = getEnvDefaultValue();

const environmentValues: Map<string, string> = readEnvironments(envDefaultValues, flagsData);

launchCommand({
    mainFile,
    command,
    flagsData,
    environmentValues,
    envDefaultValues,
    dependencies,
    addons,
    commands
} as CommandData);
