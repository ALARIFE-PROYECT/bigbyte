import path from "node:path";
import { Project, SyntaxKind, Type } from "ts-morph";

import { ROOT_PATH } from "@bigbyte/utils/constant";

import { DuplicateClassError } from "../exception/DuplicateClassError";

import { ClasspathElement } from "../model/ClasspathElement";
import { ClasspathMethod } from "../model/ClasspathMethod";
import { ClasspathProperty } from "../model/ClasspathProperty";


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

const extractEnumValues = (type: Type): string[] | undefined => {
    const symbol = type.getSymbol();
    if (!symbol) return undefined;

    const decl = symbol.getDeclarations()[0];
    if (!decl) return undefined;

    if (decl.getKind() === SyntaxKind.EnumDeclaration) {
        const enumDecl = decl.asKindOrThrow(SyntaxKind.EnumDeclaration);
        return enumDecl.getMembers().map(m => m.getName());
    }

    return undefined;
};

export const scanClasspath = (tsConfigFilePath: string, buildRootDir: string, buildOutDir: string): ClasspathElement[] => {
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
                .map(d => `@${d.getName()}`);

            // --- Propiedades ---
            const props: ClasspathProperty[] = cls.getProperties().map(prop => {
                const decorators = prop.getDecorators().map(d => `@${d.getName()}`);
                const type = getType(prop.getType());

                const enumValues = extractEnumValues(prop.getType());

                return {
                    name: prop.getName(),
                    type: type,
                    decorators,
                    enumValues
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

            const rootPath = path.resolve(file.getFilePath());
            const classRelativePath = rootPath.replace(path.join(ROOT_PATH, buildRootDir), '');
            const outPath = path.join(ROOT_PATH, buildOutDir, classRelativePath.replace('.ts', '.js'));

            result.push({
                name: className,
                rootPath,
                outPath,
                decorators: classDecorators,
                props,
                methods
            } as ClasspathElement);
        }
    }
    
    return result;
}
