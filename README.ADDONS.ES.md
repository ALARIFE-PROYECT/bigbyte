Addons

# Inyeccion de dependencias
El @App añade a la clase la metainformacion del CoreComponentRegistry con la key guardada en la libreira de utils llamada CoreComponentRegistry.

los addons pueden almacenar este objeto y trabajar con el.

* En la libreria utils se guarda la interfaz del CoreComponentRegistry y la clase Component para su uso.


# Carpeta integration
archivo configuration.ts:
* La ejecucion de este archivo es un hilo diferente, que quiero decir con esto, los datos aqui almacenados deben ser datos planos (constantes), este archivo no tendra acceso a objetos y otros datos en memoria del hilo de ejecucion de la app objetivo.

    export default {
        DEFAULT_ENV_VALUES: 
            * archivo que exporta una lista de las keys que este addon tiene que añadir al environment
            * tambien debe contener los valores por defecto de estos campos.

        INHERITED_ARGV:
            * argumentos de comando que deben heredarse del cli al lanzador del programa principal.
            * Los flags son estrictamente comprobados para cada comando, el addon (y tu app) solo podra usar un flag si es configurado en este campo.
    }

<!-- TODO: -->
archivo hooks:
    * Archivo debe exportar las funciones onAfterBuild, onBeforeBuild, onAfterInit, onBeforeInit
    * reciben por parametros (¿no se?)

# Logica
* Todos las constantes se localizan en el repo de utils, indispensable para un correcto desarrollo de un addon
* Se recomienda el uso de log.dev(), puedes encontrarlo en utils.
* Si el componente es inyectable se tiene que añadir la metainformacion:
```JS
Reflect.defineMetadata(METADATA_COMPONENT_TYPE, componentType, Target);
```

* Para que tu decorador trabaje con el registry del core.
```JS
const registry = Reflect.getMetadata(METADATA_CORE_COMPONENT_REGISTRY, target);
```

```JS
export const NewDecorator = (): ClassDecorator => (Target: Function): void => {
    log.dev(`${DECORATOR_APP_NAME} decorator applied to ${Target.name}`);

    /** Tipos */
    // export enum ComponentSubType {
    //     MAIN = 'MAIN',
    //     COMPONENT = 'COMPONENT',
    //     SERVICE = 'SERVICE',
    //     REPOSITORY = 'REPOSITORY',
    //     CONTROLLER = 'CONTROLLER',
    // }
    const componentType = ComponentSubType.COMPONENT; // COMPONENT es el tipo por defecto

    Reflect.defineMetadata(METADATA_COMPONENT_TYPE, componentType, Target);
    Reflect.defineMetadata(`${METADATA_DECORATOR_NAME}=${DECORATOR_APP_NAME}`, true, Target); // siempre debe declarar el decorador para un buen funcionamiento
}
```

## Eventos
Todos los decoradores deben ser declarados y cuando termine su logica marcarlos como ejecutados
Puedes suscribir tu decorador a algunos eventos de ejecucion para el orden de ejecucion. 

```JS
// tipos de eventos
type EventType = 'first' | 'last' | string
```

```JS
export const App = (): ClassDecorator => {
    declareDecorator(DECORATOR_APP_NAME);

    return (Target: Function): void => {
        log.dev(`${DECORATOR_APP_NAME} decorator applied to ${Target.name}`);

        decoratorExecEvent.on('last', () => {
            const paramTypes = Reflect.getMetadata("design:paramtypes", Target) ?? [];
            coreComponentRegistry.add(Target, paramTypes, { type: componentType, injectable: false });
        });

        executeDecorator(DECORATOR_APP_NAME);
    }
}
```