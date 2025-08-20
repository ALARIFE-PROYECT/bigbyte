import { ClasspathMethod } from "./ClasspathMethod";
import { ClasspathProperty } from "./ClasspathProperty";

export enum ClasspathElementType {
    CLASS = 'CLASS',
    INTERFACE = 'INTERFACE',
    ENUM = 'ENUM',
}

export interface ClasspathElement {
    id: string;
    name: string;
    type: ClasspathElementType;
    rootPath: string; // ruta absoluta del archivo ts
    outPath: string; // ruta absoluta del archivo js

    /**
     * Clases e Interfaces
     */
    props?: ClasspathProperty[];
    methods?: ClasspathMethod[];
    decorators?: string[]; // Las interfaces no tienen decoradores

    /**
     * Enums
     */
    values?: Map<string, any>;
}
