import { ClasspathElement } from "@bigbyte/utils/classpath";


export interface TsConfigData {
  buildOutDir: string;
  buildRootDir: string;
  classpath: ClasspathElement[];
}
