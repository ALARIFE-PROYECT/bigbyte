# 🔄️ @bigbyte/core - Core Decorators & Dependency Injection Runtime

<div align="center">

[![NPM Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://www.npmjs.com/package/@bigbyte/core)
[![License](https://img.shields.io/badge/license-Apache--2.0-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

**Foundational decorators (@App, @Component, @Service, @Inject, @Value) and orchestration runtime for the BigByte ecosystem: typed component registry, event–driven boot cycle and contextual value resolution.**

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

* High‑level decorators: @App, @Component, @Service for declarative registration.
* Type‑based dependency injection via @Inject.
* External / contextual value injection with @Value(key).
* Automatic ordering & uniqueness validation of decorators.
* Central registry via `componentRegistry` (@bigbyte/ioc).
* Event–driven boot lifecycle (@bigbyte/events) with declaration → execution → instantiation phases.
* Uses `reflect-metadata` to read constructor / property types.
* Categorized components (MAIN, COMPONENT, SERVICE) for graph semantics.
* Lazy & safe resolution: explicit error if a dependency is missing.
* Value context integration (`ctxStore` from @bigbyte/ctx) for config / constants.
* Ready for watch / reload environments (chokidar integration through @bigbyte/cli).

## 🚀 Installation

```bash
npm install @bigbyte/core
```

## 🖥️ Commands

This package does not expose its own CLI commands. Functionality is activated declaratively by importing the decorators in your application code.

For runtime / scaffolding operations use `@bigbyte/cli` (if present).

## 🤖 Decorators

List & purpose:

1. **@App()**  Marks the root application class. Must be the first decorator on that class. Triggers final phase that instantiates the graph after all decorators have executed.
2. **@Component(options?)**  Registers a generic component (type COMPONENT). Accepts container options (`alias`, `scope`, etc. if supported by @bigbyte/ioc).
3. **@Service()**  Semantic shortcut for business logic components (type SERVICE). No options in this version.
4. **@Inject()**  Property decorator. Injects an instance whose type matches the decorated property type.
5. **@Value(key)**  Property decorator. Injects an immutable value looked up from `ctxStore` by key.

Rules:
* **@App** only once, only on the root class.
* **@Component** and **@Service** are mutually exclusive (do not combine on same class nor with other component decorators).
* **@Inject** and **@Value** cannot decorate private `#` fields.
* Registration materializes at the end (event `last`).

## 🔧 Basic Usage

Minimal example:
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
  @Inject() private timeService!: TimeService; // pulled from registry
  @Inject() private printer?: Printer; // remains undefined if not instantiated
  @Value('app.name') private appName!: string;

  run() {
    this.printer?.print(`${this.appName} started @ ${this.timeService.now()}`);
  }
}
```
> Ensure `ctxStore` (module @bigbyte/ctx) contains the key `app.name` before using @Value('app.name').

## 🔍 Detailed API

### @App()
* Type: ClassDecorator
* Effects: Declares MAIN component. Validates it is the first decorator. Registers a `last` listener adding the class to `componentRegistry` then emits `instantiated`.
* Metadata applied: `METADATA_COMPONENT_TYPE=MAIN`, `METADATA_DECORATOR_NAME=App`.

### @Component(options?: ComponentOptions without `type`)
* Registers the class with type COMPONENT.
* Validates uniqueness.
* Uses metadata tags for classification.

### @Service()
* Same internal behavior as @Component but semantic type SERVICE and no options.

### @Inject()
* PropertyDecorator. Uses `design:type` to find constructor to inject.
* Looks up in `componentRegistry`. Throws DecoratorError if missing.
* Defines a dynamic getter (always resolves current instance from registry).

### @Value(key: string)
* PropertyDecorator. Resolves `ctxStore.getByKey(key)?.value`.
* Read‑only (no setter defined).

### Internal Registration Flow
1. Each decorator calls `declareDecorator(name)` on application.
2. Each subscribes logic to `decoratorExecEvent.on('last', ...)`.
3. `executeDecorator(name)` marks execution; once all declared decorators finish, event `last` fires final registrations.
4. **@App** emits `instantiated` after container population enabling upper-layer bootstrap hooks.

## 🏗️ Architecture

Simplified structure:
```
src/
├── index.ts                 # Public exports
├── constant/
│   └── index.ts             # Decorator names & internal constants
└── decorator/
    ├── App.ts               # Root (MAIN) decorator & instantiation trigger
    ├── Component.ts         # Generic component decorator
    ├── Service.ts           # Service specialization
    ├── Inject.ts            # Type-based injection
    └── Value.ts             # Context value injection
```
Key dependencies:
* @bigbyte/utils  (constants, logger, validation utilities)
* @bigbyte/ioc    (componentRegistry, component categorization)
* @bigbyte/events (decorator execution cycle)
* @bigbyte/ctx    (value store used by @Value)
* reflect-metadata (runtime type metadata)

## ⚠️ Error Handling

Relevant errors (from @bigbyte/utils/exception):
* DecoratorError when:
  - Decorating a private `#` field with **@Inject** or **@Value**.
  - Missing component for requested type in **@Inject**.
  - Violating uniqueness / ordering rules (`checkFirstDecorator`, `checkUniqueDecorator`).

Best practices:
* Export all decorated classes (helps higher‑level scanning/tooling).
* Avoid side effects needing instances before `instantiated` event fires.

## 🔧 Advanced Examples

### Chained Injection & Config Values
```ts
@Service()
class ConfigService { get(key: string) { /* ... */ } }

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

This project is licensed under Apache-2.0. See the LICENSE file for details.

---

<div align="center">

**Built with ❤️ by Jose Eduardo Soria Garcia (mailto:alarifeproyect@gmail.com)**

*Part of the BigByte ecosystem*

</div>
