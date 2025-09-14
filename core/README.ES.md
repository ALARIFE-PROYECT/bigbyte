# 🔄️ @bigbyte/core - Núcleo de Decoradores e Inyección de Dependencias

<div align="center">

[![NPM Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://www.npmjs.com/package/@bigbyte/core)
[![License](https://img.shields.io/badge/license-Apache--2.0-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

**Conjunto de decoradores fundamentales (@App, @Component, @Service, @Inject, @Value) y runtime de orquestación para el ecosistema BigByte: registro tipado de componentes, ciclo de arranque basado en eventos y resolución contextual de valores.**

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

* Decoradores de alto nivel: @App, @Component, @Service para registro declarativo.
* Inyección de dependencias por tipo mediante @Inject.
* Inyección de valores externos (contexto dinámico) con @Value(key).
* Control del orden de aplicación y unicidad de decoradores (validaciones automáticas).
* Registro centralizado en `componentRegistry` (@bigbyte/ioc).
* Ciclo de arranque orquestado por un bus de eventos (@bigbyte/events) con fases (declaración, ejecución, instanciación).
* Integración con `reflect-metadata` para extracción de tipos de constructor / propiedades.
* Componentes categorizados (MAIN, COMPONENT, SERVICE) para semántica clara del grafo.
* Resolución perezosa y segura: error explícito si no existe el componente inyectado.
* Integración con contexto de valores (`ctxStore` de @bigbyte/ctx) para configuración / constantes.
* Preparado para entornos con recarga y observación (chokidar en @bigbyte/cli).

## 🚀 Instalación

```bash
npm install @bigbyte/core
```

## 🖥️ Comandos

Este paquete no expone comandos CLI propios. Su funcionalidad se activa de forma declarativa al importar los decoradores dentro de tu código de aplicación. 

Para operaciones de scaffolding / ejecución usar el paquete `@bigbyte/cli` (si está presente en el proyecto).

## 🤖 Decoradores

Listado y propósito principal:

1. **@App()**  Marca la clase principal (root) de la aplicación. Debe ser el primer decorador aplicado en esa clase. Dispara la fase final que instancia el grafo cuando todos los decoradores han sido procesados.
2. **@Component(options?)**  Registra una clase como componente genérico (type COMPONENT). Permite opciones adicionales del contenedor (scope, alias, etc. si son soportadas por @bigbyte/ioc).
3. **@Service()**  Atajo semántico para componentes de lógica de negocio (type SERVICE). No admite opciones en esta versión.
4. **@Inject()**  Decorador de propiedad. Inyecta la instancia de un componente registrado cuyo tipo coincide con el tipo de la propiedad decorada.
5. **@Value(key)**  Decorador de propiedad. Inyecta un valor inmutable resuelto dinámicamente desde `ctxStore` por su clave.

Orden / Reglas:
* **@App** solo una vez y solo en la clase raíz.
* **@Component** y **@Service** son mutuamente excluyentes (no combinar en la misma clase ni con otros decoradores de tipo componente).
* **@Inject** y **@Value** no pueden aplicarse sobre propiedades privadas con sintaxis #.
* El registro se materializa al finalizar la cadena de ejecuciones de decoradores (evento 'last').

## 🔧 Uso Básico

Ejemplo mínimo de aplicación:

```ts
import 'reflect-metadata';
import { App, Service, Inject, Value, Component } from '@bigbyte/core';

@Service()
class TimeService {
  now() { return new Date().toISOString(); }
}

@Component({ injectable: false })
class Printer {
  print(msg: string) { console.log('[PRINT]', msg); }
}

@App()
class MainApp {
  @Inject() private timeService!: TimeService; // Valor rescatado del registry
  @Inject() private printer?: Printer; // Valor undefined
  @Value('app.name') private appName!: string;

  run() {
    this.printer.print(`${this.appName} iniciado @ ${this.timeService.now()}`);
  }
}
```

> Para que @Value('app.name') funcione, asegúrate de que el valor está previamente cargado en el `ctxStore` (módulo @bigbyte/ctx).

## 🔍 API Detallada

### @App()
* Tipo: ClassDecorator
* Efectos: Declara el componente MAIN. Valida que sea el primer decorador de la clase. Registra un listener al evento 'last' que añade la clase al `componentRegistry` y posteriormente emite 'instantiated'.
* Metadatos aplicados: METADATA_COMPONENT_TYPE=MAIN, METADATA_DECORATOR_NAME=App.

### @Component(options?: ComponentOptions sin 'type')
* Registra la clase con type COMPONENT. Permite `alias`, `scope`, u otros campos compatibles definidos en @bigbyte/ioc.
* Valida unicidad de decorador de componente.
* Usa metadatos para diferenciar el tipo.

### @Service()
* Igual a **@Component** pero semánticamente diferenciado y sin opciones. type SERVICE.

### @Inject()
* PropertyDecorator. Usa `design:type` para identificar el constructor a inyectar.
* Busca el componente en `componentRegistry`. Si no existe, lanza DecoratorError.
* Define un getter dinámico (no sobrescribe valor, siempre accede a la instancia actual en el registry).

### @Value(key: string)
* PropertyDecorator. Resuelve `ctxStore.getByKey(key)` y expone su `.value` mediante un getter.
* Inmutable desde la perspectiva del consumidor (no define setter).

### Flujo Interno de Registro
1. Cada decorador invoca `declareDecorator(nombre)` al aplicarse.
2. Cada uno subscribe lógica al evento `decoratorExecEvent.on('last', ...)`.
3. `executeDecorator(nombre)` marca la ejecución; cuando todas las declaraciones han sido procesadas, el evento 'last' dispara el registro definitivo.
4. **@App** emite 'instantiated' tras poblar el contenedor, permitiendo hooks de arranque en capas superiores.

## 🏗️ Arquitectura

Estructura simplificada del módulo:
```
src/
├── index.ts                 # Punto de exportación público
├── constant/
│   └── index.ts             # Nombres de decoradores y constantes internas (LIBRARY_NAME, etc.)
└── decorator/
    ├── App.ts               # Decorador root (MAIN) y trigger de instanciación
    ├── Component.ts         # Decorador genérico de componentes
    ├── Service.ts           # Decorador especializado lógico
    ├── Inject.ts            # Inyección por tipo
    └── Value.ts             # Inyección de valores del contexto
```
Dependencias clave:
* @bigbyte/utils  (constantes, logger, utilidades de validación).
* @bigbyte/ioc    (componentRegistry, tipos de componente).
* @bigbyte/events (ciclo de ejecución de decoradores).
* @bigbyte/ctx    (almacenamiento contextual para **@Value**).
* reflect-metadata (metaprogramación de tipos). 

## ⚠️ Manejo de Errores

Errores relevantes (provenientes de @bigbyte/utils/exception):
* DecoratorError: lanzado cuando:
  - Se intenta decorar una propiedad privada con **@Inject** o **@Value**.
  - No se encuentra un componente para el tipo solicitado en **@Inject**.
  - Se violan reglas de unicidad de decoradores (utilidades `checkFirstDecorator`, `checkUniqueDecorator` pueden originar excepciones internas).

Buenas prácticas:
* Asegura que todas las clases decoradas se exportan (facilita el escaneo si se usa en capas superiores).
* Evita side-effects que requieran instancias antes del evento 'instantiated'.

## 🔧 Ejemplos Avanzados

### Inyección Encadenada y Valores de Configuración
```ts
@Service()
class ConfigService {
  get(key: string) { /* ... */ }
}

@Service()
class GreetingService {
  constructor(private config: ConfigService) {}
  message() { return `Hola ${this.config.get('user.name')}`; }
}

@Component()
class Greeter {
  @Inject() private greeting!: GreetingService;
  greet() { console.log(this.greeting.message()); }
}
```

### Uso de @Value para Feature Flags
```ts
@Component()
class FeatureToggle {
  @Value('feature.new-ui') private enabled!: boolean;
  isEnabled() { return !!this.enabled; }
}
```

### Patrón Root con @App
```ts
@App()
class Bootstrap {
  @Inject() private greeter!: Greeter;
  start() { this.greeter.greet(); }
}
```

## 📄 Licencia

Este proyecto está bajo la licencia Apache-2.0. Ver el archivo LICENSE para más detalles.

---

<div align="center">

**Desarrollado con ❤️ por Jose Eduardo Soria Garcia (mailto:alarifeproyect@gmail.com)**

*Parte del ecosistema BigByte*

</div>
