# 🗃️ @bigbyte/ctx

<div align="center">

[![NPM Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://www.npmjs.com/package/@bigbyte/ctx)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

**Context Management and Value Storage System for BigByte**
</div>

A robust and efficient context management module that provides an immutable value store with full support for dependency injection, environment variables, and configuration traceability.

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation) 
- [Basic Usage](#-basic-usage)
- [Detailed API](#-detailed-api)
- [Architecture](#-architecture)
- [Advanced Examples](#-advanced-examples)
- [License](#-license)

## ✨ Features

🏦 **Immutable Value Store**: Once stored, values cannot be modified, ensuring configuration integrity  
🔄 **Environment Variables Integration**: Transparent access to operating system variables  
🏷️ **Unique Identification**: Each stored value has a unique UUID for traceability  
📝 **Temporal Metadata**: Automatic tracking of value creation dates  
🔍 **Flexible Search API**: Search by key, ID, or value  
🔌 **Dependency Injection**: Fully compatible with BigByte's IoC system  
📊 **Integrated Logging**: Automatic logging of operations and warnings

## 🚀 Installation

```bash
npm install @bigbyte/ctx
```

## 🔧 Basic Usage

### Import

```typescript
import { ctxStore, ValueStore, StoreValue } from '@bigbyte/ctx';
```

### Storing Values

```typescript
// Add a value to the store
ctxStore.add('API_URL', 'https://api.example.com');
ctxStore.add('MAX_RETRIES', '3');
```

### Retrieving Values

```typescript
// Get a value by key
const apiUrl = ctxStore.getByKey('API_URL');
console.log(apiUrl?.value); // 'https://api.example.com'

// Get all values
const allValues = ctxStore.getAllValues();
```

### Usage with Dependency Injection

```typescript
import { Inject, componentRegistry } from '@bigbyte/ioc';
import { ValueStore } from '@bigbyte/ctx';

const inject = componentRegistry.getByClass(Inject);

class ApiService {
    private valueStore?: ValueStore = inject.get(ValueStore);

    constructor() {}

    getApiUrl(): string {
        return this.valueStore.getValue('API_URL') || 'default-url';
    }
}
```

## 🔍 Detailed API

### CtxStore

The main container for value storage.

#### Main Methods

**CtxStore**

| Method | Description | Parameters | Return |
|--------|-------------|------------|--------|
| `add(key, value)` | Adds a new value to the store | `key: string, value: string \| undefined` | `void` |
| `getByKey(key)` | Gets a value by its key | `key: string` | `StoreValue \| undefined` |
| `getById(id)` | Gets a value by its unique ID | `id: string` | `StoreValue \| undefined` |
| `getAllStoreValues()` | Gets all stored values | - | `StoreValue[]` |
| `getAllValues()` | Gets all values as Map | - | `Map<string, string \| undefined>` |
| `hasKey(key)` | Checks if a key exists | `key: string` | `boolean` |
| `hasValue(value)` | Checks if a value exists | `value: any` | `boolean` |

### StoreValue

Model representing a stored value with metadata.

#### Properties

```typescript
class StoreValue {
    readonly id: string;        // Unique UUID
    readonly key: string;       // Value key
    readonly value: string | boolean | number | undefined;  // Stored value
    readonly createAt: Date;    // Creation date
}
```

### ValueStore

Service that provides a programmatic interface to the store.
This service is added to @bigbyte/ioc to make it injectable.

#### Service Methods

```typescript
class ValueStore {
    getValue(key: string): string | undefined;
    getStoreValue(key: string): StoreValue | undefined;
    getAllValues(): Map<string, string | undefined>;
    has(key: string): boolean;
    add(key: string, value: string | undefined): void;
}
```

## 🏗️ Architecture

The module is structured into three main components:

### 📁 Project Structure

```
src/
├── container/
│   └── CtxStore.ts          # Main value container
├── model/
│   └── StoreValue.ts        # Stored value model
├── service/
│   └── ValueStore.ts        # Service for programmatic operations
└── constant/
    └── index.ts             # Module constants
```


## 🔧 Advanced Examples

### Environment Variables Integration

The system automatically accesses operating system environment variables:

```typescript
// If the NODE_ENV environment variable exists
const env = ctxStore.getByKey('NODE_ENV');
console.log(env?.value); // 'development', 'production', etc.
```

### Duplicate Prevention

The system warns and ignores keys that already exist in environment values.

```typescript
ctxStore.add('API_URL', 'https://api1.com');
ctxStore.add('API_URL', 'https://api2.com'); 
// ⚠️ Warning: The value with key "API_URL" already exists in the ValueStore.
```

### Traceability and Auditing

Each stored value includes traceability metadata:

```typescript
const value = ctxStore.getByKey('CONFIG_KEY');
console.log(`ID: ${value?.id}`);           // Unique UUID
console.log(`Created: ${value?.createAt}`); // Creation timestamp
```

## 📄 License

This project is under the Apache 2.0 license. See the [LICENSE](LICENSE) file for more details.

---

<div align="center">

**Developed with ❤️ by [Jose Eduardo Soria Garcia](mailto:alarifeproyect@gmail.com)**

*Part of the BigByte ecosystem*

</div>
