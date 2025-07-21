import { PackageModel } from "@bigbyte/utils/cli";

import { CLI_PACKAGE_PATH } from "../constant";
import { readJsonFile } from "../util/File";

export default () => {
    const packageJson = readJsonFile(CLI_PACKAGE_PATH, 'package.json') as PackageModel;

    console.log(`Version: ${packageJson.version}`);
}