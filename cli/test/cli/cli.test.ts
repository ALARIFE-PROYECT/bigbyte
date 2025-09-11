/*
 * Copyright (c) 2025 Jose Eduardo Soria Garcia <alarifeproyect@gmail.com>
 *
 * This file is part of @bigbyte/cli.
 *
 * Licensed under the Apache-2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License in the LICENSE file
 * at the root of this project.
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND.
 */




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
