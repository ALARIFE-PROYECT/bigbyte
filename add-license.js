/**
 * Script
 *
 * * Flags:
 * - project: project name (default: name in package.json). example: --project=./my-project
 * - path: path to the root of the project (default: current working directory). example: --path=C:\my-project
 * - ext: file extension to look for (default: .js). example: --ext=.ts
 */

/**
 * Examples:
 *
 * Edit all ts files
 */

const getArgvValue = (flag) => {
  let result = null;

  process.argv.forEach((arg) => {
    if (arg.startsWith(`--${flag}=`)) {
      const [key, value] = arg.split("=");
      result = value;
    }
  });

  return result;
};

const rootPath = getArgvValue("path") ?? process.cwd(); // busca todos los proyectos en la ruta actual
const projectPath = getArgvValue("project") ?? null; // si se especifica un proyecto, solo se procesa ese
const fileExtension = getArgvValue("ext") ?? ".js";

const getLicenseText = (name) => `/*
 * Copyright (c) 2025 Jose Eduardo Soria
 *
 * This file is part of ${name}.
 *
 * Licensed under the Apache 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License in the LICENSE file
 * at the root of this project.
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND.
 */`;

const getPackageJson = (projectPath) => {
  const packagePath = path.join(projectPath, "package.json");
  const packageData = fs.readFileSync(packagePath, "utf8");
  const packageJson = JSON.parse(packageData);

  return packageJson;
};

const writeLicense = (projectName, projectPath, ext) => {
  if (!fs.existsSync(projectPath)) {
    throw new Error(`The path ${projectPath} does not exist`);
  }

  const licenseText = getLicenseText(projectName);

  const processDirectory = (dirPath) => {
    const items = fs.readdirSync(dirPath);

    items.forEach((item) => {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        processDirectory(itemPath);
      } else if (stats.isFile() && path.extname(itemPath) === ext) {
        const currentContent = fs.readFileSync(itemPath, "utf8");

        // Verificar si el texto ya existe al inicio del archivo
        if (!currentContent.startsWith(licenseText.trim())) {
          const newContent = licenseText + "\n\n" + currentContent;
          fs.writeFileSync(itemPath, newContent, "utf8");
        }
      }
    });
  };

  processDirectory(projectPath);
};

if (rootPath) {
  const rootPath = path.isAbsolute(rootPath)
    ? rootPath
    : path.join(process.cwd(), rootPath);
  const rootFiles = fs.readdirSync(rootPath, { withFileTypes: true });

  const rootDirs = rootFiles.filter((item) => item.isDirectory());
  const projects = [];
  rootDirs.forEach((dir) => {
    const packagePath = path.join(rootPath, dir.name, "package.json");

    if (fs.existsSync(packagePath)) {
      const packageJson = getPackageJson(path.join(rootPath, dir.name));

      projects.push({
        name: dir.name,
        path: path.join(rootPath, dir.name),
        projectName: packageJson.name,
      });
    }
  });

  projects.forEach((project) => {
    writeLicense(project.projectName, project.path, fileExtension);
  });
} else if (projectPath) {
  const projectPath = path.isAbsolute(projectPath)
    ? projectPath
    : path.join(process.cwd(), projectPath);
  const packageJson = getPackageJson(projectPath);

  writeLicense(packageJson.name, projectPath, fileExtension);
} else {
  throw new Error("You must specify either --path or --project");
}
