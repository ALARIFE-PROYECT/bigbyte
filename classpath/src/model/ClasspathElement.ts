import { ClasspathMethod } from './ClasspathMethod';
import { ClasspathProperty } from './ClasspathProperty';

export enum ClasspathElementType {
  CLASS = 'CLASS',
  INTERFACE = 'INTERFACE'
}

export interface ClasspathElementCommon {
  id: string;
  name: string;
  rootPath: string; // ruta absoluta del archivo ts
  outPath: string; // ruta absoluta del archivo js
}

export interface ClasspathElement extends ClasspathElementCommon {
  type: ClasspathElementType;

  properties: ClasspathProperty[];
  methods: ClasspathMethod[];
  decorators?: string[];
}

export interface ClasspathEnumType {
  name: string;
  value: string;
}

export interface ClasspathEnumElement extends ClasspathElementCommon {
  values: ClasspathEnumType[];
}
