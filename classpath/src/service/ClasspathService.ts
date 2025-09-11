/*
 * Copyright (c) 2025 Jose Eduardo Soria Garcia <alarifeproyect@gmail.com>
 *
 * This file is part of @bigbyte/classpath.
 *
 * Licensed under the Apache-2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License in the LICENSE file
 * at the root of this project.
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND.
 */

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

    getElementById(id: string): ClasspathElement | undefined {
        return this.classpath.find((e) => e.id === id);
    }

    getElementByName(name: string): ClasspathElement | undefined {
        return this.classpath.find((e) => e.name === name);
    }

    getELementByDecorator(...decorators: string[]): ClasspathElement[] {
        return this.classpath.filter((e) =>
            e.decorators?.some(d => decorators.includes(d))
        );
    }

    getMethodByElementAndName(className: string, methodName: string): ClasspathMethod | undefined {
        const classElement = this.getElementByName(className);

        if (!classElement) {
            return undefined;
        }

        return classElement.methods?.find((m) => m.name === methodName);
    }

    getAll(): ClasspathElement[] {
        return this.classpath;
    }
}

export const classpathService = new ClasspathService();
