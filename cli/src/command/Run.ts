import { Logger } from "@bigbyte/utils/service/Decorators";
import { CommandData, Dependency } from "@bigbyte/utils/integration";
import { ENV_DEBUG_MODE, ROOT_PATH } from "@bigbyte/utils/constant";

import { LIBRARY_NAME } from "../constant";

import { initChangeDetector } from "../service/run/Watcher";
import { initDoctorServer } from "../service/run/Doctor";
import { compileTypeScript, readTsConfig } from "../service/run/TypeScriptCompiler";
import { CompilationError, CompilationErrorData } from "../exception/CompilationError";
import { TsConfigData } from "../model/TsConfigData";
import { configureLauncher, launchRun } from "../service/run/RunLauncher";
import { MissingArgumentError } from "../exception";
import { ENV_BANNER_MODE, ENV_DOCTOR_MODE, ENV_WATCH_MODE } from "../constant/environment";
import { displayBanner } from "../service/run/Banner";
import { readJsonFile } from "../util/File";
import { PackageModel } from "../model/PackageModel";


const log = new Logger(LIBRARY_NAME);

export default async (commandData: CommandData) => {
    const init = performance.now();

    if (!commandData.mainFile) {
        throw new MissingArgumentError('[MAIN_FILE]', 'The path of the application to be executed has not been provided.');
    }

    const getActive = (env: string): boolean => {
        const value = commandData.environmentValues?.get(env);
        return !!value && value.toLowerCase() === 'true';
    }

    const debugIsActive = getActive(ENV_DEBUG_MODE);
    const watchIsActive = getActive(ENV_WATCH_MODE);
    const doctorIsActive = getActive(ENV_DOCTOR_MODE);

    const tsConfigData: TsConfigData = readTsConfig();

    try {
        await compileTypeScript();
    } catch (error) {
        throw new CompilationError(error as CompilationErrorData)
    }

    if (watchIsActive) {
        initChangeDetector(tsConfigData.buildRootDir);
    }

    if (doctorIsActive) {
        initDoctorServer();
    }

    if (getActive(ENV_BANNER_MODE)) {
        const targetPackageJson = readJsonFile<PackageModel>(ROOT_PATH, 'package.json');
        const cliPackage: Dependency = commandData.dependencies.find((dependency: Dependency) => dependency.name === 'cli')!;

        displayBanner([
            { key: 'App Name', value: targetPackageJson.name },
            { key: 'Version', value: targetPackageJson.version },
            { key: 'Cli Version', value: cliPackage.version },
        ]);
    }

    configureLauncher(commandData, tsConfigData);
    launchRun();

    const end = performance.now();

    console.log();
    log.info(`compilation completed successfully. Time: ${((end - init) / 1000).toFixed(2)} s`);

    if (debugIsActive) {
        log.info(`Debug mode Active`);
    }
    if (watchIsActive) {
        log.info(`Watch mode Active`);
    }
    if (doctorIsActive) {
        log.info(`Doctor mode Active`);
    }
}
