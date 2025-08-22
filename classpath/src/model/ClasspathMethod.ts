import { ClasspathProperty } from "./ClasspathProperty";
import { ClasspathType } from "./ClasspathType";

export interface ClasspathMethod {
    name: string;
    decorators: string[];
    parameters: ClasspathProperty[];
    returnType: ClasspathType;
}
