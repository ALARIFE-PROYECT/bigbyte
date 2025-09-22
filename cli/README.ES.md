# 🔄️ @bigbyte/cli - BigByte Command Line Interface

<div align="center">

[![NPM Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://www.npmjs.com/package/@bigbyte/cli)
[![License](https://img.shields.io/badge/license-Apache_2.0-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

**CLI modular para ejecutar, analizar, diagnosticar y empaquetar aplicaciones TypeScript dentro del ecosistema BigByte.**

</div>

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Instalación](#-instalación)
- [Comandos](#-comandos)
- [Uso Básico](#-uso-básico)
- [API Detallada](#-api-detallada)
- [Ejemplos Avanzados](#-ejemplos-avanzados)
- [Licencia](#-licencia)

## ✨ Características

- Ejecución tipificada de aplicaciones TypeScript (`run`)
- Compilación previa automática (usa `tsc` + configuración del proyecto)
- Inyección controlada de entorno y valores por defecto (`NODE_ENV=development`)
- Modo Watch con recarga incremental (`--watch`)
- Doctor de diagnóstico en vivo (`--doctor`)  **Proximas versiones**
- Banner informativo dinámico con metadatos de la app (`--banner`)
- Modo depuración para trazas extendidas (`--debug`)
- Carga de archivo `.env` custom (`--env=<ruta>`)
- Análisis estructural del código y generación de “classpath” (`scan`)
- Empaquetado con opción de minificación (`package --minify`)
- Flags de versión (`--version`, `-v`) y ayuda contextual (`help`)
- Integración con otras librerías BigByte: `@bigbyte/utils`, `@bigbyte/integration`, `@bigbyte/classpath`
- Arquitectura extensible orientada a configuración declarativa de comandos

## 🚀 Instalación

```bash
npm install @bigbyte/cli --save-dev
```

Ejecutable disponible como binario `bbyte`.

## 🖥️ Comandos

A continuación el conjunto de comandos y flags detectados desde la configuración interna (`src/integration/configuration.ts`).

### run
Ejecuta la aplicación principal compilando y lanzando el entrypoint proporcionado.

Flags:
- `--doctor` Activa el modo diagnóstico (env: `DOCTOR_MODE`) **Proximas versiones**.
- `--watch` Activa la detección de cambios (env: `WATCH_MODE`).
- `--debug` Activa modo depuración (env: `DEBUG_MODE`).
- `--env=<file>` Define archivo de entorno alternativo.
- `--banner` Activa (por defecto) la impresión del banner (env: `BANNER`).

### package
Genera un paquete distribuible de la aplicación.

Flags:
- `--minify` Activa minificación del output.

> Proximas versiones

### scan
Analiza la estructura del código TypeScript y genera un modelado estructural (clases, interfaces, enums, tipos, funciones). Sin flags adicionales.

> Usado para testear

### help
Muestra ayuda contextual. Permite granularidad: `help`, `help run`, `help run --watch`, `help --doctor`.

### --version / -v
Imprime la versión actual del CLI.

## 🔧 Uso Básico

Ejecutar una aplicación (entrypoint principal):
```bash
bbyte run ./src/index.ts
```

Ejecución en modo desarrollo con recarga y diagnóstico:
```bash
bbyte run --watch --doctor --debug ./src/index.ts
```

Usando un archivo de entorno específico:
```bash
bbyte run --env=.env.local ./src/index.ts
```

Ver versión del CLI:
```bash
bbyte --version
# o
bbyte -v
```

Analizar estructura del proyecto:
**Usado para desarrollar**
```bash
bbyte scan
```

Empaquetar con minificación:
```bash
bbyte package --minify
```

Mostrar ayuda de un flag específico:
```bash
bbyte help run --watch
```

## 🔍 API Detallada

### Modelo de Comando (`run`)
- Requiere archivo principal (`mainFile`).
- Inyecta entorno con valores por defecto: `NODE_ENV=development`.
- Fases internas:
  1. Lectura de `tsconfig`.
  2. Compilación TypeScript (errores encapsulados en `CompilationError`).
  3. Activación condicional de: Watcher (`chokidar`), Doctor, Banner, Debug Logs.
  4. Lanzamiento del runtime configurado.
  5. Métricas de tiempo de compilación.

### Flags del comando run
- `--doctor` (switch) Habilita servidor/servicio de diagnóstico. Default: `false` **Proximas versiones**.
- `--watch` (switch) Observa cambios y recompila. Default: `false`.
- `--debug` (switch) Activa logs extendidos. Default: `false`.
- `--env=<file>` (file) Define archivo `.env` alternativo. Si no se especifica usa raíz del proyecto.
- `--banner` (switch) Muestra banner con metadatos (App Name, Version, Cli Version). Default: `true`.

### Variables de Entorno Relacionadas
- `NODE_ENV` Entorno de ejecución (por defecto: `development`).
- `BANNER` Controla impresión del banner (`true`/`false`).
- `DOCTOR_MODE` Estado del modo doctor (solo lectura interna tras activación).
- `WATCH_MODE` Estado del modo watch (solo lectura interna tras activación).
- `DEBUG_MODE` Controla modo depuración.

### Comando package
- Genera artefacto distribuible.
- Flag: `--minify` (reduce tamaño eliminando espacios/comentarios).

### Comando scan
- Construye representación estructural del código usando `ts-morph`.
- Útil para tooling, generación de metadatos y análisis estático.

### Comando help
- Resolución contextual de acciones y flags.
- Admite combinaciones: acción + flag.

### Version Flags
- `--version` / `-v` consulta rápida de versión.

## 🔧 Ejemplos Avanzados

Prioridad Agumentos con Valores de Entorno
```bash
# Si el env BANNER añade un valor pero el los arguments marcan otro diferente, los arguments prevalecen sobre las environments

# File .env ---
BANNER=false 
# --

bbyte run --banner ./src/index.ts
```

Pipeline de desarrollo (watch + debug):
```bash
bbyte run --watch --debug ./src/index.ts
```

Generar paquete optimizado:
```bash
bbyte package --minify
```

Integración con script npm:
```json
"scripts": {
  "start": "bbyte run --watch ./src/index.ts",
  "analyze": "bbyte scan",
  "build": "bbyte package --minify"
}
```

Inspeccionar ayuda de un flag específico:
```bash
bbyte help run --env
```

## 📄 Licencia

Este proyecto está bajo la licencia Apache-2.0. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**Desarrollado con ❤️ por [Jose Eduardo Soria Garcia](mailto:alarifeproyect@gmail.com)**

*Parte del ecosistema BigByte*

</div>
