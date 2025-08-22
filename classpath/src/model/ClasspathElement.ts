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

export interface ClasspathEnumElement extends ClasspathElementCommon {
  values: Map<string, any>;
}



// export interface ClasspathClassElement extends ClasspathElementCommon {
//   type: ClasspathElementType.CLASS;

//   properties: ClasspathProperty[];
//   methods: ClasspathMethod[];
//   decorators: string[];
// }

// export interface ClasspathInterfaceElement extends ClasspathElementCommon {
//   type: ClasspathElementType.INTERFACE;

//   properties: ClasspathProperty[];
//   methods: ClasspathMethod[];
// }



// export interface ClasspathFunctionElement extends ClasspathElementCommon, ClasspathMethod {
//   type: ClasspathElementType.FUNCTION;
// }

// export interface ClasspathElement {
//   id: string;
//   name: string;
//   type: ClasspathElementType;
//   rootPath: string; // ruta absoluta del archivo ts
//   outPath: string; // ruta absoluta del archivo js

//   /**
//    * Clases e Interfaces
//    */
//   properties?: ClasspathProperty[];
//   methods?: ClasspathMethod[];
//   decorators?: string[]; // Las interfaces no tienen decoradores

//   /**
//    * Enums
//    */
//   values?: Map<string, any>;
// }
