import path from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { FormatError, MissingFileError } from "../exception";

export const readJsonFile = <T>(filePath: string, fileName: string): T => {
    let packagePath: string = path.join(filePath, fileName);

    if (!existsSync(packagePath)) {
        throw new MissingFileError(fileName, packagePath);
    }

    const fileContent = readFileSync(packagePath, 'utf-8')

    let content;
    try {
        content = JSON.parse(fileContent);
    } catch (error) {
        throw new FormatError(packagePath);
    }

    return content
}
