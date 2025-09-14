# 🔄️ @bigbyte/logger - Módulo de Registro y Trazas Declarativo

<div align="center">

[![NPM Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://www.npmjs.com/package/@bigbyte/logger)
[![License](https://img.shields.io/badge/license-Apache_2.0-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

**Decorador @Logger y servicios para habilitar registro estructurado, trazas y configuración declarativa de rotación de archivos dentro del ecosistema BigByte.**

</div>

## 📋 Tabla de Contenidos
- [Características](#-características)
- [Instalación](#-instalación)
- [Comandos](#-comandos)
- [Decoradores](#-decoradores)
- [Uso Básico](#-uso-básico)
- [API Detallada](#-api-detallada)
- [Arquitectura](#-arquitectura)
- [Manejo de Errores](#-manejo-de-errores)
- [Ejemplos Avanzados](#-ejemplos-avanzados)
- [Licencia](#-licencia)

## ✨ Características
* Decorador **@Logger** que registra automáticamente un LoggerService dentro del contenedor IoC.
* Integración con el ciclo declarativo de @bigbyte/events (declare → execute → instantiate).
* Basado en `@bigbyte/utils/logger` para niveles: error, warn, info, debug, dev.
* Inyección simple mediante `@Inject()` (al ser componente registrado e inyectable).
* Flags CLI para configurar archivo de trazas y futura rotación por tiempo o tamaño.
* Variables de entorno equivalentes a los flags para automatizar despliegues.
* Convenciones de metadatos para detección y validación (**@App** debe existir antes de **@Logger**).
* Preparado para ampliación futura: rotación de logs (time / size) y segmentación modular.

## 🚀 Instalación
```bash
npm install @bigbyte/logger
```

## 🖥️ Comandos
Este paquete no define comandos propios, pero extiende la semántica del comando `run` de `@bigbyte/cli` añadiendo flags declarados vía integración (`configuration.ts`):

### Flags añadidos al comando run
- `--trace-log-file` (ENV: `TRACE_LOG_FILE`): Ruta del archivo de traza. Si se omite no se genera archivo.
- `--trace-log-file-time-interval` (ENV: `TRACE_LOG_FILE_TIME_INTERVAL`): Intervalo en milisegundos para rotar el archivo (futuro / WIP).
- `--trace-log-file-size-interval` (ENV: `TRACE_LOG_FILE_SIZE_INTERVAL`): Umbral de tamaño en bytes para rotar (futuro / WIP).

> Rotación por tiempo y tamaño: especificadas como diseño inicial, implementación completa en versiones posteriores.

## 🤖 Decoradores

### @Logger()
Registra el `LoggerService` durante la fase final del ciclo de decoradores. Requisitos:
* Debe aplicarse en la clase raíz que ya tenga `@App()`.
* Valida orden y existencia de `@App` antes de proceder.
* Marca metadatos: `metadata:logger` y `${METADATA_DECORATOR_NAME}=@Logger`.

Efectos:
* Añade `LoggerService` al `componentRegistry` como componente inyectable.
* Permite inyección mediante `@Inject() private logger!: LoggerService`.

## 🔧 Uso Básico

Uso de Logger mediante importacion

```ts
import 'reflect-metadata';
import { App, Inject } from '@bigbyte/core';
import { log } from '@bigbyte/logger';

@App()
@Logger()
class MainApp {

  start() {
    log.info('Aplicación iniciada');
  }
}
```

Uso de Logger mediante servicio inyectado

```ts
import 'reflect-metadata';
import { App, Inject } from '@bigbyte/core';
import { Logger, LoggerService } from '@bigbyte/logger';

@App()
@Logger()
class MainApp {

  constructor(private logger: LoggerService) {

  }

  start() {
    this.logger.info('Aplicación iniciada');
  }
}
```

CLI con archivo de traza:
```bash
bbyte run --trace-log-file=./logs/trace.log ./src/index.ts
```

Usando variable de entorno:
```bash
TRACE_LOG_FILE=./logs/trace.log
```

## 🔍 API Detallada
### LoggerService
Métodos expuestos:
* `error(...args)` – Errores críticos.
* `warn(...args)` – Advertencias.
* `info(...args)` – Información operativa.
* `debug(...args)` – Detalles de depuración.

Internamente delega en una instancia de `@bigbyte/utils/logger`.

### log (util)
Exporta una instancia directa del logger utilitario para usos puntuales:
```ts
import { log } from '@bigbyte/logger';
log.info('Mensaje sin inyección');
```

### Configuración de Trazas Futuras (Diseño)
Aunque la rotación aún no está activa, la intención de los flags es:
* `--trace-log-file-time-interval`: Programar rotaciones por ventana temporal.
* `--trace-log-file-size-interval`: Truncar / archivar al superar cierto tamaño.

Ambos convergerán hacia un servicio interno de intervalos (IntervalService) que evaluará condiciones y gestionará rotaciones.

## 🏗️ Arquitectura
```
src/
├── index.ts                    # Exportaciones públicas
├── constant/                   # Constantes (decoradores, ENV, ARGV, metadata)
├── decorator/
│   └── Logger.ts               # Decorador @Logger
├── integration/
│   └── configuration.ts        # Declaración de flags de integración CLI
└── service/
    ├── LoggerService.ts        # Fachada de logging inyectable
    ├── log.ts                  # Instancia compartida de util logger
    └── IntervalService.ts      # (WIP) Diseño de rotación por tiempo/tamaño
```
Dependencias clave:
* `@bigbyte/utils` – Logger base, constantes y utilidades de validación.
* `@bigbyte/events` – Ciclo de ejecución de decoradores (`declareDecorator`, `executeDecorator`).
* `@bigbyte/ioc` – Registro de componentes (`componentRegistry`).
* `@bigbyte/integration` – Modelo de configuración CLI para flags.
* `reflect-metadata` – Lectura de metadatos de tipos.

## ⚠️ Manejo de Errores
Errores potenciales (delegados a librerías base):
* `DecoratorError` si `@Logger` se aplica sin `@App` previo.
* Errores de inyección si el contenedor no resuelve dependencias (casos de uso avanzados modificando el registry).

Buenas prácticas:
* Orden: `@App` siempre antes de `@Logger`.
* Exportar la clase raíz para facilitar inspección externa.
* Definir ruta de traza bajo un directorio ignorado por control de versiones (`logs/`).

## 🔧 Ejemplos Avanzados
### Inyección en Servicios Encadenados
```ts
import { Service, Inject } from '@bigbyte/core';
import { LoggerService } from '@bigbyte/logger';

@Service()
class WorkerService {
  @Inject() private logger!: LoggerService;
  process() { this.logger.debug('Procesando lote...'); }
}
```

### Uso Mixto: Util directo + Servicio
```ts
import { log, LoggerService } from '@bigbyte/logger';

function bootStatus() {
  log.info('Iniciando arranque preliminar');
}
```

### Flags Combinados (Diseño Futuro)
```bash
bbyte run \
  --trace-log-file=./logs/trace.log \
  --trace-log-file-time-interval=600000 \
  --trace-log-file-size-interval=1048576 \
  ./src/index.ts
```

### Variables de Entorno Equivalentes
```bash
TRACE_LOG_FILE=./logs/trace.log \
TRACE_LOG_FILE_TIME_INTERVAL=600000 \
TRACE_LOG_FILE_SIZE_INTERVAL=1048576 \
bbyte run ./src/index.ts
```

## 📄 Licencia
Este proyecto está bajo la licencia Apache-2.0. Ver el archivo [LICENSE](LICENSE) para más detalles.

---
<div align="center">

**Desarrollado con ❤️ por Jose Eduardo Soria Garcia (mailto:alarifeproyect@gmail.com)**

*Parte del ecosistema BigByte*

</div>
