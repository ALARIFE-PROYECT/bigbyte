


/** tsconfig test */

// falta el tsconfig.json

// experimentalDecorators en false o undefined

// emitDecoratorMetadata en false o undefined

// rootDir en undefined o vacio

// outDir en undefined o vacio

/** Argv */

// argv vacio o undefined

// argv main script no existe (No apunta a un archivo si no a una carpeta) o a un archivo .js

// se indica .env y el archivo no existe

// argv --env mal formado

/** Environment */

// validar lectura de environment

// validar flag argv y environment combinados
// ---- Si se indica el flag --debug, se ignora el environment DEBUG_MODE
// ---- el valor de --debug pesa sobre el environment DEBUG_MODE

/** Package */

// package.json no existe

/** Init app */

// comprobar si existe el archivo objetivo en el compilado
