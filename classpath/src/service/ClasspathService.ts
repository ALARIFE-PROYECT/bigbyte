import { ENV_CLASS_PATH } from "@bigbyte/utils/constant";

import { ClasspathElement } from "../model/ClasspathElement";
import { ClasspathMethod } from "../model/ClasspathMethod";

/**
 * Busca los valores de classpath en las env.
 * * Almacenadas previamente en el process por el cli.js
 */

class ClasspathService {
    private classpath: ClasspathElement[];

    constructor() {
        this.classpath = process.env[ENV_CLASS_PATH] !== undefined ? JSON.parse(process.env[ENV_CLASS_PATH]) as ClasspathElement[] : [];
    }

    getClassByName(name: string): ClasspathElement | undefined {
        return this.classpath.find((e) => e.name === name);
    }

    getClassByDecorator(decorator: string): ClasspathElement[] {
        return this.classpath.filter((e) => e.decorators.includes(decorator));
    }

    getMethodByClassAndName(className: string, methodName: string): ClasspathMethod | undefined {
        const classElement = this.getClassByName(className);
        
        if (!classElement) {
            return undefined;
        }

        return classElement.methods.find((m) => m.name === methodName);
    }
}

export const classpathService = new ClasspathService();
