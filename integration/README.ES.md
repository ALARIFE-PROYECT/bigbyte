# 🔗 @bigbyte/integration - Modelos de Integración para BigByte

<div align="center">

[![NPM Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://www.npmjs.com/package/@bigbyte/integration)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

**Modelos y tipos TypeScript esenciales para la configuración e integración de librerías del ecosistema BigByte**

</div>

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Instalación](#-instalación) 
- [Uso Básico](#-uso-básico)
- [API Detallada](#-api-detallada)
- [Arquitectura](#-arquitectura)
- [Licencia](#-licencia)

## ✨ Características

* **Modelos de Configuración**: Interfaces TypeScript para configurar la integración entre addons
* **Definición de Comandos**: Tipos para declarar nuevos comandos y acciones en el CLI
* **Sistema de Flags**: Modelos para definir flags con tipos (switch, value, file) y valores por defecto
* **Gestión de Addons**: Interfaces para registrar y configurar addons externos
* **Manejo de Entornos**: Tipos para inyección de variables de entorno
* **Sistema de Ayuda**: Modelos base para documentación y help de comandos
* **Compatibilidad entre Librerías**: Tipos compartidos para garantizar interoperabilidad
* **Validación de Dependencias**: Modelos para declarar y validar dependencias entre componentes

## 🚀 Instalación

```bash
npm install @bigbyte/integration
```

## 🔧 Uso Básico

### Definir una Configuración de Addon

```typescript
import { Configuration, Command, Flag, FlagType } from '@bigbyte/integration';

const miConfiguracion: Configuration = {
  newCommands: [
    {
      name: 'mi-comando',
      path: './commands/mi-comando.js',
      requiresMainFile: true,
      injectEnvironment: true,
      flags: [
        {
          name: '--verbose',
          type: FlagType.switch,
          env: 'VERBOSE',
          defaultValue: false,
          help: 'Activar modo verbose',
          description: 'Muestra información detallada durante la ejecución'
        }
      ],
      help: 'Mi comando personalizado',
      description: 'Ejecuta una acción personalizada con opciones avanzadas'
    }
  ]
};
```

## 🔍 API Detallada

### Configuration
Interface principal para configurar la integración de addons:
- `newCommands?: Command[]` - Declaración de nuevos comandos
- `commandDeclaration?: Command[]` - Declaración de comandos para añadirle nuevos flags

### Command
Tipo para definir comandos y acciones:
- `name: string` - Nombre del comando o acción
- `path?: string` - Ruta del comando a ejecutar el archivo deber exportar por defecto una función que recibe por parametros el tipo CommandData
- `flags?: FlagOptions` - Flags que aplican al comando
- `requiresMainFile?: boolean` - Si requiere archivo principal, un archivo .ts objetivo
- `injectEnvironment?: boolean` - Si inyectar variables de entorno
- `environment?: Environment` - Configuraciones sobre las variables de entorno

### Environment
- `DEFAULT_VALUES: [key: string]: string | undefined` - Valores de environment por defecto

### Flag
Interface para definir flags de comandos:
- `name: string` - Nombre del flag (ej: "--doctor")
- `type: FlagType` - Tipo: switch, value, o file
- `env?: string` - Key variable de entorno donde replicar el valor
- `defaultValue?: any` - Valor por defecto
- `help: string` - Texto de ayuda
- `description: string` - Texto de ayuda detallado

### FlagType
Enum con los tipos de flags disponibles:
- `switch` - Flag de activación/desactivación. Valor **true** o **false**
- `value` - Flag que requiere un valor
- `file` - Flag que requiere una ruta de archivo

### Addon
Interface para registrar addons:
- `name: string` - Nombre del addon
- `version: string` - Versión del addon
- `path: string` - Ruta del addon
- `configuration?: Configuration` - Configuración del addon

## 🏗️ Arquitectura

El módulo está estructurado en componentes especializados:

### 📁 Estructura del Proyecto

```
src/
├── model/
│   ├── Addon.ts              # Modelo de addon
│   ├── Command.ts            # Definición de comandos
│   ├── CommandData.ts        # Datos de comandos
│   ├── Configuration.ts      # Configuración de integración
│   ├── Dependency.ts         # Gestión de dependencias
│   ├── Environment.ts        # Variables de entorno
│   ├── Flag.ts              # Sistema de flags
│   ├── Help.ts              # Sistema de ayuda
│   └── MainFile.ts          # Archivos principales
└── constant/
    └── index.ts             # Constantes del módulo
```

### 🔄 Flujo de Integración

1. **Registro de Addons**: Los addons se registran usando la interface `Addon`
2. **Configuración**: Cada addon define su `Configuration` con comandos y flags
3. **Resolución de Comandos**: El sistema resuelve comandos según las configuraciones
4. **Inyección de Entornos**: Se inyectan variables de entorno según la configuración
5. **Ejecución**: Los comandos se ejecutan con los flags y entornos apropiados

## 📄 Licencia

Este proyecto está bajo la licencia ISC. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**Desarrollado con ❤️ por [Jose Eduardo Soria Garcia](mailto:alarifeproyect@gmail.com)**

*Parte del ecosistema BigByte*

</div>
