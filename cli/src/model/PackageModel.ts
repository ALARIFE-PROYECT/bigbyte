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