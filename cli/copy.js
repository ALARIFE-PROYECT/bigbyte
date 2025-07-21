const fs = require('fs');
const path = require('path');

const sourceDirArgv = process.argv[2];
const destDirArgv = process.argv[3];

if(!sourceDirArgv || !destDirArgv) {
    console.log('Please enter the source and destination folder path.');
    process.exit(1);
}

// Ruta de la carpeta de origen y destino
const sourceDir = path.join(__dirname, sourceDirArgv);
const destDir = path.join(__dirname, destDirArgv);

// Función para copiar archivos
function copyFileSync(source, target) {
  let targetFile = target;

  // Si el destino es una carpeta, añade el nombre del archivo al destino
  if (fs.existsSync(target) && fs.lstatSync(target).isDirectory()) {
    targetFile = path.join(target, path.basename(source));
  }

  fs.copyFileSync(source, targetFile);
}

copyFileSync(sourceDir, destDir);

console.log('Contenido copiado con éxito!');
console.log();
