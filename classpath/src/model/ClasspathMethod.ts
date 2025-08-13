import { ClasspathProperty } from "./ClasspathProperty";

export interface ClasspathMethod {
    name: string;
    decorators: string[];
    params: ClasspathProperty[];
    returnType: string | string[];
}
