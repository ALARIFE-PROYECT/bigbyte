import { existsSync, readFileSync } from "fs";
import { ROOT_PATH } from "@bigbyte/utils/constant";
import Logger from "@bigbyte/utils/logger";

import { DEFAULT_BANNER_PATH, LIBRARY_NAME } from "../../constant";

const log = new Logger('Banner', LIBRARY_NAME);
log.setOptions({ header: false })

interface ServerProperty {
    key: string;
    value: string;
}

export const displayBanner = (serverProperties: ServerProperty[]) => {
    const mainBanner = `${ROOT_PATH}/banner.txt`;
    const path = existsSync(mainBanner) ? mainBanner : DEFAULT_BANNER_PATH;
    const banner = readFileSync(path, { encoding: 'utf8' });

    log.info(banner);
    log.info('\n');

    serverProperties.forEach((property: ServerProperty) => {
        log.info(`${property.key}: ${property.value}`);
    });
};
