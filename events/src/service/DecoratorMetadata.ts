import { METADATA_DECORATOR_NAME } from '@bigbyte/utils/constant';

export const getDecorators = (metadataKeys: Array<string>): any => {
    const decorators = metadataKeys.filter(e => e.includes(METADATA_DECORATOR_NAME)).map(e => e.split('=')[1]);
    return decorators;
}
