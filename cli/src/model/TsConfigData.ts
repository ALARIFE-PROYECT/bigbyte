import { ClasspathElement } from "@bigbyte/classpath";


export interface TsConfigData {
  tsPath: string; // path of the tsconfig.json file
  buildOutDir: string;
  buildRootDir: string;
}
