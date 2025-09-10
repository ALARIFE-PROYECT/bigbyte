# 🛠️ @bigbyte/utils - BigByte Ecosystem Utilities

<div align="center">

[![NPM Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://www.npmjs.com/package/@bigbyte/utils)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

**Comprehensive set of utilities, services and common tools used by all BigByte ecosystem libraries**

</div>

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation) 
- [Basic Usage](#-basic-usage)
- [Detailed API](#-detailed-api)
- [Architecture](#-architecture)
- [Error Handling](#-error-handling)
- [Advanced Examples](#-advanced-examples)
- [License](#-license)

## ✨ Features

* **📝 Advanced Logging System**: Colorized logger with support for multiple levels and trace files
* **🔧 Arguments Management**: Service for handling command line arguments
* **🌍 Environment Variables**: Centralized service for environment variables management
* **🎯 Decorator Utilities**: Tools for validation and metadata management of decorators
* **⚠️ Common Exceptions**: Complete set of ecosystem-specific exceptions
* **🔄 Event Utilities**: Event system for decorators with metadata
* **📁 File Utilities**: Tools for file and directory manipulation
* **🧰 Global Constants**: Centralized ecosystem constants definitions

## 🚀 Installation

```bash
npm install @bigbyte/utils
```

## 🔧 Basic Usage

### Logging System

```typescript
import { Logger } from '@bigbyte/utils/logger';

const logger = new Logger('MyApp');

logger.info('Application started');
logger.debug('Debug information');
logger.warn('Important warning');
logger.error('Critical error');
logger.dev('Log only in bigbyte library development');
```

### Arguments Management

```typescript
import { argumentsService } from '@bigbyte/utils/argument';

// Check if argument exists
if (argumentsService.has('--debug')) {
  console.log('Debug mode activated');
}

// Get argument value
const port = argumentsService.getValue('--port');
console.log(`Port: ${port}`);
```

### Environment Variables

Previously injected by the @bigbyte/cli library

```typescript
import { environmentService } from '@bigbyte/utils/environment';

// Get environment variable
const nodeEnv = environmentService.get('NODE_ENV');

// Check existence
if (environmentService.has('DATABASE_URL')) {
  const dbUrl = environmentService.get('DATABASE_URL');
}

// Get all keys
const envKeys = environmentService.keys();
```

### Ecosystem Constants

```typescript
import { 
  LIBRARY_ORGANIZATION_NAME, 
  ROOT_PATH,
  DEVELOPMENT,
  PRODUCTION 
} from '@bigbyte/utils/constant';

console.log(`Organization: ${LIBRARY_ORGANIZATION_NAME}`);
console.log(`Root directory: ${ROOT_PATH}`);
```

## 🔍 Detailed API

### **Logger**
Advanced logging system with multiple levels and configuration options.

```typescript
interface LoggerOptions {
  header?: boolean;    // Show header with [type] [timestamp] [origin?]
  banner?: boolean;    // Banner mode: no format and no header
}

class Logger {
  constructor(origin?: string)
  
  info(...message: any[]): void
  debug(...message: any[]): void    // Only with --debug
  warn(...message: any[]): void
  error(...message: any[]): void
  dev(...message: any[]): void      // Only in package development mode
  
  setOptions(options: LoggerOptions): void
}
```

### **ArgumentsService**
Service for command line arguments management.

```typescript
interface ArgumentsService {
  get(key: string): string | undefined        // Get complete argument
  getValue(key: string): string | undefined   // Get only the value
  has(key: string): boolean                   // Check existence
}
```

### **EnvironmentService**
Service for environment variables management.

```typescript
interface EnvironmentService {
  get(key: string): string | undefined
  has(key: string): boolean
  keys(): Array<string>
  values(): Array<string | undefined>
}
```

### **Decorator Utilities**
Tools for decorator validation and management.

```typescript
// Get list of applied decorators
getDecorators(metadataKeys: Array<string>): Array<string>

// Check if it's the first decorator
checkFirstDecorator(Target: Function): void

// Check existence of specific decorator
checkDecoratorExists(Target: Function, decoratorName: string): boolean

// Validate decorator uniqueness
checkUniqueDecorator(Target: Function): void
```

## 🏗️ Architecture

The module is structured into five main components:

### 📁 Project Structure

```
src/
├── constant/
│   ├── index.ts             # General ecosystem constants
│   └── development.ts       # Configuration for development traces
├── service/
│   ├── Logger.ts            # Advanced logging system
│   ├── ArgumentService.ts   # CLI arguments management
│   └── EnvironmentService.ts # Environment variables management
├── exception/
│   ├── ConfigurationError.ts # Configuration error
│   ├── FormatError.ts       # Format error
│   ├── MissingFileError.ts  # Missing file error
│   ├── NotSupportedError.ts # Unsupported feature error
│   └── decorator/           # Decorator-specific exceptions
│       ├── DecoratorError.ts # Generic decorator error
│       └── OrderDecoratorsError.ts # Decorator order error
└── util/
    ├── decorator.ts         # Decorator utilities
    └── index.ts            # Utility exports
```

### 🔄 Modular Exports

The package uses a modular export system that allows importing only the necessary functionalities:

- `/constant` - Ecosystem constants
- `/logger` - Logging system
- `/argument` - Arguments management
- `/environment` - Environment variables
- `/exception` - Exception system
- `/utilities` - General utilities

## ⚠️ Error Handling

### **ConfigurationError**
Specific error for configuration issues.

```typescript
class ConfigurationError extends Error {
  key: string;
  constructor(key: string, description: string)
}
```

### **DecoratorError**
Error related to incorrect decorator usage.

```typescript
class DecoratorError extends Error {
  constructor(description: string)
}
```

### **OrderDecoratorsError**
Specific error for decorator order issues.

```typescript
class OrderDecoratorsError extends Error {
  decorators: Array<string>;
  constructor(decorators: Array<string>)
}
```

### **FormatError**
Error for data format issues.

```typescript
class FormatError extends Error {
  constructor(description: string)
}
```

### **MissingFileError**
Error when a required file doesn't exist.

```typescript
class MissingFileError extends Error {
  constructor(filePath: string)
}
```

### **NotSupportedError**
Error for unsupported features.

```typescript
class NotSupportedError extends Error {
  constructor(feature: string)
}
```

## 🔧 Advanced Examples

### Logger with Custom Configuration

```typescript
import { Logger } from '@bigbyte/utils/logger';

// Logger with trace file
// Configure via environment variable: TRACE_LOG_FILE=/path/to/logs
// Or argument: --trace-log-file=/path/to/logs

const logger = new Logger('MyService');

// Configure options
logger.setOptions({
  header: true,   // Include timestamp and origin
  banner: false   // Normal format (not banner)
});

// Use different levels
logger.info('Service started successfully');
logger.debug('Configuration loaded:', { port: 3000, env: 'development' });
logger.warn('Default port used');
logger.error('Error connecting to database');

// Development log (only visible with DEV_MODE=true)
logger.dev('Internal service state:', { connections: 5 });
```

### Advanced Decorator Validation

```typescript
import { 
  checkFirstDecorator, 
  checkUniqueDecorator,
  checkDecoratorExists 
} from '@bigbyte/utils/utilities';

// Decorator that must be unique
function Controller(path: string): ClassDecorator {
  return (target: Function) => {
    // Check that there are no other controller decorators
    checkUniqueDecorator(target);
    
    // Check that it's the first applied decorator
    checkFirstDecorator(target);
    
    // Apply metadata
    Reflect.defineMetadata('controller:path', path, target);
  };
}

// Decorator that requires a parent decorator
function Route(method: string, path: string): ClassDecorator {
  return (target: Function) => {
    // Check that Controller decorator already exists
    if (!checkDecoratorExists(target, 'Controller')) {
      throw new Error('Route decorator requires Controller decorator');
    }
    
    Reflect.defineMetadata('route:config', { method, path }, target);
  };
}
```

## 📄 License

This project is under the ISC license. See the [LICENSE](LICENSE) file for more details.

---

<div align="center">

**Developed with ❤️ by [Jose Eduardo Soria Garcia](mailto:alarifeproyect@gmail.com)**

*Part of the BigByte ecosystem*

</div>