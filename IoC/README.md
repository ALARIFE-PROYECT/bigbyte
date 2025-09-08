# 🧬 @bigbyte/ioc - Inversion of Control

<div align="center">

[![NPM Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://www.npmjs.com/package/@bigbyte/ioc)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

**A lightweight and powerful IoC container for TypeScript with full support for dependency injection and component lifecycle management.**

</div>

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation) 
- [Basic Usage](#-basic-usage)
- [Component Types](#-component-types)
- [Complete API](#-complete-api)
- [Error Handling](#-error-handling)
- [Architecture](#-architecture)
- [Advanced Examples](#-advanced-examples)
- [License](#-license)

## ✨ Features

- 🔄 **Automatic dependency injection** based on TypeScript metadata
- 🏗️ **Component registry** with strong typing
- 🎯 **Multiple component types** (Service, Repository, Controller, etc.)
- 🔍 **Intelligent resolution** of circular dependencies
- 📊 **Event system** for dynamic components
- 🛡️ **Robust error handling** with specific exceptions
- 🎮 **Programmatic API** flexible and extensible
- 🔧 **Granular configuration** of components
- 📝 **Native TypeScript** with full type support

## 🚀 Installation

```bash
npm install @bigbyte/ioc
```

## 🎯 Basic Usage

### Manual component registration

```typescript
import { componentRegistry } from '@bigbyte/ioc';

class DatabaseService {
  connect() {
    console.log('Connecting to database...');
  }
}

class UserService {
  constructor(private dbService: DatabaseService) {}
  
  getUsers() {
    this.dbService.connect();
    return ['user1', 'user2'];
  }
}

// Manual registration
componentRegistry.add(DatabaseService, []);
componentRegistry.add(UserService, [DatabaseService]);

// Get instance
const userService = componentRegistry.getByClass(UserService);
console.log(userService.instance.getUsers());
```

### Using the Injector

```typescript
import { Injector, componentRegistry } from '@bigbyte/ioc';

const injector = componentRegistry.getByClass(Injector);

// Register component
injector.add(UserService);

// Check existence
if (injector.has(UserService)) {
  const component = injector.get(UserService);
  console.log(component?.instance);
}
```

## 🏷️ Component Types

The system supports different component types to better organize your architecture:

```typescript
import { ComponentType } from '@bigbyte/ioc';

enum ComponentType {
  MAIN = 'MAIN',           // Main component
  COMPONENT = 'COMPONENT', // Generic component
  SERVICE = 'SERVICE',     // Business service
  REPOSITORY = 'REPOSITORY', // Data access
  CONTROLLER = 'CONTROLLER'  // Web controller
}
```

### Component configuration

```typescript
import { ComponentOptions } from '@bigbyte/ioc';

const options: ComponentOptions = {
  injectable: true,        // Whether it can be injected (default: true)
  type: ComponentType.SERVICE  // Component type (default: COMPONENT)
};

componentRegistry.add(UserService, [DatabaseService], options);
```

## 📚 Complete API

### ComponentRegistry

#### `add(Target, dependencies, options?): string`
Registers a new component in the container.

```typescript
const id = componentRegistry.add(
  UserService, 
  [DatabaseService], 
  { type: ComponentType.SERVICE }
);
```

#### `getByClass(Target, strict?): Component | undefined`
Gets a component by its class.

```typescript
const component = componentRegistry.getByClass(UserService);
// With strict=false doesn't throw exception if not found
const optional = componentRegistry.getByClass(OptionalService, false);
```

#### `getById(id): Component`
Gets a component by its unique ID.

```typescript
const component = componentRegistry.getById('uuid-v4');
```

#### `getByName(name): Component | undefined`
Gets a component by its class name.

```typescript
const component = componentRegistry.getByName('UserService');
```

#### `has(value): boolean`
Checks if a component exists (by class or ID).

```typescript
const exists = componentRegistry.has(UserService);
const existsById = componentRegistry.has('component-id');
```

#### `onComponentByName(name, callback): void`
Listens for component availability asynchronously.
The callback reacts when the component is added.

```typescript
componentRegistry.onComponentByName('UserService', (component) => {
  console.log('UserService is available:', component.instance);
});
```

### Component

Each registered component has the following properties:

```typescript
interface Component {
  readonly id: string;        // Generated unique ID
  readonly name: string;      // Class name
  readonly class: any;        // Class reference
  readonly instance: any;     // Component instance
  readonly options: ComponentOptions; // Configuration
  readonly createAt: Date;    // Creation date
}
```

### Injector

High-level service that is part of the component registry to access it programmatically.

```typescript
const injector = componentRegistry.getByClass(Injector);

injector.add(MyService);           // Add component
const component = injector.get(MyService);  // Get component
const exists = injector.has(MyService);     // Check existence
```

## ⚠️ Error Handling

### MissingDependencyError
Thrown when a required dependency is not found in the registry:

```typescript
try {
  componentRegistry.getByClass(NonExistentService);
} catch (error) {
  if (error instanceof MissingDependencyError) {
    console.log('Missing dependency:', error.message);
  }
}
```

### NonInjectableComponentError
Thrown when trying to inject a component marked as non-injectable:

```typescript
// Component marked as non-injectable
componentRegistry.add(UtilityClass, [], { injectable: false });

// This will throw NonInjectableComponentError
componentRegistry.add(ServiceClass, [UtilityClass]);
```

### CircularDependencyError
Circular dependencies are automatically detected:

```typescript
// This will cause a circular dependency error
class ServiceA {
  constructor(serviceB: ServiceB) {}
}

class ServiceB {
  constructor(serviceA: ServiceA) {}
}
```

## 🏗️ Architecture

### Registration Flow

```mermaid
graph TD
    A[Class + Dependencies] --> B[ComponentRegistry.add()]
    B --> C[Resolve Dependencies]
    C --> D[Create Component]
    D --> E[Create Instance]
    E --> F[Emit Events]
    F --> G[Store in Registry]
```

### Internal Structure

- **ComponentRegistry**: Centralized component management
- **Component**: Instance wrapper with metadata
- **Injector**: High-level API for programmatic use
- **BufferComponent**: Event system for dynamic components

## 🔧 Advanced Examples

### Repository Pattern

```typescript
interface IUserRepository {
  findById(id: string): User;
  save(user: User): void;
}

class DatabaseUserRepository implements IUserRepository {
  constructor(private dbConnection: DatabaseConnection) {}
  
  findById(id: string): User {
    // Database implementation
  }
  
  save(user: User): void {
    // Database implementation
  }
}

class UserService {
  constructor(private userRepository: IUserRepository) {}
  
  getUser(id: string): User {
    return this.userRepository.findById(id);
  }
}

// Registration with specific type
componentRegistry.add(DatabaseConnection, [], { type: ComponentType.SERVICE });
componentRegistry.add(DatabaseUserRepository, [DatabaseConnection], { 
  type: ComponentType.REPOSITORY 
});
componentRegistry.add(UserService, [DatabaseUserRepository], { 
  type: ComponentType.SERVICE 
});
```

### Event System

```typescript
// Listen to multiple components
const requiredServices = ['UserService', 'EmailService', 'LoggerService'];

requiredServices.forEach(serviceName => {
  componentRegistry.onComponentByName(serviceName, (component) => {
    console.log(`✅ ${serviceName} loaded:`, component.createAt);
  });
});

// Services can be registered in any order
componentRegistry.add(EmailService, []);
componentRegistry.add(LoggerService, []);
componentRegistry.add(UserService, [EmailService, LoggerService]);
```

### Conditional Configuration

```typescript
class CacheService {
  constructor(private isProduction: boolean) {}
}

const isProduction = process.env.NODE_ENV === 'production';

// Registration with specific configuration
componentRegistry.add(CacheService, [], {
  injectable: isProduction, // Only injectable in production
  type: ComponentType.SERVICE
});

// Conditional usage
if (componentRegistry.has(CacheService)) {
  const cache = componentRegistry.getByClass(CacheService);
  // Use cache only if available
}
```

<!-- ## 🛠️ Future Improvements

- 🔄 **@Lazy**: Decorator for deferred initialization
- 🎯 **@Primary**: Decorator to resolve ambiguities
- 🔧 **@Qualifier**: Decorator for specific injection
- 📦 **Scopes**: Singleton, Prototype, Request, Session
- 🎮 **Factory Methods**: Custom instance creation
- 🔍 **AOP**: Aspect-oriented programming -->

<!-- ## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a branch for your feature (`git checkout -b feature/new-functionality`)
3. Commit your changes (`git commit -am 'Add new functionality'`)
4. Push to the branch (`git push origin feature/new-functionality`)
5. Open a Pull Request -->

## 📄 License

This project is under the ISC license. See the [LICENSE](LICENSE) file for more details.

---

<div align="center">

**Developed with ❤️ by [Jose Eduardo Soria Garcia](mailto:pepesoriagarcia99@gmail.com)**

*Part of the BigByte ecosystem*

</div>
