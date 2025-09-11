


# 🎯 @bigbyte/events - Sistema de Gestión de Eventos para Decoradores

<div align="center">

[![NPM Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://www.npmjs.com/package/@bigbyte/events) [![License](https://img.shields.io/badge/license-ISC-green.svg)](LICENSE) [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

**Sistema avanzado de eventos para gestión y monitoreo de la ejecución de decoradores TypeScript**
La ejecucion de decoradores se hace de **arriba a abajo** si hablamos del mismo elemento y el orden de ejecucion de los elementos es **parametros, metodos/accessors/propiedades y por ultimo clases**.
Esta libreria con un control de eventos, te da la opción de que tu logica no dependa del orden de ejecución y puedas crear eventos cuando tu logica de decorador lo necesite.

</div>

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Instalación](#-instalación)
- [Uso Básico](#-uso-básico)
- [API Detallada](#-api-detallada)
- [Arquitectura](#-arquitectura)
- [Ejemplos Avanzados](#-ejemplos-avanzados)
- [Licencia](#-licencia)

## ✨ Características

- **🔄 Gestión de Secuencias**: Control de orden de ejecución de decoradores con eventos de inicio y final
- **📡 EventEmitter Nativo**: Basado en el EventEmitter de Node.js para máximo rendimiento
- **🎯 Eventos Específicos**: Sistema de eventos granular para cada decorador individual
- **🔍 Monitoreo Avanzado**: Seguimiento completo del ciclo de vida de decoradores
- **🧹 Auto-limpieza**: Gestión automática de memoria con limpieza de listeners
- **⚡ Alto Rendimiento**: Diseñado para aplicaciones con uso intensivo de decoradores
- **🛡️ Manejo de Errores**: Sistema robusto de excepciones específicas para decoradores

## 🚀 Instalación

```bash
npm install @bigbyte/events
```

## 🔧 Uso Básico

### Integración con Decoradores TypeScript

```typescript
import { declareDecorator, executeDecorator, decoratorExecEvent } from '@bigbyte/events';

// decorador de clase
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
      console.log('Se ejecuta cuando se ejecuta el ultimo decorador');
    });

    executeDecorator('MyDecoratorLast');
  };
};

@MyDecorator()
@MyDecoratorLast()
class MyClass {}
```

## 🔍 API Detallada

### `decoratorExecEvent: EventEmitter`

EventEmitter principal que gestiona todos los eventos de decoradores.

**Eventos disponibles:**

- `'first'` - Emitido cuando se ejecuta el primer decorador de la secuencia
- `'last'` - Emitido cuando se ejecuta el último decorador de la secuencia
- `'instantiated'` - Evento reservado para instanciación
- `[decoratorName]` - Evento específico para cada decorador

### `declareDecorator(name: string): void`

Declara un decorador en la secuencia de ejecución.

**Parámetros:**

- `name` - Nombre único del decorador

**Ejemplo:**

```typescript
declareDecorator('AuthGuard');
declareDecorator('ValidationPipe');
```

### `executeDecorator(name: string): void`

Ejecuta un decorador y emite los eventos correspondientes.

**Parámetros:**

- `name` - Nombre del decorador a ejecutar

**Comportamiento:**

- Emite evento específico del decorador
- Emite `'first'` si es el último en la secuencia declarada
- Emite `'last'` si es el primero en la secuencia declarada
- Auto-limpia listeners y reinicia secuencia al completarse

### `EventType`

Tipo TypeScript que define los eventos disponibles.

```typescript
type EventType = 'first' | 'last' | 'instantiated' | string;
```

## 🏗️ Arquitectura

El módulo está estructurado en tres componentes principales:

### 📁 Estructura del Proyecto

```
src/
├── service/
│   └── DecoratorEvent.ts    # Sistema principal de eventos para decoradores
└── index.ts                 # Punto de entrada principal
```

### 🔄 Flujo de Ejecución

1. **Declaración**: Los decoradores se registran usando `declareDecorator()`
2. **Secuenciación**: Se construye internamente un array de secuencia de ejecución
3. **Ejecución**: `executeDecorator()` procesa cada decorador en orden inverso
4. **Eventos**: Se emiten eventos específicos y de ciclo de vida
5. **Limpieza**: Auto-limpieza cuando se completa la secuencia

## 🔧 Ejemplos Avanzados

### Evento personalizado

El evento **instantiated** forma parte de la definicion de eventos, pero puedes emitir y observar eventos, siempre dentro del flujo de ejecucion/declaracion de decoradores.

```typescript
import { declareDecorator, executeDecorator, decoratorExecEvent } from '@bigbyte/events';

export const Server = (): ClassDecorator => {
  declareDecorator('Server');

  return (Target: Function): void => {
    // Por el orden de ejecucion de los decoradores, la observacion es previa a la emision
    decoratorExecEvent.on('instantiated', (instance) => {
        console.log('Valor del objetivo: 'instance.value)
    });

    executeDecorator('Server');
  };
};

export const App = (): ClassDecorator => {
  declareDecorator('App');

  return (Target: Function): void => {
    // evento lanzado al ejecutar el ultimo decorador
    decoratorExecEvent.on('last', () => {
      const instance = new Target();

      // despues de ejecutar el ultimo decorador instancio la clase y emito la instancia
      decoratorExecEvent.emit('instantiated', instance);
    });

    executeDecorator('App');
  };
};

// Uso
@Server()
@App()
class Main {
    name: string = 'Main';

  ...
}
```

### Sistema de Hooks con Eventos

```typescript

```

## 📄 Licencia

Este proyecto está bajo la licencia ISC. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**Desarrollado con ❤️ por [Jose Eduardo Soria Garcia](mailto:alarifeproyect@gmail.com)**

_Parte del ecosistema BigByte_

</div>
