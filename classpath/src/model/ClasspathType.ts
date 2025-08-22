import { ClasspathReference } from './ClasspathReference';

// export type ClasspathType = string | ClasspathReference | Array<string | ClasspathReference>;

interface ClasspathUtilType {
  name: string;
  arguments: string[]; // son los argumentos los ue tiene que tener referencia
//   propertiesEvaluated: string[];
}

// interface t {
//     // ref?: string;
//     name: string;
//     isAlias: boolean;
//     value: string;
// }

export type KindType = 'union' | 'intersection' | 'alias' | 'array' | 'object' | 'inline-object' | 'primitive' | 'enum';

interface PropertyType {
  name: string;
  type: ClasspathType;
}

export interface ClasspathType {
    kind: KindType;

    /**
     * Union o Intersection
     */
    types?: ClasspathType[];

    /**
     * primitive
     */
    text?: string;

    /**
     * alias
     */
    name?: string;
    arguments?: ClasspathType[];

    /**
     * Object o enum
     */
    ref?: string;

    /**
     * inline-object
     */
    properties?: PropertyType[];

    /**
     * array
     */
    type?: ClasspathType;
}
