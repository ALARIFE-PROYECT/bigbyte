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

export type KindType = 'union' | 'intersection' | 'alias' | 'array' | 'tuple' | 'object' | 'primitive' | 'collection' | 'unknown';

export interface ClasspathType {
    kind: KindType;

    /**
     * Union o Intersection
     */
    types?: ClasspathType[];

    /**
     * Primitive
     */
    text?: string;

    /**
     * Alias
     */
    name?: string;
    arguments?: ClasspathType[];
    // ref?: string;

    /**
     * Object
     */
    properties?: { name: string; type: ClasspathType }[];

    /**
     * Array
     */
    elementType?: ClasspathType;
}
