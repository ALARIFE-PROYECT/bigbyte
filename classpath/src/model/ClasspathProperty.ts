import { ClasspathType } from "./ClasspathType";

export interface ClasspathProperty {
    name: string;
    type: ClasspathType;
    decorators: string[];
}
