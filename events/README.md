# 🎯 @bigbyte/events - Event Management System for Decorators

<div align="center">

[![NPM Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://www.npmjs.com/package/@bigbyte/events) [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE) [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

**Advanced event system for managing and monitoring TypeScript decorator execution**
Decorator execution happens from **top to bottom** when talking about the same element, and the execution order of elements is **parameters, methods/accessors/properties, and finally classes**.
This library with event control gives you the option to make your logic not depend on the execution order and you can create events when your decorator logic needs it.

</div>

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Basic Usage](#-basic-usage)
- [Detailed API](#-detailed-api)
- [Architecture](#-architecture)
- [Advanced Examples](#-advanced-examples)
- [License](#-license)

## ✨ Features

- **🔄 Sequence Management**: Control of decorator execution order with start and end events
- **📡 Native EventEmitter**: Based on Node.js EventEmitter for maximum performance
- **🎯 Specific Events**: Granular event system for each individual decorator
- **🔍 Advanced Monitoring**: Complete tracking of decorator lifecycle
- **🧹 Auto-cleanup**: Automatic memory management with listener cleanup
- **⚡ High Performance**: Designed for applications with intensive decorator usage
- **🛡️ Error Handling**: Robust system of specific exceptions for decorators

## 🚀 Installation

```bash
npm install @bigbyte/events
```

## 🔧 Basic Usage

### Integration with TypeScript Decorators

```typescript
import { declareDecorator, executeDecorator, decoratorExecEvent } from '@bigbyte/events';

// class decorator
export const MyDecorator = (): ClassDecorator => {
  declareDecorator('MyDecorator');

  return (Target: Function): void => {
    executeDecorator('MyDecorator');
  };
};

export const MyDecoratorLast = (): ClassDecorator => {
  declareDecorator('MyDecoratorLast');

  return (Target: Function): void => {
    decoratorExecEvent.on('last', (decoratorName) => {
      console.log('Executes when the last decorator is executed');
    });

    executeDecorator('MyDecoratorLast');
  };
};

@MyDecorator()
@MyDecoratorLast()
class MyClass {}
```

## 🔍 Detailed API

### `decoratorExecEvent: EventEmitter`

Main EventEmitter that manages all decorator events.

**Available events:**

- `'first'` - Emitted when the first decorator in the sequence is executed
- `'last'` - Emitted when the last decorator in the sequence is executed
- `'instantiated'` - Reserved event for instantiation
- `[decoratorName]` - Specific event for each decorator

### `declareDecorator(name: string): void`

Declares a decorator in the execution sequence.

**Parameters:**

- `name` - Unique name of the decorator

**Example:**

```typescript
declareDecorator('AuthGuard');
declareDecorator('ValidationPipe');
```

### `executeDecorator(name: string): void`

Executes a decorator and emits the corresponding events.

**Parameters:**

- `name` - Name of the decorator to execute

**Behavior:**

- Emits specific event for the decorator
- Emits `'first'` if it's the last in the declared sequence
- Emits `'last'` if it's the first in the declared sequence
- Auto-cleans listeners and restarts sequence when completed

### `EventType`

TypeScript type that defines available events.

```typescript
type EventType = 'first' | 'last' | 'instantiated' | string;
```

## 🏗️ Architecture

The module is structured in three main components:

### 📁 Project Structure

```
src/
├── service/
│   └── DecoratorEvent.ts    # Main event system for decorators
└── index.ts                 # Main entry point
```

### 🔄 Execution Flow

1. **Declaration**: Decorators are registered using `declareDecorator()`
2. **Sequencing**: An execution sequence array is built internally
3. **Execution**: `executeDecorator()` processes each decorator in reverse order
4. **Events**: Specific and lifecycle events are emitted
5. **Cleanup**: Auto-cleanup when the sequence is completed

## 🔧 Advanced Examples

### Custom Event

The **instantiated** event is part of the event definition, but you can emit and observe events, always within the decorator execution/declaration flow.

```typescript
import { declareDecorator, executeDecorator, decoratorExecEvent } from '@bigbyte/events';

export const Server = (): ClassDecorator => {
  declareDecorator('Server');

  return (Target: Function): void => {
    // Due to decorator execution order, observation comes before emission
    decoratorExecEvent.on('instantiated', (instance) => {
        console.log('Target value: ', instance.value)
    });

    executeDecorator('Server');
  };
};

export const App = (): ClassDecorator => {
  declareDecorator('App');

  return (Target: Function): void => {
    // event fired when executing the last decorator
    decoratorExecEvent.on('last', () => {
      const instance = new Target();

      // after executing the last decorator I instantiate the class and emit the instance
      decoratorExecEvent.emit('instantiated', instance);
    });

    executeDecorator('App');
  };
};

// Usage
@Server()
@App()
class Main {
    name: string = 'Main';

  ...
}
```

### Event Hooks System

```typescript

```

## 📄 License

This project is under the ISC license. See the [LICENSE](LICENSE) file for more details.

---

<div align="center">

**Developed with ❤️ by [Jose Eduardo Soria Garcia](mailto:alarifeproyect@gmail.com)**

_Part of the BigByte ecosystem_

</div>
