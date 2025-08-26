export type KindType = 'union' | 'intersection' | 'alias' | 'array' | 'object' | 'inline-object' | 'enum' | 'primitive';

export interface PropertyType {
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
  generic?: ClasspathType[];

  /**
   * inline-object
   */
  properties?: PropertyType[];

  /**
   * array
   */
  elementType?: ClasspathType;
}
