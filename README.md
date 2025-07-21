# Alarife

**Alarife** is a software project focused on building robust, modular, and scalable applications through an architecture inspired by well-established principles of modern enterprise development. At the core of this project lies **BigByte**, a TypeScript-based library that serves as a complete framework for building everything from backend services to distributed cloud solutions.

## BigByte

**BigByte** is the cornerstone of Alarife. It is a modular and extensible framework that provides a collection of tools and decorators to structure applications in a clean, decoupled, and component-oriented manner.

The BigByte ecosystem is composed of several modules, each focused on a specific responsibility within the architecture of a modern application:

### 🔧 CLI

The **CLI** module enables launching, configuring, and managing a BigByte application from the terminal. It supports:
- Definition and execution of custom commands.
- Advanced environment management (`.env`, profiles, dynamic variables).
- Activation of a file watcher for automatic restarts during development.

### 🧠 Core

**Core** provides the dependency injection system. It includes:
- Global registry of components.
- Lifecycle management of objects (singleton, transient...).
- Injection of values and configurations via decorators.

This module simplifies decoupling and encourages service reuse.

### 📝 Logger

**Logger** offers a highly configurable tracing and logging system:
- Support for multiple log levels (debug, info, warn, error).
- Enriched console output formatting.
- Log file storage with rotation.
- Integration with external observability systems like Grafana, Loki, or other metrics platforms.

---

## 📖 Philosophy

BigByte is designed with the principles of **modularity**, **strict typing**, and **developer productivity** in mind. It leverages the power of TypeScript to deliver a smooth, consistent, and scalable development experience, integrating widely proven practices from enterprise environments.

---

<!-- ## 🚀 Getting Started

```bash
npx bigbyte-cli new my-app
cd my-app
npm run start:dev
``` -->

## ✅ Contributing
Contributions are welcome! If you have ideas, improvements, or would like to help with development, feel free to create [addons](./README.ADDONS.ES.md). This will help the framework grow and become even more efficient.

## 📜 License
This project is licensed under the ISC license.
