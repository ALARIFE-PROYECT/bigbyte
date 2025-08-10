export interface ClasspathElement {
    name: string;
    path: string; // ruta absoluta del archivo
    decorators: string[];
    props: ClasspathProperty[];
    methods: ClasspathMethod[];
}

export interface ClasspathMethod {
    name: string;
    decorators: string[];
    params: ClasspathProperty[];
    returnType: string | string[];
}

export interface ClasspathProperty {
    name: string;
    type: string | string[];
    decorators: string[];
}
