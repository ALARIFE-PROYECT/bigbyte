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

---