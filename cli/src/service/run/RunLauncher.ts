import { ChildProcess, fork, ForkOptions } from "node:child_process";
import { join } from "node:path";

import Logger from "@bigbyte/utils/logger";
import { CommandData } from "@bigbyte/utils/integration";
import { ENV_CLASS_PATH, ROOT_PATH } from "@bigbyte/utils/constant";

import { LIBRARY_NAME } from "../../constant";
import { TsConfigData } from "../../model/TsConfigData";


const log = new Logger(LIBRARY_NAME);

let commandData: CommandData;
let tsConfigData: TsConfigData;
let rootProcess: ChildProcess | undefined;

const killProcess = () => {
    if (rootProcess) {
        rootProcess.kill();
        rootProcess = undefined;
    }
}

export const configureLauncher = (command: CommandData, tsConfig: TsConfigData) => {
    commandData = command;
    tsConfigData = tsConfig;

    log.dev('Launcher configured with command and tsConfig data.');
}

export const relaunchRun = () => {
    log.dev('Relaunching the root process...');

    if (rootProcess) {
        killProcess();
    }

    launchRun();
}

export const launchRun = () => {
    const mainFile = commandData.mainFile!;
    const argv = process.argv.slice(3);
    argv.pop();

    // lanzamiento
    try {
        log.dev(`Target app path: ${mainFile.path}`);

        let appPath = join(ROOT_PATH, tsConfigData.buildOutDir);
        const mainPath = mainFile.path.replace('.ts', '.js');

        mainPath.split('/').forEach((item) => {
            if (item !== '.' && !tsConfigData.buildRootDir.includes(item)) {
                appPath = join(appPath, item);
            }
        });

        let forkOptions: ForkOptions = {
            // silent: true
        };

        if ('injectEnvironment' in commandData.command && commandData.command.injectEnvironment === true && commandData.environmentValues) {
            forkOptions.env = { 
                ...Object.fromEntries(commandData.environmentValues),
                [ENV_CLASS_PATH]: JSON.stringify(tsConfigData.classpath)
             } as NodeJS.ProcessEnv;
        }

        rootProcess = fork(appPath, argv, forkOptions);

        rootProcess.stderr?.on("data", (data) => {
            console.log("🚀 ~ rootProcess.on ~ data:", data.toString())
        });
    } catch (error) {
        console.error(error);
    }
}
