import { Configuration } from "./Configuration";

export interface Addon {
    name: string;
    version: string;
    path: string;
    configuration?: Configuration
}
