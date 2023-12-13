const { execSync } = require('child_process');
const { format } = require('date-fns');
const { writeFileSync } = require('fs');

const RUTA_ARCHIVO_INFORMACION_APP = 'public/appinfo.json';

function main() {
  const APP_INFO = {
    version: crearVersion(),
  };
  
  console.log('Generando archivo con información de la aplicación');
  
  writeFileSync(RUTA_ARCHIVO_INFORMACION_APP, Buffer.from(JSON.stringify(APP_INFO)));
  
  console.log('Archivo con información de la aplicación generado');
}

function crearVersion() {
  let version = `${format(Date.now(), 'yyyyMMss')}`;

  if (comandoExiste('git --help')) {
    const ultimoCommit = execSync('git rev-parse --short HEAD').toString().trim();
    version += `.${ultimoCommit}`;
  }

  return version;
}

function comandoExiste(comando) {
  try {
    execSync(comando);
    return true;
  } catch (error) {
    return false;
  }
}

main();