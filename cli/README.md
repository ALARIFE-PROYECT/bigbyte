<!-- 
* Nueva documentation

** descripcion del proyecto

** descripcion de los puntos para las apps
(Environment, Service, Value, Logger, Worker, Utils)

Decoradores: (App, Service, Value, Logger, Worker y Lombok)

Configuraciones: (Archivo banner en la raiz)(Archivo enviroment en la raiz)(Parametros de ejecucion NODE_ENV y ENV_FILE)

** descripcion de los puntos para los plugins
(CoreConfig, , valueStore, Store model, Banner, DeveloperError, launcher, Logger, workerpool, utils)

** Related

-->


# Alarife

[Alarife](https://es.wikipedia.org/wiki/Alarife) is an Iberian term that referred to Mudejarian architects and master builders.

What is this library? This library provides a framework for creating applications with a decorator pattern.

- It is inspired by **Spring Boot**.
- It makes use of the proposal of decorators ([plugin-proposal-decorators](https://babeljs.io/docs/babel-plugin-proposal-decorators)) from babel.

Application example code [alarife](https://github.com/pepesoriagarcia99/alarife-example).

## Decorators

### @App

App is a **class** decorator.

The **@App** decorator injects the Logger module.

> When using **@App** with other plugins **@App** should always be on top of them all.

This decorator instantiates the class to which it is applied to launch its constructor, so you can add additional configuration.

You can add the parameters belonging to **Core** to your instance with **@Value**.

> **core** includes: environment, version
> **configuration** includes: traceLog

```JS
import { App, Value } from '@alarife/core/decorators';

@App()
class Main {

  @Value('Core.environment') environment;

  @Value('Core.version') coreVersion;

  @Value('Core.rootPath') rootPath;

  @Value('Core.traceLog') traceLog;

  @Value('configuration') configuration;

  constructor() {
    this.configuration.traceLog({ levels : ['info', 'debug', 'error', 'warn'] });
  }
}
```

### @Service

Service is a **class** decorator.

The **@Service** decorator injects the Logger module.

The **@Service** decorator instantiates the class for further injection into other classes.

The **@AutoWired** decorator used on fields injects the value of the instantiated class.

```JS
import { App, Service, AutoWired } from '@alarife/core/decorators';

@Service()
class UserService {

  getAllUsers() {
    return [
      { id   : 1, name : 'Jhon' }
    ];
  }
}

@App()
class Main {

  @AutoWired(UserService) #userService;

  constructor() {
    this.configuration.traceLog({ levels : ['info', 'debug', 'error', 'warn'] });

    this.#userService.getAllUsers();
  }
}
```


### @Value

Value is a **field** decorator.

**@Value** manages a store of data that you can inject into your classes.

```JS
import { App, Value } from '@alarife/core/decorators';
import { valueStore } from '@alarife/core/modules';

valueStore.set('app.ip', '0.0.0.0')

@App()
class Main {

  @Value('app.ip') ip;

  constructor() {
    this.log.info('server ip: ' this.ip);
  }
}
```

#### ValueStore

Revisar docu, solo indicar que se usa el modelo de store

<!-- You can save your own values to reuse them in your app.

> By default, the **configuration** object is added to store the configuration methods.

```JS
import { valueStore } from '@alarife/core/modules';

// Store options
valueStore.set('app.url', mongooseUrl)
valueStore.merge('app.configuration', { ... }) // Merge over existing objects
valueStore.get('app.url')
valueStore.delete('app.url')
``` -->

### @Logger

Logger is a **class** decorator.
Insert the entire Logger module to the class.

```JS
import { Logger } from '@alarife/core/decorators';

@Logger()
class Service {
  constructor() {
    this.log.info('Message');
  }
}
```

### @Worker

Worker is a **method** decorator. You can use it in any class.

You use the [workerpool](https://www.npmjs.com/package/workerpool) library, you work with the worker as you would work with promises.

> The method does not have access to this.
> Worker parameters must be serializable.

Allows you to launch blocking functions within your code without blocking the main thread.

```JS
import { Worker, Service, App, AutoWired } from '@alarife/core/decorators';

@Service()
class TestService {

  @Worker()
  blockingMethod(range) {
    const start = new Date();

    let total = 0;
    for (let index = 0; index < range; index++) {
      total += index;
    }

    const end = new Date();

    console.log(`Delay: ${end - start} ms`);

    return total;
  }
}

@App()
class Main {

  @AutoWired(TestService) #testService;

  constructor() {
    this.#testService.blockingMethod(9000000000)
      .then(result => {
        this.log.info(result);
      })
      .catch(err => {
        this.log.error(err);
      });
  }
}
```

## Environment

<!-- El sistema obtiene automaticamente los archivo .env.production, .env.development y .env.test automaticamente, los guarda en el coreConfig en una store para su posterior uso en modulos y apps

Para personalizar la ubicacion del archivo .env utilizar los parametros del process

vars:
NODE_ENV
ENV_FILE

files:
.env.development
.env.production
.env.test

```
  "start": "nodemon --exec babel-node src/app.js ENV_FILE=/dir/dir/.env"
``` -->

<!-- ! Muy feo -->
<!-- para usar las enviroments en la app seria coreConfiguration.enviroments -->

<!-- * Solucion: -->
<!-- exportar en package un env y almacenar todo ahi -->

## Models

<!-- Modelo de Store

Indicar el sistema de objetos

mongo.ddbb
mongo.url

si buscas la key devuelve el string
si soliciata mongo devuelve un objeto con las dos keys -->

```JS
import { Store } from '@alarife/core/models';


```

## Addons

Some of the additional functionalities that the library contains are listed.

### DeveloperError

Exception Management for Development

```JS
  throw new DeveloperError('The Service Document can only be applied to classes.');
```

### Logger

The **App**, **Controller**, and **Service** decorators add this functionality.

Future plugin for **server log** and **access log** management

[Morgan](https://www.npmjs.com/package/morgan) is used as a library for access log.

Configurations:
* Allows different output levels **('info', 'debug', 'error', 'warn')**.

```JS
this.log.info('New message');
this.log.error('Error message', error);
this.log.warn('Warn message');
```

### Lombok

<!-- **Developing**
Proposal for a decorator based on [Lombok](https://projectlombok.org/) to decorate classes in javascript. -->

### Banner

The banner functionality is added at the beginning of the project.

If a **banner.txt** file does not exist in the root of the project, use the one with the default library.

## Utils

Type validation capabilities

```JS
  /** return true or false */
  isDefined(value);
  isFunction(value);
  isClass(value);
  isObject(value);
  isString(value);
  isNumber(value);
```

Object functionalities

```JS
  defineProperty(prototype, key, value);
  merge(target, source);
```

## Related

- [alarife-http](https://www.npmjs.com/package/@alarife/http) - Library to create HTTP servers.
- [alarife-mongo](https://www.npmjs.com/package/@alarife/mongo) - Library to use Mongo database.
