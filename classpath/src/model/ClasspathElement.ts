import { ClasspathMethod } from './ClasspathMethod';
import { ClasspathProperty } from './ClasspathProperty';
import { ClasspathType } from './ClasspathType';

export enum ClasspathElementType {
  CLASS = 'CLASS',
  INTERFACE = 'INTERFACE',
  ENUM = 'ENUM',
  FUNCTION = 'FUNCTION'
}

export interface ClasspathEnumType {
  name: string;
  value: string;
}

export interface ClasspathElement {
  id: string;
  name: string;
  rootPath: string; // ruta absoluta del archivo ts
  outPath: string; // ruta absoluta del archivo js
  type: ClasspathElementType;
  

  decorators?: string[]; // usado en Class y Function

  /** Class & Interface */
  properties?: ClasspathProperty[];
  methods?: ClasspathMethod[];

  /** Enum */
  values?: ClasspathEnumType[];

  /** Function */
  parameters?: ClasspathProperty[];
  returnType?: ClasspathType;
}
