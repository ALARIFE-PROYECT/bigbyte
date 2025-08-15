import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { exec, ExecException } from "node:child_process";
import EventEmitter from "node:events";

import { ROOT_PATH } from "@bigbyte/utils/constant";
import Logger from "@bigbyte/utils/logger";

import { MissingConfigurationError, MissingFileError, FormatError, CompilationErrorData } from "../../exception";
import { TsConfigData } from "../../model/TsConfigData";
import { loadingScreen } from "../Loading";
import { LIBRARY_NAME } from "../../constant";


const log = new Logger(LIBRARY_NAME);

let tscConfigPath = path.join(ROOT_PATH, 'tsconfig.json'); // ruta del tsconfig.json
let tsconfigData: any;

let buildOutDir: string; // ruta del compilado de ts
let buildRootDir: string; // ruta de la carpeta de origen de ts

const tsconfigToFlags = (): string[] => {
  const flags: string[] = [];

  if (tsconfigData.compilerOptions) {
    const options = tsconfigData.compilerOptions;

    for (const [key, value] of Object.entries(options)) {
      if (key.startsWith('//')) continue;

      if (value === true) {
        flags.push(`--${key}`);
      } else if (value === false) {
        if (['noEmit', 'noImplicitAny', 'noImplicitThis', 'noImplicitReturns',
          'noUnusedLocals', 'noUnusedParameters', 'noFallthroughCasesInSwitch'].includes(key)) {
          if (!value) continue;
          flags.push(`--${key}`);
        } else {
          flags.push(`--${key}`, 'false');
        }
      } else if (Array.isArray(value)) {
        if (value.length > 0) {
          flags.push(`--${key}`, value.join(','));
        }
      } else if (typeof value === 'object' && value !== null) {
        flags.push(`--${key}`, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        flags.push(`--${key}`, value.toString());
      }
    }
  }

  if (tsconfigData.files && Array.isArray(tsconfigData.files)) {
    tsconfigData.files.forEach((file: string) => {
      flags.push(file);
    });
  }

  return flags;
}

export const readTsConfig = (): TsConfigData => {
  if (!existsSync(tscConfigPath)) {
    throw new MissingFileError('tsconfig.json', tscConfigPath);
  }

  // Parseo de JSON tsconfig.json
  const fileContent = readFileSync(tscConfigPath, 'utf-8')
    .replace(/\/\*[\s\S]*?\*\//g, "") // elimina comentarios de bloque
    .replace(/\/\/.*$/gm, ""); // elimina comentarios de una sola línea

  let content;
  try {
    content = JSON.parse(fileContent);
  } catch (error) {
    throw new FormatError(tscConfigPath);
  }

  // Verificacion de propiedades en tsconfig.json
  if (!content.compilerOptions.experimentalDecorators) {
    throw new MissingConfigurationError('tsconfig.json', 'experimentalDecorators', 'true');
  }

  if (!content.compilerOptions.emitDecoratorMetadata) {
    throw new MissingConfigurationError('tsconfig.json', 'emitDecoratorMetadata', 'true');
  }

  if (!content.compilerOptions.rootDir) {
    throw new MissingConfigurationError('tsconfig.json', 'rootDir');
  }

  if (!content.compilerOptions.outDir) {
    throw new MissingConfigurationError('tsconfig.json', 'outDir');
  }

  // Almacemiento de propiedades del tsconfig.json
  buildOutDir = content.compilerOptions.outDir;
  buildRootDir = content.compilerOptions.rootDir;

  tsconfigData = content;

  return {
    tsPath: tscConfigPath,
    buildOutDir: buildOutDir,
    buildRootDir: buildRootDir
  }
}

export const compileTypeScript = async (fileChanged?: string) => {
  const init = performance.now();

  let emitter: EventEmitter | undefined;
  if(!fileChanged) {
    emitter = loadingScreen('Compiling TypeScript');
  }

  let command = `npx tsc`;

  if (fileChanged) {
    const flags = tsconfigToFlags();
    command += ` ${fileChanged} ${flags.join(' ')}`;
  } else {
    command += ` --project ${tscConfigPath}`;
  }

  return new Promise((resolve, reject) => {
    exec(command, (error: ExecException | null, stdout: string, stderr: string) => {
      emitter?.emit('finish');

      if(!fileChanged) {
        log.debug(`TypeScript compilation finished in ${performance.now() - init} ms`);
      }

      if (error) {
        return reject({
          resume: stdout + stderr,
          code: error.code,
        } as CompilationErrorData);
      }

      resolve(true);
    });
  });
}
