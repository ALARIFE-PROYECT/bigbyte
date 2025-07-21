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

### 🌐 Http

The **Http** module enables building REST APIs using a declarative decorator-based approach:
- Clean and organized definition of controllers and routes.
- Middleware for filters, validations, and custom responses.
- Centralized error handling.

### 🧬 Data

**Data** simplifies integration with both relational and non-relational databases through decorated interfaces:
- Decorators to declare entities, columns, and relationships.
- Injectable repositories.
- Seamless integration with the dependency injection system.

### 🍃 Mongosee

**Mongosee** extends `Data` to work specifically with MongoDB databases:
- Schema and model definition using decorators.
- Injection of models into services.
- Support for validations, indexes, and simple migrations.

### 🔐 Security

The **Security** module enables JWT-based authentication management:
- Decorators to protect routes or methods.
- Automatic injection of the authenticated user.
- Support for custom strategies.

### ☁️ Cloud

**Cloud** provides tools for building distributed and cloud-native solutions:
- Decorators to define microservices, queues, events, and serverless functions.
- Configuration of external services such as message queues, buckets, and scalable functions.

---

## 📖 Philosophy

BigByte is designed with the principles of **modularity**, **strict typing**, and **developer productivity** in mind. It leverages the power of TypeScript to deliver a smooth, consistent, and scalable development experience, integrating widely proven practices from enterprise environments.

---

## 🚀 Getting Started

```bash
npx bigbyte-cli new my-app
cd my-app
npm run start:dev
```

## ✅ Contributing
Contributions are welcome! If you have ideas, improvements, or would like to help with development, feel free to create [addons](./README.ADDONS.ES.md). This will help the framework grow and become even more efficient.

## 📜 License
This project is licensed under the ISC license.
