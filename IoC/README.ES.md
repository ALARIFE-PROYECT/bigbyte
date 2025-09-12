# 🔄️ @bigbyte/ioc - Inversión de Control

<div align="center">

[![NPM Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://www.npmjs.com/package/@bigbyte/ioc)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

**Un contenedor IoC ligero y potente para TypeScript con soporte completo para inyección de dependencias y gestión de ciclo de vida de componentes.**

</div>

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Instalación](#-instalación) 
- [Uso Básico](#-uso-básico)
- [API Detallada](#-api-detallada)
- [Arquitectura](#-arquitectura)
- [Manejo de Errores](#-manejo-de-errores)
- [Ejemplos Avanzados](#-ejemplos-avanzados)
- [Licencia](#-licencia)

## ✨ Características

- 🔄 **Inyección automática de dependencias** basada en metadatos de TypeScript
- 🏗️ **Registro de componentes** con tipado fuerte
- 🎯 **Múltiples tipos de componentes** (Service, Repository, Controller, etc.)
- 🔍 **Resolución inteligente** de dependencias circulares
- 📊 **Sistema de eventos** para componentes dinámicos
- 🛡️ **Manejo robusto de errores** con excepciones específicas
- 🎮 **API programática** flexible y extensible
- 🔧 **Configuración granular** de componentes
- 📝 **TypeScript nativo** con soporte completo de tipos

## 🚀 Instalación

```bash
npm install @bigbyte/ioc
```

## 🔧 Uso Básico

### Registro manual de componentes

```typescript
import { componentRegistry } from '@bigbyte/ioc';

class DatabaseService {
  connect() {
    console.log('Conectando a la base de datos...');
  }
}

class UserService {
  constructor(private dbService: DatabaseService) {}
  
  getUsers() {
    this.dbService.connect();
    return ['usuario1', 'usuario2'];
  }
}

// Registro manual
componentRegistry.add(DatabaseService, []);
componentRegistry.add(UserService, [DatabaseService]);

// Obtener instancia
const userService = componentRegistry.getByClass(UserService);
console.log(userService.instance.getUsers());
```

### Uso del Injector

```typescript
import { Injector, componentRegistry } from '@bigbyte/ioc';

const injector = componentRegistry.getByClass(Injector);

// Registrar componente
injector.add(UserService);

// Verificar existencia
if (injector.has(UserService)) {
  const component = injector.get(UserService);
  console.log(component?.instance);
}
```

## 🔍 API Detallada

### Component

Cada componente registrado tiene las siguientes propiedades:

```typescript
interface Component {
  readonly id: string;        // ID único generado
  readonly name: string;      // Nombre de la clase
  readonly class: any;        // Referencia a la clase
  readonly instance: any;     // Instancia del componente
  readonly options: ComponentOptions; // Configuración
  readonly createAt: Date;    // Fecha de creación
}
```

El sistema soporta diferentes tipos de componentes para organizar mejor tu arquitectura:

```typescript
import { ComponentType } from '@bigbyte/ioc';

enum ComponentType {
  MAIN = 'MAIN',           // Componente principal
  COMPONENT = 'COMPONENT', // Componente genérico
  SERVICE = 'SERVICE',     // Servicio de negocio
  REPOSITORY = 'REPOSITORY', // Acceso a datos
  CONTROLLER = 'CONTROLLER'  // Controlador web
}
```

### Configuración de componentes

```typescript
import { ComponentOptions } from '@bigbyte/ioc';

const options: ComponentOptions = {
  injectable: true,        // Si puede ser inyectado (default: true)
  type: ComponentType.SERVICE  // Tipo de componente (default: COMPONENT)
};

componentRegistry.add(UserService, [DatabaseService], options);
```

### ComponentRegistry

#### `add(Target, dependencies, options?): string`
Registra un nuevo componente en el contenedor.

```typescript
const id = componentRegistry.add(
  UserService, 
  [DatabaseService], 
  { type: ComponentType.SERVICE }
);
```

#### `getByClass(Target, strict?): Component | undefined`
Obtiene un componente por su clase.

```typescript
const component = componentRegistry.getByClass(UserService);
// Con strict=false no lanza excepción si no existe
const optional = componentRegistry.getByClass(OptionalService, false);
```

#### `getById(id): Component`
Obtiene un componente por su ID único.

```typescript
const component = componentRegistry.getById('uuid-v4');
```

#### `getByName(name): Component | undefined`
Obtiene un componente por su nombre de clase.

```typescript
const component = componentRegistry.getByName('UserService');
```

#### `has(value): boolean`
Verifica si existe un componente (por clase o ID).

```typescript
const exists = componentRegistry.has(UserService);
const existsById = componentRegistry.has('component-id');
```

#### `onComponentByName(name, callback): void`
Escucha la disponibilidad de un componente de forma asíncrona.
El callback reacciona cuando el componente es añadido.

```typescript
componentRegistry.onComponentByName('UserService', (component) => {
  console.log('UserService está disponible:', component.instance);
});
```



### Injector

Servicio de alto nivel forma parte del registry de componentes para acceder a este de forma programatica.

```typescript
const injector = componentRegistry.getByClass(Injector);

injector.add(MyService);           // Agregar componente
const component = injector.get(MyService);  // Obtener componente
const exists = injector.has(MyService);     // Verificar existencia
```

## 🏗️ Arquitectura

### Flujo de Registro

```mermaid
graph TD
    A[Clase + Dependencias] --> B[ComponentRegistry.add()]
    B --> C[Resolver Dependencias]
    C --> D[Crear Component]
    D --> E[Crear Instancia]
    E --> F[Emitir Eventos]
    F --> G[Almacenar en Registry]
```

### Estructura Interna

- **ComponentRegistry**: Gestión centralizada de componentes
- **Component**: Wrapper de instancias con metadatos
- **Injector**: API de alto nivel para uso programático
- **BufferComponent**: Sistema de eventos para componentes dinámicos


## ⚠️ Manejo de Errores

### MissingDependencyError
Se lanza cuando una dependencia requerida no se encuentra en el registro:

```typescript
try {
  componentRegistry.getByClass(NonExistentService);
} catch (error) {
  if (error instanceof MissingDependencyError) {
    console.log('Dependencia faltante:', error.message);
  }
}
```

### NonInjectableComponentError
Se lanza cuando se intenta inyectar un componente marcado como no inyectable:

```typescript
// Componente marcado como no inyectable
componentRegistry.add(UtilityClass, [], { injectable: false });

// Esto lanzará NonInjectableComponentError
componentRegistry.add(ServiceClass, [UtilityClass]);
```

### CircularDependencyError
Se detectan automáticamente las dependencias circulares:

```typescript
// Esto causará un error de dependencia circular
class ServiceA {
  constructor(serviceB: ServiceB) {}
}

class ServiceB {
  constructor(serviceA: ServiceA) {}
}
```


## 🔧 Ejemplos Avanzados

### Patrón Repository

```typescript
interface IUserRepository {
  findById(id: string): User;
  save(user: User): void;
}

class DatabaseUserRepository implements IUserRepository {
  constructor(private dbConnection: DatabaseConnection) {}
  
  findById(id: string): User {
    // Implementación con base de datos
  }
  
  save(user: User): void {
    // Implementación con base de datos
  }
}

class UserService {
  constructor(private userRepository: IUserRepository) {}
  
  getUser(id: string): User {
    return this.userRepository.findById(id);
  }
}

// Registro con tipo específico
componentRegistry.add(DatabaseConnection, [], { type: ComponentType.SERVICE });
componentRegistry.add(DatabaseUserRepository, [DatabaseConnection], { 
  type: ComponentType.REPOSITORY 
});
componentRegistry.add(UserService, [DatabaseUserRepository], { 
  type: ComponentType.SERVICE 
});
```

### Sistema de Eventos

```typescript
// Escuchar múltiples componentes
const requiredServices = ['UserService', 'EmailService', 'LoggerService'];

requiredServices.forEach(serviceName => {
  componentRegistry.onComponentByName(serviceName, (component) => {
    console.log(`✅ ${serviceName} cargado:`, component.createAt);
  });
});

// Los servicios se pueden registrar en cualquier orden
componentRegistry.add(EmailService, []);
componentRegistry.add(LoggerService, []);
componentRegistry.add(UserService, [EmailService, LoggerService]);
```

### Configuración Condicional

```typescript
class CacheService {
  constructor(private isProduction: boolean) {}
}

const isProduction = process.env.NODE_ENV === 'production';

// Registro con configuración específica
componentRegistry.add(CacheService, [], {
  injectable: isProduction, // Solo inyectable en producción
  type: ComponentType.SERVICE
});

// Uso condicional
if (componentRegistry.has(CacheService)) {
  const cache = componentRegistry.getByClass(CacheService);
  // Usar cache solo si está disponible
}
```

## 📄 Licencia

Este proyecto está bajo la licencia Apache 2.0. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**Desarrollado con ❤️ por [Jose Eduardo Soria Garcia](mailto:alarifeproyect@gmail.com)**

*Parte del ecosistema BigByte*

</div>
