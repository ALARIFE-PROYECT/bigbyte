import { readdir } from "fs/promises";
import { join } from "path";
import { spawn } from "child_process";

async function installNodeProjects(basePath) {
  const entries = await readdir(basePath, { withFileTypes: true });
  const directories = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((e) => e.name);

  for (const dir of directories) {
    const packageJsonPath = join(basePath, dir, "package.json");
    try {
        // Check if package.json exists
        await import("fs/promises")
          .then((fs) => access(packageJsonPath))
          .catch(() => null);

      await exec(basePath, dir);
    } catch (err) {
      console.log(`Skipping ${dir}, no package.json found.`);
    }
  }
}

async function exec(basePath, dir) {
  if (process.argv.includes("install")) {
    await runNpmInstall(basePath, dir);
  }

  if (process.argv.includes("publish")) {
    await runPublishYalc(basePath, dir);
  }
}

function runNpmInstall(basePath, dir) {
  console.log(`Installing dependencies in ${dir}...`);
  const cwd = join(basePath, dir);

  return new Promise((resolve, reject) => {
    const child = spawn("npm", ["install"], {
      cwd,
      stdio: "inherit",
      shell: true,
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`npm install failed in ${cwd}`));
    });
  });
}

function runPublishYalc(basePath, dir) {
  console.log(`Publish yalc in ${dir}...`);
  const cwd = join(basePath, dir);

  return new Promise((resolve, reject) => {
    const child = spawn("npm", ["run", "yalc:publish"], {
      cwd,
      stdio: "inherit",
      shell: true,
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`npm run yalc:publish failed in ${cwd}`));
    });
  });
}

// Example usage
installNodeProjects("./").catch(console.error);
