# 🔄️ @bigbyte/logger - Declarative Logging & Trace Module

<div align="center">

[![NPM Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://www.npmjs.com/package/@bigbyte/logger)
[![License](https://img.shields.io/badge/license-Apache_2.0-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

**@Logger decorator and services to enable structured logging, tracing and declarative file rotation configuration inside the BigByte ecosystem.**

</div>

## 📋 Table of Contents
- [Features](#-features)
- [Installation](#-installation)
- [Commands](#-commands)
- [Decorators](#-decorators)
- [Basic Usage](#-basic-usage)
- [Detailed API](#-detailed-api)
- [Architecture](#-architecture)
- [Error Handling](#-error-handling)
- [Advanced Examples](#-advanced-examples)
- [License](#-license)

## ✨ Features
* **@Logger** decorator that automatically registers a LoggerService inside the IoC container.
* Integration with the declarative lifecycle from @bigbyte/events (declare → execute → instantiate).
* Based on `@bigbyte/utils/logger` providing levels: error, warn, info, debug, dev.
* Simple injection via `@Inject()` (registered & injectable component).
* CLI flags to configure trace file output and future rotation (time / size).
* Environment variables mirroring flags for deployment automation.
* Metadata conventions for detection & validation (**@App** must exist before **@Logger**).
* Future‑ready extension: log rotation (time / size) and modular segmentation.

## 🚀 Installation
```bash
npm install @bigbyte/logger
```

## 🖥️ Commands
This package does not define its own commands, but extends the `run` command semantics of `@bigbyte/cli` by adding flags declared through integration (`configuration.ts`):

### Flags added to run command
- `--trace-log-file` (ENV: `TRACE_LOG_FILE`): Path to trace log file. If omitted no file is generated.
- `--trace-log-file-time-interval` (ENV: `TRACE_LOG_FILE_TIME_INTERVAL`): Interval in ms for rotation (future / WIP).
- `--trace-log-file-size-interval` (ENV: `TRACE_LOG_FILE_SIZE_INTERVAL`): Size threshold in bytes for rotation (future / WIP).

> Time & size rotation: defined as initial design, full implementation in later versions.

## 🤖 Decorators
### @Logger()
Registers `LoggerService` during the final decorator cycle phase. Requirements:
* Must be applied on the root class already decorated with `@App()`.
* Validates order and presence of `@App` before proceeding.
* Sets metadata: `metadata:logger` and `${METADATA_DECORATOR_NAME}=@Logger`.

Effects:
* Adds `LoggerService` to `componentRegistry` as injectable component.
* Allows injection via `@Inject() private logger!: LoggerService`.

## 🔧 Basic Usage
```ts
import 'reflect-metadata';
import { App, Inject } from '@bigbyte/core';
import { Logger, LoggerService } from '@bigbyte/logger';

@App()
@Logger()
class MainApp {
  @Inject() private logger!: LoggerService;

  start() {
    this.logger.info('Application started');
  }
}
```

CLI with trace file:
```bash
bbyte run --trace-log-file=./logs/trace.log ./src/index.ts
```

Using environment variable:
```bash
TRACE_LOG_FILE=./logs/trace.log bbyte run ./src/index.ts
```

## 🔍 Detailed API
### LoggerService
Exposed methods:
* `error(...args)` – Critical errors.
* `warn(...args)` – Warnings.
* `info(...args)` – Operational information.
* `debug(...args)` – Debug details.

Internally delegates to an instance of `@bigbyte/utils/logger`.

### log (utility)
Exports a direct logger instance for ad‑hoc usage:
```ts
import { log } from '@bigbyte/logger';
log.info('Message without injection');
```

### Future Trace Configuration (Design)
Although rotation isn’t active yet, the intention of the flags:
* `--trace-log-file-time-interval`: Schedule rotation on time window.
* `--trace-log-file-size-interval`: Truncate / archive when size exceeded.

Both will converge into an internal interval service (IntervalService) evaluating conditions & managing rotations.

## 🏗️ Architecture
```
src/
├── index.ts                    # Public exports
├── constant/                   # Constants (decorators, ENV, ARGV, metadata)
├── decorator/
│   └── Logger.ts               # @Logger decorator
├── integration/
│   └── configuration.ts        # CLI integration flag declarations
└── service/
    ├── LoggerService.ts        # Injectable logging facade
    ├── log.ts                  # Shared util logger instance
    └── IntervalService.ts      # (WIP) Rotation design (time/size)
```
Key dependencies:
* `@bigbyte/utils` – Base logger, constants, validation utilities.
* `@bigbyte/events` – Decorator execution cycle (`declareDecorator`, `executeDecorator`).
* `@bigbyte/ioc` – Component registry (`componentRegistry`).
* `@bigbyte/integration` – CLI configuration model for flags.
* `reflect-metadata` – Runtime type metadata.

## ⚠️ Error Handling
Potential errors (delegated to base libraries):
* `DecoratorError` if `@Logger` is applied without prior `@App`.
* Injection errors if container cannot resolve dependencies (advanced scenarios modifying registry).

Best practices:
* Order: always `@App` before `@Logger`.
* Export the root class to facilitate external inspection.
* Store trace file under a VCS ignored directory (`logs/`).

## 🔧 Advanced Examples
### Chained Service Injection
```ts
import { Service, Inject } from '@bigbyte/core';
import { LoggerService } from '@bigbyte/logger';

@Service()
class WorkerService {
  @Inject() private logger!: LoggerService;
  process() { this.logger.debug('Processing batch...'); }
}
```

### Mixed Usage: Direct util + Service
```ts
import { log, LoggerService } from '@bigbyte/logger';

function bootStatus() {
  log.info('Starting pre-boot');
}
```

### Combined Flags (Future Design)
```bash
bbyte run \
  --trace-log-file=./logs/trace.log \
  --trace-log-file-time-interval=600000 \
  --trace-log-file-size-interval=1048576 \
  ./src/index.ts
```

### Equivalent Environment Variables
```bash
TRACE_LOG_FILE=./logs/trace.log \
TRACE_LOG_FILE_TIME_INTERVAL=600000 \
TRACE_LOG_FILE_SIZE_INTERVAL=1048576 \
bbyte run ./src/index.ts
```

## 📄 License
This project is licensed under Apache-2.0. See the [LICENSE](LICENSE) file for details.

---
<div align="center">

**Built with ❤️ by Jose Eduardo Soria Garcia (mailto:alarifeproyect@gmail.com)**

*Part of the BigByte ecosystem*

</div>
