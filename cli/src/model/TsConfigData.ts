import { ClasspathElement } from "@bigbyte/classpath";


export interface TsConfigData {
  buildOutDir: string;
  buildRootDir: string;
  classpath: ClasspathElement[];
}
