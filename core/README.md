# 🔄️ @bigbyte/core - Core Decorators & Dependency Injection

<div align="center">

[![NPM Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://www.npmjs.com/package/@bigbyte/core)
[![License](https://img.shields.io/badge/license-Apache--2.0-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

**Foundational decorators (@App, @Component, @Service, @Inject, @Value) and orchestration runtime for the BigByte ecosystem: typed component registry, event-driven bootstrap lifecycle and contextual value resolution.**

</div>

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Commands](#-commands)
- [Decorators](#-decorators)
- [Basic Usage](#-basic-usage)
- [Detailed API](#-detailed-api)
- [Architecture](#-architecture)
- [Error Handling](#-error-handling)
- [Advanced Examples](#-advanced-examples)
- [License](#-license)

## ✨ Features

* High-level decorators: @App, @Component, @Service for declarative registration.
* Type-based dependency injection via @Inject.
* External value injection (dynamic context) with @Value(key).
* Order and uniqueness control for decorators (automatic validations).
* Centralized registry in `componentRegistry` (@bigbyte/ioc).
* Bootstrap cycle orchestrated by an event bus (@bigbyte/events) with phases (declaration, execution, instantiation).
* Integration with `reflect-metadata` to extract constructor / property types.
* Categorized components (MAIN, COMPONENT, SERVICE) for clear graph semantics.
* Lazy and safe resolution: explicit error if the injected component does not exist.
* Integration with value context (`ctxStore` from @bigbyte/ctx) for configuration / constants.
* Ready for watch / reload environments (chokidar in @bigbyte/cli).

## 🚀 Installation

```bash
npm install @bigbyte/core
```

## 🖥️ Commands

This package does not expose its own CLI commands. Its functionality is activated declaratively by importing the decorators within your application code.

For scaffolding / execution operations use the `@bigbyte/cli` package (if present in the project).

## 🤖 Decorators

List and main purpose:

1. **@App()**  Marks the main (root) application class. Must be the first decorator applied on that class. Triggers the final phase that instantiates the graph once all decorators have been processed.
2. **@Component(options?)**  Registers a class as a generic component (type COMPONENT). Allows additional container options (scope, alias, etc. if supported by @bigbyte/ioc).
3. **@Service()**  Semantic shortcut for business logic components (type SERVICE). Does not accept options in this version.
4. **@Inject()**  Property decorator. Injects the instance of a registered component whose type matches the decorated property's type.
5. **@Value(key)**  Property decorator. Injects an immutable value dynamically resolved from `ctxStore` by its key.

Order / Rules:
* **@App** only once and only on the root class.
* **@Component** and **@Service** are mutually exclusive (do not combine them on the same class nor with other component-type decorators).
* **@Inject** and **@Value** cannot be applied to private properties using the `#` syntax.
* The registry is materialized after the decorator execution chain finishes (event 'last').

## 🔧 Basic Usage

Minimal application example:

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
  @Inject() private printer?: Printer; // Undefined value until resolved lazily

  @Value('app.name') private appName!: string;

  // Automatic constructor dependency injection
  run(private timeService: TimeService) {
    this.printer?.print(`${this.appName} started @ ${this.timeService.now()}`);
  }
}
```

> For @Value('app.name') to work, ensure the value is previously loaded in the `ctxStore` (@bigbyte/ctx module).

## 🔍 Detailed API

### @App()
* Type: ClassDecorator
* Effects: Declares the MAIN component. Validates it is the first decorator on the class. Registers a listener on the 'last' event that adds the class to the `componentRegistry` and then emits 'instantiated'.
* Metadata applied: METADATA_COMPONENT_TYPE=MAIN, METADATA_DECORATOR_NAME=App.
* Constructor dependencies are injected.

### @Component(options?: ComponentOptions without 'type')
* Registers the class with type COMPONENT. Allows `alias`, `scope`, and other compatible fields defined in @bigbyte/ioc.
* Validates uniqueness of the component decorator.
* Uses metadata to differentiate the type.
* Constructor dependencies are injected.

### @Service()
* Same as **@Component** but semantically differentiated and without options. Type SERVICE.
* Constructor dependencies are injected.

### @Inject()
* PropertyDecorator. Uses `design:type` to identify the constructor to inject.
* Looks up the component in `componentRegistry`. If not found, throws DecoratorError.
* Defines a dynamic getter (does not overwrite the value, always accesses the current instance in the registry).

### @Value(key: string)
* PropertyDecorator. Resolves `ctxStore.getByKey(key)` and exposes its `.value` via a getter.
* Immutable from the consumer perspective (no setter defined).

### Internal Registration Flow
1. Each decorator invokes `declareDecorator(name)` when applied.
2. Each subscribes logic to the event `decoratorExecEvent.on('last', ...)`.
3. `executeDecorator(name)` marks execution; when all declarations have been processed, the 'last' event fires the definitive registration.
4. **@App** emits 'instantiated' after populating the container, enabling startup hooks in higher layers.

## 🏗️ Architecture

Simplified module structure:
```
src/
├── index.ts                 # Public export point
├── constant/
│   └── index.ts             # Decorator names and internal constants (LIBRARY_NAME, etc.)
└── decorator/
    ├── App.ts               # Root decorator (MAIN) and instantiation trigger
    ├── Component.ts         # Generic component decorator
    ├── Service.ts           # Specialized logical decorator
    ├── Inject.ts            # Type-based injection
    └── Value.ts             # Context value injection
```
Key dependencies:
* @bigbyte/utils  (constants, logger, validation utilities).
* @bigbyte/ioc    (componentRegistry, component types).
* @bigbyte/events (decorator execution lifecycle).
* @bigbyte/ctx    (context storage for **@Value**).
* reflect-metadata (type metaprogramming).

## ⚠️ Error Handling

Relevant errors (from @bigbyte/utils/exception):
* DecoratorError: thrown when:
  - Attempting to decorate a private property with **@Inject** or **@Value**.
  - A component for the requested type in **@Inject** is not found.
  - Decorator uniqueness rules are violated (utilities like `checkFirstDecorator`, `checkUniqueDecorator` may trigger internal exceptions).

Best practices:
* Ensure all decorated classes are exported (facilitates scanning in upper layers).
* Avoid side-effects requiring instances before the 'instantiated' event.

## 🔧 Advanced Examples

### Chained Injection and Configuration Values
```ts
@Service()
class ConfigService {
  get(key: string) { /* ... */ }
}

@Service()
class GreetingService {
  constructor(private config: ConfigService) {}
  message() { return `Hello ${this.config.get('user.name')}`; }
}

@Component()
class Greeter {
  @Inject() private greeting!: GreetingService;
  greet() { console.log(this.greeting.message()); }
}
```

### Using @Value for Feature Flags
```ts
@Component()
class FeatureToggle {
  @Value('feature.new-ui') private enabled!: boolean;
  isEnabled() { return !!this.enabled; }
}
```

### Root Pattern with @App
```ts
@App()
class Bootstrap {
  @Inject() private greeter!: Greeter;
  start() { this.greeter.greet(); }
}
```

## 📄 License

This project is licensed under the Apache-2.0 license. See the LICENSE file for details.

---

<div align="center">

**Built with ❤️ by Jose Eduardo Soria Garcia (mailto:alarifeproyect@gmail.com)**

*Part of the BigByte ecosystem*

</div>
