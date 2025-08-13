import { ClasspathMethod } from "./ClasspathMethod";
import { ClasspathProperty } from "./ClasspathProperty";

export interface ClasspathElement {
    name: string;
    rootPath: string; // ruta absoluta del archivo ts
    outPath: string; // ruta absoluta del archivo js
    decorators: string[];
    props: ClasspathProperty[];
    methods: ClasspathMethod[];
}
