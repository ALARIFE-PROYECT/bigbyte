import { ChildProcess, fork } from "node:child_process";

import Logger from "@bigbyte/utils/logger";
import { CommandData } from "@bigbyte/utils/lib/model/integration";

import { LIBRARY_NAME } from "../../constant";
import { initIpc } from "./Ipc";
import { join } from "node:path";
import { ROOT_PATH } from "@bigbyte/utils/constant";
import { TsConfigData } from "../../model/TsConfigData";


const log = new Logger('Launcher', LIBRARY_NAME);

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


        rootProcess = fork(appPath, argv, {
            env: { ...Object.fromEntries(commandData.environmentValues) },
            // silent: true
        });

        initIpc(rootProcess);

        rootProcess.stderr?.on("data", (data) => {
            console.log("🚀 ~ rootProcess.on ~ data:", data.toString())
        });
    } catch (error) {
        console.error(error);
    }
}
