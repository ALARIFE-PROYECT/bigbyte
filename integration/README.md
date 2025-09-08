# 🔗 @bigbyte/integration - Integration Models for BigByte

<div align="center">

[![NPM Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://www.npmjs.com/package/@bigbyte/integration)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

**Essential TypeScript models and types for configuration and integration of BigByte ecosystem libraries**

</div>

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation) 
- [Basic Usage](#-basic-usage)
- [Detailed API](#-detailed-api)
- [Architecture](#-architecture)
- [License](#-license)

## ✨ Features

* **Configuration Models**: TypeScript interfaces to configure integration between addons
* **Command Definition**: Types to declare new commands and actions in the CLI
* **Flag System**: Models to define flags with types (switch, value, file) and default values
* **Addon Management**: Interfaces to register and configure external addons
* **Environment Handling**: Types for environment variable injection
* **Help System**: Base models for command documentation and help
* **Library Compatibility**: Shared types to ensure interoperability
* **Dependency Validation**: Models to declare and validate dependencies between components

## 🚀 Installation

```bash
npm install @bigbyte/integration
```

## 🔧 Basic Usage

### Define an Addon Configuration

```typescript
import { Configuration, Command, Flag, FlagType } from '@bigbyte/integration';

const myConfiguration: Configuration = {
  newCommands: [
    {
      name: 'my-command',
      path: './commands/my-command.js',
      requiresMainFile: true,
      injectEnvironment: true,
      flags: [
        {
          name: '--verbose',
          type: FlagType.switch,
          env: 'VERBOSE',
          defaultValue: false,
          help: 'Enable verbose mode',
          description: 'Shows detailed information during execution'
        }
      ],
      help: 'My custom command',
      description: 'Executes a custom action with advanced options'
    }
  ]
};
```

## 🔍 Detailed API

### Configuration
Main interface to configure addon integration:
- `newCommands?: Command[]` - Declaration of new commands
- `commandDeclaration?: Command[]` - Declaration of commands to add new flags

### Command
Type to define commands and actions:
- `name: string` - Name of the command or action
- `path?: string` - Path of the command to execute, the file must export by default a function that receives CommandData type as parameters
- `flags?: FlagOptions` - Flags that apply to the command
- `requiresMainFile?: boolean` - If it requires a main file, a target .ts file
- `injectEnvironment?: boolean` - If environment variables should be injected
- `environment?: Environment` - Configuration about environment variables

### Environment
- `DEFAULT_VALUES: [key: string]: string | undefined` - Default environment values

### Flag
Interface to define command flags:
- `name: string` - Flag name (e.g.: "--doctor")
- `type: FlagType` - Type: switch, value, or file
- `env?: string` - Environment variable key where to replicate the value
- `defaultValue?: any` - Default value
- `help: string` - Help text
- `description: string` - Detailed help text

### FlagType
Enum with available flag types:
- `switch` - Activation/deactivation flag. Value **true** or **false**
- `value` - Flag that requires a value
- `file` - Flag that requires a file path

### Addon
Interface to register addons:
- `name: string` - Addon name
- `version: string` - Addon version
- `path: string` - Addon path
- `configuration?: Configuration` - Addon configuration

## 🏗️ Architecture

The module is structured in specialized components:

### 📁 Project Structure

```
src/
├── model/
│   ├── Addon.ts              # Addon model
│   ├── Command.ts            # Command definition
│   ├── CommandData.ts        # Command data
│   ├── Configuration.ts      # Integration configuration
│   ├── Dependency.ts         # Dependency management
│   ├── Environment.ts        # Environment variables
│   ├── Flag.ts              # Flag system
│   ├── Help.ts              # Help system
│   └── MainFile.ts          # Main files
└── constant/
    └── index.ts             # Module constants
```

### 🔄 Integration Flow

1. **Addon Registration**: Addons are registered using the `Addon` interface
2. **Configuration**: Each addon defines its `Configuration` with commands and flags
3. **Command Resolution**: The system resolves commands according to configurations
4. **Environment Injection**: Environment variables are injected according to configuration
5. **Execution**: Commands are executed with appropriate flags and environments

## 📄 License

This project is under the ISC license. See the [LICENSE](LICENSE) file for more details.

---

<div align="center">

**Developed with ❤️ by [Jose Eduardo Soria Garcia](mailto:pepesoriagarcia99@gmail.com)**

*Part of the BigByte ecosystem*

</div>
