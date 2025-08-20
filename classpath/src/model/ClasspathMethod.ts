import { ClasspathProperty } from "./ClasspathProperty";
import { ClasspathType } from "./ClasspathType";

export interface ClasspathMethod {
    name: string;
    decorators: string[];
    params: ClasspathProperty[];
    returnType: ClasspathType;
}
