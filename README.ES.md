# Alarife

**Alarife** es un proyecto de software centrado en la creación de aplicaciones robustas, modulares y escalables mediante una arquitectura inspirada en principios bien establecidos del desarrollo empresarial moderno. En el núcleo de este proyecto se encuentra **BigByte**, una librería escrita en TypeScript que actúa como un marco de trabajo completo para desarrollar desde servicios backend hasta soluciones distribuidas en la nube.

## BigByte

**BigByte** es la piedra angular de Alarife. Se trata de un framework modular y extensible que proporciona una serie de herramientas y decoradores para estructurar aplicaciones de forma limpia, desacoplada y orientada a componentes.

El ecosistema de BigByte se compone de varios módulos, cada uno enfocado en una responsabilidad específica dentro de la arquitectura de una aplicación moderna:

### 🔧 CLI

El módulo **CLI** permite lanzar, configurar y gestionar una aplicación BigByte desde la terminal. Soporta:
- Definición y ejecución de comandos personalizados.
- Lectura y gestión avanzada de entornos (`.env`, perfiles, variables dinámicas).
- Activación de un watcher para reinicio automático en tiempo de desarrollo.

### 🧠 Core

**Core** proporciona el sistema de inyección de dependencias. Incluye:
- Registro global de componentes.
- Gestión de ciclos de vida de objetos (singleton, transient...).
- Inyección de valores y configuraciones mediante decoradores.

Este módulo facilita el desacoplamiento y fomenta la reutilización de servicios.

### 📝 Logger

**Logger** ofrece un sistema de trazas altamente configurable:
- Soporte para múltiples niveles de log (debug, info, warn, error).
- Salida en consola con formato enriquecido.
- Almacenamiento en archivos rotativos.
- Posibilidad de integración con sistemas externos de observabilidad como Grafana, Loki u otros sistemas de métricas.

### 🌐 Http

El módulo **Http** permite construir APIs REST utilizando un enfoque declarativo con decoradores:
- Definición de controladores y rutas de forma limpia y organizada.
- Middleware para filtros, validaciones y respuestas personalizadas.
- Control de errores centralizado.

### 🧬 Data

**Data** facilita la conexión con bases de datos relacionales y no relacionales a través de interfaces decoradas:
- Decoradores para declarar entidades, columnas y relaciones.
- Repositorios inyectables.
- Integración natural con el sistema de inyección de dependencias.

### 🍃 Mongosee

**Mongosee** extiende `Data` para trabajar específicamente con bases de datos MongoDB:
- Definición de esquemas y modelos usando decoradores.
- Inyección de modelos en servicios.
- Soporte para validaciones, índices y migraciones simples.

### 🔐 Security

El módulo **Security** permite gestionar autenticación basada en tokens JWT:
- Decoradores para proteger rutas o métodos.
- Inyección automática del usuario autenticado.
- Soporte para estrategias personalizadas.

### ☁️ Cloud

**Cloud** proporciona herramientas para construir soluciones distribuidas y cloud-native:
- Decoradores para definir microservicios, colas, eventos y funciones serverless.
- Configuración de servicios externos como colas de mensajes, buckets y funciones escalables.

---

## 📖 Filosofía

BigByte está diseñado bajo los principios de **modularidad**, **tipado estricto** y **productividad del desarrollador**. Utiliza el poder de TypeScript para ofrecer una experiencia de desarrollo fluida, coherente y escalable, integrando prácticas ampliamente probadas en entornos empresariales.

---

## 🚀 Primeros pasos

```bash
npx bigbyte-cli new my-app
cd my-app
npm run start:dev
```

## ✅ Contribuir
Las contribuciones son bienvenidas. Si tienes ideas, mejoras o quieres ayudar en el desarrollo, no dudes en crear [addons](./README.ADDONS.ES.md) esto hara que el framework crezca y sea mas eficaz.

## 📜 Licencia
Este proyecto está bajo la licencia ISC.