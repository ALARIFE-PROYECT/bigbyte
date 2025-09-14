# 🔄️ @bigbyte/cli - BigByte Command Line Interface

<div align="center">

[![NPM Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://www.npmjs.com/package/@bigbyte/cli)
[![License](https://img.shields.io/badge/license-Apache_2.0-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

**Modular CLI to run, analyze, diagnose and package TypeScript applications inside the BigByte ecosystem.**

</div>

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Commands](#-commands)
- [Basic Usage](#-basic-usage)
- [Detailed API](#-detailed-api)
- [Advanced Examples](#-advanced-examples)
- [License](#-license)

## ✨ Features

- Typed execution of TypeScript applications (`run`)
- Automatic pre-compilation (leverages `tsc` + project configuration)
- Controlled environment injection with defaults (`NODE_ENV=development`)
- Watch mode with incremental reload (`--watch`)
- Live diagnostic doctor mode (`--doctor`)
- Dynamic informational banner with app metadata (`--banner`)
- Debug mode with extended logging (`--debug`)
- Custom `.env` file loading (`--env=<path>`)
- Structural code analysis and classpath model generation (`scan`)
- Packaging with optional minification (`package --minify`)
- Version flags (`--version`, `-v`) and contextual help (`help`)
- Integration with other BigByte libraries: `@bigbyte/utils`, `@bigbyte/integration`, `@bigbyte/classpath`
- Extensible architecture driven by declarative command configuration

## 🚀 Installation

```bash
npm install @bigbyte/cli --save-dev
```

Executable available as `bbyte` binary.

## 🖥️ Commands

Below is the set of commands and flags discovered from the internal configuration (`src/integration/configuration.ts`).

### run
Executes the main application by compiling and launching the provided entrypoint.

Flags:
- `--doctor` Enables diagnostic mode (env: `DOCTOR_MODE`).
- `--watch` Enables change detection (env: `WATCH_MODE`).
- `--debug` Enables debug mode (env: `DEBUG_MODE`).
- `--env=<file>` Sets an alternative environment file.
- `--banner` Enables (default) banner output (env: `BANNER`).

### package
Generates a distributable package of the application.

Flags:
- `--minify` Enables output minification.

### scan
Analyzes TypeScript structure and generates a structural model (classes, interfaces, enums, types, functions). No additional flags.

### help
Shows contextual help. Supports granular queries: `help`, `help run`, `help run --watch`, `help --doctor`.

### --version / -v
Prints the current CLI version.

## 🔧 Basic Usage

Run an application (main entrypoint):
```bash
bbyte run ./src/index.ts
```

Development with live reload & diagnostics:
```bash
bbyte run ./src/index.ts --watch --doctor --debug
```

Use a specific environment file:
```bash
bbyte run ./src/index.ts --env=.env.local
```

Show CLI version:
```bash
bbyte --version
# or
bbyte -v
```

Analyze project structure:
```bash
bbyte scan
```

Package with minification:
```bash
bbyte package --minify
```

Show help for a specific flag:
```bash
bbyte help run --watch
```

## 🔍 Detailed API

### Command Model (`run`)
- Requires a main file (`mainFile`).
- Injects environment with default: `NODE_ENV=development`.
- Internal phases:
  1. Read `tsconfig`.
  2. TypeScript compilation (errors wrapped in `CompilationError`).
  3. Conditional activation: Watcher (`chokidar`), Doctor, Banner, Debug logs.
  4. Runtime launch.
  5. Compilation time metrics.

### Run Command Flags
- `--doctor` (switch) Enables diagnostic service/server. Default: `false`.
- `--watch` (switch) Watches for changes & recompiles. Default: `false`.
- `--debug` (switch) Enables extended logs. Default: `false`.
- `--env=<file>` (file) Specifies alternative `.env`. Falls back to project root if omitted.
- `--banner` (switch) Shows banner with metadata (App Name, Version, Cli Version). Default: `true`.

### Related Environment Variables
- `NODE_ENV` Execution environment (default: `development`).
- `BANNER` Controls banner display (`true` / `false`).
- `DOCTOR_MODE` Doctor mode state (internal read-only after activation).
- `WATCH_MODE` Watch mode state (internal read-only after activation).
- `DEBUG_MODE` Debug mode state.

### package Command
- Generates distributable artifact.
- Flag: `--minify` (reduces size removing whitespace/comments).

### scan Command
- Builds structural representation using `ts-morph`.
- Useful for tooling, metadata generation, static analysis.

### help Command
- Contextual resolution of actions & flags.
- Supports combinations: action + flag.

### Version Flags
- `--version` / `-v` quick version query.

## 🔧 Advanced Examples

Silent run without banner:
```bash
# (If implementation supports disabling the banner via env var)
BANNER=false bbyte run ./src/index.ts
```

Full development pipeline (watch + debug + doctor):
```bash
bbyte run ./src/index.ts --watch --debug --doctor
```

Generate optimized package:
```bash
bbyte package --minify
```

Integrate with npm scripts:
```json
"scripts": {
  "start": "bbyte run ./src/index.ts --watch",
  "analyze": "bbyte scan",
  "build:pkg": "bbyte package --minify"
}
```

Inspect help for a specific flag:
```bash
bbyte help run --env
```

## 📄 License

This project is licensed under Apache-2.0. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Jose Eduardo Soria Garcia](mailto:alarifeproyect@gmail.com)**

*Part of the BigByte ecosystem*

</div>
