# 🗃️ @bigbyte/ctx

<div align="center">

[![NPM Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://www.npmjs.com/package/@bigbyte/ctx)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

**Sistema de Gestión de Contexto y Almacenamiento de Valores para BigByte**
</div>

Un módulo robusto y eficiente de gestión de contexto que proporciona un almacén de valores inmutable con soporte completo para inyección de dependencias, variables de entorno y trazabilidad de configuraciones.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Instalación](#-instalación) 
- [Uso Básico](#-uso-básico)
- [API Detallada](#-api-detallada)
- [Arquitectura](#-arquitectura)
- [Ejemplos Avanzados](#-ejemplos-avanzados)
- [Licencia](#-licencia)

## ✨ Características

🏦 **Almacén de Valores Inmutable**: Los valores una vez almacenados no pueden ser modificados, garantizando la integridad de la configuración  
🔄 **Integración con Variables de Entorno**: Acceso transparente a variables del sistema operativo  
🏷️ **Identificación Única**: Cada valor almacenado tiene un UUID único para trazabilidad  
📝 **Metadatos Temporales**: Seguimiento automático de la fecha de creación de valores  
🔍 **API de Búsqueda Flexible**: Búsqueda por clave, ID o valor  
🔌 **Inyección de Dependencias**: Totalmente compatible con el sistema IoC de BigByte  
📊 **Logging Integrado**: Registro automático de operaciones y advertencias

## 🚀 Instalación

```bash
npm install @bigbyte/ctx
```

## 🔧 Uso Básico

### Importación

```typescript
import { ctxStore, ValueStore, StoreValue } from '@bigbyte/ctx';
```

### Almacenamiento de Valores

```typescript
// Agregar un valor al almacén
ctxStore.add('API_URL', 'https://api.ejemplo.com');
ctxStore.add('MAX_RETRIES', '3');
```

### Recuperación de Valores

```typescript
// Obtener un valor por clave
const apiUrl = ctxStore.getByKey('API_URL');
console.log(apiUrl?.value); // 'https://api.ejemplo.com'

// Obtener todos los valores
const allValues = ctxStore.getAllValues();
```

### Uso con Inyección de Dependencias

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

## 🔍 API Detallada

### CtxStore

El contenedor principal para el almacenamiento de valores.

#### Métodos Principales

**CtxStore**

| Método | Descripción | Parámetros | Retorno |
|--------|-------------|------------|---------|
| `add(key, value)` | Agrega un nuevo valor al almacén | `key: string, value: string \| undefined` | `void` |
| `getByKey(key)` | Obtiene un valor por su clave | `key: string` | `StoreValue \| undefined` |
| `getById(id)` | Obtiene un valor por su ID único | `id: string` | `StoreValue \| undefined` |
| `getAllStoreValues()` | Obtiene todos los valores almacenados | - | `StoreValue[]` |
| `getAllValues()` | Obtiene todos los valores como Map | - | `Map<string, string \| undefined>` |
| `hasKey(key)` | Verifica si existe una clave | `key: string` | `boolean` |
| `hasValue(value)` | Verifica si existe un valor | `value: any` | `boolean` |

### StoreValue

Modelo que representa un valor almacenado con metadatos.

#### Propiedades

```typescript
class StoreValue {
    readonly id: string;        // UUID único
    readonly key: string;       // Clave del valor
    readonly value: string | boolean | number | undefined;  // Valor almacenado
    readonly createAt: Date;    // Fecha de creación
}
```

### ValueStore

Servicio que proporciona una interfaz programática para el almacén.
Este servicio es añadido a @bigbyte/ioc para hacerlo inyectable.

#### Métodos del Servicio

```typescript
class ValueStore {
    getValue(key: string): string | undefined;
    getStoreValue(key: string): StoreValue | undefined;
    getAllValues(): Map<string, string | undefined>;
    has(key: string): boolean;
    add(key: string, value: string | undefined): void;
}
```

## 🏗️ Arquitectura

El módulo está estructurado en tres componentes principales:

### 📁 Estructura del Proyecto

```
src/
├── container/
│   └── CtxStore.ts          # Contenedor principal de valores
├── model/
│   └── StoreValue.ts        # Modelo de valor almacenado
├── service/
│   └── ValueStore.ts        # Servicio para operaciones programáticas
└── constant/
    └── index.ts             # Constantes del módulo
```


## 🔧 Ejemplos Avanzados

### Integración con Variables de Entorno

El sistema accede automáticamente a las variables de entorno del sistema operativo:

```typescript
// Si existe la variable de entorno NODE_ENV
const env = ctxStore.getByKey('NODE_ENV');
console.log(env?.value); // 'development', 'production', etc.
```

### Prevención de Duplicados

El sistema advierte e ignora keys que ya existen en los valores de entorno.

```typescript
ctxStore.add('API_URL', 'https://api1.com');
ctxStore.add('API_URL', 'https://api2.com'); 
// ⚠️ Warning: The value with key "API_URL" already exists in the ValueStore.
```

### Trazabilidad y Auditoría

Cada valor almacenado incluye metadatos de trazabilidad:

```typescript
const value = ctxStore.getByKey('CONFIG_KEY');
console.log(`ID: ${value?.id}`);           // UUID único
console.log(`Creado: ${value?.createAt}`); // Timestamp de creación
```

## 📄 Licencia

Este proyecto está bajo la licencia ISC. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**Desarrollado con ❤️ por [Jose Eduardo Soria Garcia](mailto:alarifeproyect@gmail.com)**

*Parte del ecosistema BigByte*

</div>