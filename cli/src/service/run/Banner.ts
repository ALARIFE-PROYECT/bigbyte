import { existsSync, readFileSync } from "fs";
import { ROOT_PATH } from "@bigbyte/utils/constant";
import Logger from "@bigbyte/utils/logger";

import { DEFAULT_BANNER_PATH, LIBRARY_NAME } from "../../constant";


interface ServerProperty {
    key: string;
    value: string;
}

const logBanner = new Logger(LIBRARY_NAME);
logBanner.setOptions({ banner: true, header: false });

const logData = new Logger(LIBRARY_NAME);
logData.setOptions({ header: false })

/** 
 * * Banner display function
 * 
 * - WEB: https://devops.datenkollektiv.de/banner.txt/index.html
 * - FONT: slant | starwars | sub-zero
 * 
 */
export const displayBanner = (serverProperties: ServerProperty[]) => {
    const mainBanner = `${ROOT_PATH}/banner.txt`;
    const path = existsSync(mainBanner) ? mainBanner : DEFAULT_BANNER_PATH;
    const banner = readFileSync(path, { encoding: 'utf8' });

    logBanner.info(banner);

    logData.info('\n');

    serverProperties.forEach((property: ServerProperty) => {
        logData.info(`${property.key}: ${property.value}`);
    });

    logData.info('\n');
};
