/*
 * Copyright (c) 2025 Jose Eduardo Soria Garcia <alarifeproyect@gmail.com>
 *
 * This file is part of @bigbyte/cli.
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

export interface PackageModel {
    // Campos obligatorios
    name: string;
    version: string;

    // Campos opcionales comunes
    description?: string;
    main?: string;
    types?: string;
    typings?: string;
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    optionalDependencies?: Record<string, string>;

    // Metadata
    author?: string | {
        name: string;
        email?: string;
        url?: string;
    };
    contributors?: Array<string | {
        name: string;
        email?: string;
        url?: string;
    }>;
    license?: string;
    homepage?: string;
    repository?: string | {
        type: string;
        url: string;
        directory?: string;
    };
    bugs?: string | {
        url: string;
        email?: string;
    };

    // Configuración de publicación
    private?: boolean;
    publishConfig?: {
        registry?: string;
        access?: 'public' | 'restricted';
        tag?: string;
    };

    // Configuración de package
    engines?: {
        node?: string;
        npm?: string;
    };
    os?: string[];
    cpu?: string[];

    // Campos específicos de TypeScript
    tsconfig?: string;

    // Configuraciones personalizadas (comunes para herramientas)
    config?: Record<string, any>;
    jest?: Record<string, any>;
    eslintConfig?: Record<string, any>;
    prettier?: Record<string, any>;

    // Campo para extensiones arbitrarias
    [key: string]: any;
}