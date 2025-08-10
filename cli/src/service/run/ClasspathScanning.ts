import path from "node:path";
import { Project, Type } from "ts-morph";

import { ClasspathElement, ClasspathMethod, ClasspathProperty } from "@bigbyte/utils/lib/classpath";

import { DuplicateClassError } from "../../exception";



const cleanTypeText = (typeText: string): string => {
    return typeText.replace(/import\(["'][^)]+["']\)\./g, "");
}

const getType = (type: Type) => {
    let typeText: string | string[];
    if (type.isUnion()) {
        typeText = type.getUnionTypes().map(t => cleanTypeText(t.getText()));
    } else {
        typeText = cleanTypeText(type.getText());
    }

    return typeText;
}

/**
 * TODO: Falta soporte a recompilar un solo archivo y modificarlo en el objeto
 */
export const scanClasspath = (tsConfigFilePath: string, buildRootDir: string, fileChanged?: string): ClasspathElement[] => {
    const seenClassNames = new Set<string>();
    const project = new Project({ tsConfigFilePath });
    const result: ClasspathElement[] = [];

    // Aquí ajustas el patrón de búsqueda
    const files = project.getSourceFiles(`${buildRootDir}/**/*.ts`);

    for (const file of files) {
        for (const cls of file.getClasses()) {
            const className = cls.getName() || "<anonymous>";

            if (seenClassNames.has(className) && className !== "<anonymous>") {
                throw new DuplicateClassError(`Duplicate class or interface names are not allowed. Name detected: ${className}`);
            }
            seenClassNames.add(className);

            // --- Decoradores de la clase ---
            const classDecorators = cls
                .getDecorators()
                .map(d => d.getName());

            // --- Propiedades ---
            const props: ClasspathProperty[] = cls.getProperties().map(prop => {
                const decorators = prop.getDecorators().map(d => d.getName());
                const type = getType(prop.getType());

                return {
                    name: prop.getName(),
                    type: type,
                    decorators
                };
            });

            // --- Métodos ---
            const methods: ClasspathMethod[] = cls.getMethods().map(method => {
                const methodDecorators = method.getDecorators().map(d => `@${d.getName()}`);

                // Parámetros
                const params: ClasspathProperty[] = method.getParameters().map(param => {
                    const paramDecorators = param.getDecorators().map(d => `@${d.getName()}`);
                    const type = getType(param.getType());

                    return {
                        name: param.getName(),
                        type: type,
                        decorators: paramDecorators
                    };
                });

                // Tipo de retorno
                const returnType = getType(method.getReturnType());

                return {
                    name: method.getName(),
                    decorators: methodDecorators,
                    params,
                    returnType: returnType
                };
            });

            result.push({
                name: className,
                path: path.resolve(file.getFilePath()),
                decorators: classDecorators,
                props,
                methods
            } as ClasspathElement);
        }
    }
    return result;
}
