import { ClasspathMethod } from "./ClasspathMethod";
import { ClasspathProperty } from "./ClasspathProperty";

export interface ClasspathElement {
    name: string;
    path: string; // ruta absoluta del archivo
    decorators: string[];
    props: ClasspathProperty[];
    methods: ClasspathMethod[];
}
