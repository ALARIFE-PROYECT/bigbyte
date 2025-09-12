# 🛠️ @bigbyte/utils - Utilidades del Ecosistema BigByte

<div align="center">

[![NPM Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://www.npmjs.com/package/@bigbyte/utils)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

**Conjunto integral de utilidades, servicios y herramientas comunes utilizadas por todas las librerías del ecosistema BigByte**

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

* **📝 Sistema de Logging Avanzado**: Logger colorizado con soporte para múltiples niveles y archivos de trazas
* **🔧 Gestión de Argumentos**: Servicio para manejo de argumentos de línea de comandos
* **🌍 Variables de Entorno**: Servicio centralizado para gestión de variables de entorno
* **🎯 Utilidades de Decoradores**: Herramientas para validación y gestión de metadatos de decoradores
* **⚠️ Excepciones Comunes**: Conjunto completo de excepciones específicas del ecosistema
* **🔄 Utilidades de Eventos**: Sistema de eventos para decoradores con metadatos
* **📁 Utilidades de Archivos**: Herramientas para manipulación de archivos y directorios
* **🧰 Constantes Globales**: Definiciones centralizadas de constantes del ecosistema

## 🚀 Instalación

```bash
npm install @bigbyte/utils
```

## 🔧 Uso Básico

### Sistema de Logging

```typescript
import { Logger } from '@bigbyte/utils/logger';

const logger = new Logger('MiApp');

logger.info('Aplicación iniciada');
logger.debug('Información de depuración');
logger.warn('Advertencia importante');
logger.error('Error crítico');
logger.dev('Log solo en desarrollo de libreria bigbyte');
```

### Gestión de Argumentos

```typescript
import { argumentsService } from '@bigbyte/utils/argument';

// Verificar si existe un argumento
if (argumentsService.has('--debug')) {
  console.log('Modo debug activado');
}

// Obtener valor de argumento
const port = argumentsService.getValue('--port');
console.log(`Puerto: ${port}`);
```

### Variables de Entorno

Previamente inyectadas por la libreria @bigbyte/cli

```typescript
import { environmentService } from '@bigbyte/utils/environment';

// Obtener variable de entorno
const nodeEnv = environmentService.get('NODE_ENV');

// Verificar existencia
if (environmentService.has('DATABASE_URL')) {
  const dbUrl = environmentService.get('DATABASE_URL');
}

// Obtener todas las claves
const envKeys = environmentService.keys();
```

### Constantes del Ecosistema

```typescript
import { 
  LIBRARY_ORGANIZATION_NAME, 
  ROOT_PATH,
  DEVELOPMENT,
  PRODUCTION 
} from '@bigbyte/utils/constant';

console.log(`Organización: ${LIBRARY_ORGANIZATION_NAME}`);
console.log(`Directorio raíz: ${ROOT_PATH}`);
```

## 🔍 API Detallada

### **Logger**
Sistema de logging avanzado con múltiples niveles y opciones de configuración.

```typescript
interface LoggerOptions {
  header?: boolean;    // Mostrar cabecera con [type] [timestamp] [origin?]
  banner?: boolean;    // Modo banner: sin formato y sin cabecera
}

class Logger {
  constructor(origin?: string)
  
  info(...message: any[]): void
  debug(...message: any[]): void    // Solo con --debug
  warn(...message: any[]): void
  error(...message: any[]): void
  dev(...message: any[]): void      // Solo en modo desarrollo de paquetes
  
  setOptions(options: LoggerOptions): void
}
```

### **ArgumentsService**
Servicio para gestión de argumentos de línea de comandos.

```typescript
interface ArgumentsService {
  get(key: string): string | undefined        // Obtener argumento completo
  getValue(key: string): string | undefined   // Obtener solo el valor
  has(key: string): boolean                   // Verificar existencia
}
```

### **EnvironmentService**
Servicio para gestión de variables de entorno.

```typescript
interface EnvironmentService {
  get(key: string): string | undefined
  has(key: string): boolean
  keys(): Array<string>
  values(): Array<string | undefined>
}
```

### **Utilidades de Decoradores**
Herramientas para validación y gestión de decoradores.

```typescript
// Obtener lista de decoradores aplicados
getDecorators(metadataKeys: Array<string>): Array<string>

// Verificar si es el primer decorador
checkFirstDecorator(Target: Function): void

// Verificar existencia de decorador específico
checkDecoratorExists(Target: Function, decoratorName: string): boolean

// Validar unicidad de decorador
checkUniqueDecorator(Target: Function): void
```

## 🏗️ Arquitectura

El módulo está estructurado en cinco componentes principales:

### 📁 Estructura del Proyecto

```
src/
├── constant/
│   ├── index.ts             # Constantes generales del ecosistema
│   └── development.ts       # Configuración para trazas de desarrollo
├── service/
│   ├── Logger.ts            # Sistema de logging avanzado
│   ├── ArgumentService.ts   # Gestión de argumentos CLI
│   └── EnvironmentService.ts # Gestión de variables de entorno
├── exception/
│   ├── ConfigurationError.ts # Error de configuración
│   ├── FormatError.ts       # Error de formato
│   ├── MissingFileError.ts  # Error de archivo faltante
│   ├── NotSupportedError.ts # Error de característica no soportada
│   └── decorator/           # Excepciones específicas de decoradores
│       ├── DecoratorError.ts # Error generico de decorador
│       └── OrderDecoratorsError.ts # Error en orden de decoradores
└── util/
    ├── decorator.ts         # Utilidades para decoradores
    └── index.ts            # Exportaciones de utilidades
```

### 🔄 Exportaciones Modulares

El paquete utiliza un sistema de exportaciones modulares que permite importar solo las funcionalidades necesarias:

- `/constant` - Constantes del ecosistema
- `/logger` - Sistema de logging
- `/argument` - Gestión de argumentos
- `/environment` - Variables de entorno
- `/exception` - Sistema de excepciones
- `/utilities` - Utilidades generales

## ⚠️ Manejo de Errores

### **ConfigurationError**
Error específico para problemas de configuración.

```typescript
class ConfigurationError extends Error {
  key: string;
  constructor(key: string, description: string)
}
```

### **DecoratorError**
Error relacionado con el uso incorrecto de decoradores.

```typescript
class DecoratorError extends Error {
  constructor(description: string)
}
```

### **OrderDecoratorsError**
Error específico para problemas de orden en decoradores.

```typescript
class OrderDecoratorsError extends Error {
  decorators: Array<string>;
  constructor(decorators: Array<string>)
}
```

### **FormatError**
Error para problemas de formato de datos.

```typescript
class FormatError extends Error {
  constructor(description: string)
}
```

### **MissingFileError**
Error cuando un archivo requerido no existe.

```typescript
class MissingFileError extends Error {
  constructor(filePath: string)
}
```

### **NotSupportedError**
Error para características no soportadas.

```typescript
class NotSupportedError extends Error {
  constructor(feature: string)
}
```

## 🔧 Ejemplos Avanzados

### Logger con Configuración Personalizada

```typescript
import { Logger } from '@bigbyte/utils/logger';

// Logger con archivo de trazas
// Configurar mediante variable de entorno: TRACE_LOG_FILE=/path/to/logs
// O argumento: --trace-log-file=/path/to/logs

const logger = new Logger('MiServicio');

// Configurar opciones
logger.setOptions({
  header: true,   // Incluir timestamp y origen
  banner: false   // Formato normal (no banner)
});

// Usar diferentes niveles
logger.info('Servicio iniciado correctamente');
logger.debug('Configuración cargada:', { port: 3000, env: 'development' });
logger.warn('Puerto por defecto utilizado');
logger.error('Error conectando a la base de datos');

// Log de desarrollo (solo visible con DEV_MODE=true)
logger.dev('Estado interno del servicio:', { connections: 5 });
```

### Validación Avanzada de Decoradores

```typescript
import { 
  checkFirstDecorator, 
  checkUniqueDecorator,
  checkDecoratorExists 
} from '@bigbyte/utils/utilities';

// Decorador que debe ser único
function Controller(path: string): ClassDecorator {
  return (target: Function) => {
    // Verificar que no hay otros decoradores de controlador
    checkUniqueDecorator(target);
    
    // Verificar que es el primer decorador aplicado
    checkFirstDecorator(target);
    
    // Aplicar metadatos
    Reflect.defineMetadata('controller:path', path, target);
  };
}

// Decorador que requiere un decorador padre
function Route(method: string, path: string): ClassDecorator {
  return (target: Function) => {
    // Verificar que ya existe el decorador Controller
    if (!checkDecoratorExists(target, 'Controller')) {
      throw new Error('Route decorator requires Controller decorator');
    }
    
    Reflect.defineMetadata('route:config', { method, path }, target);
  };
}
```

## 📄 Licencia

Este proyecto está bajo la licencia Apache 2.0. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**Desarrollado con ❤️ por [Jose Eduardo Soria Garcia](mailto:alarifeproyect@gmail.com)**

*Parte del ecosistema BigByte*

</div>
