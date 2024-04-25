require('dotenv').config();
const { execSync } = require('child_process');
const { format } = require('date-fns');
const { writeFileSync } = require('fs');

const RUTA_ARCHIVO_INFORMACION_APP = 'public/appinfo.json';

function main() {
  const instanteCompilacion = new Date();
  const APP_INFO = {
    version: crearVersion(instanteCompilacion),
    fechaCompilacion: instanteCompilacion.toISOString(),
  };

  console.log('Generando archivo con información de la aplicación');

  writeFileSync(RUTA_ARCHIVO_INFORMACION_APP, Buffer.from(JSON.stringify(APP_INFO)));

  console.log('Archivo con información de la aplicación generado');
}

function crearVersion(instanteCompilacion) {
  let version = `${format(instanteCompilacion, 'yyyyMMdd')}`;

  if (comandoExiste('git --help')) {
    const ultimoCommit = execSync('git rev-parse --short HEAD').toString().trim();
    version += `.${ultimoCommit}`;
  }

  return process.env.NEXT_PUBLIC_APP_VERSION
    ? `${process.env.NEXT_PUBLIC_APP_VERSION} [${version}]`
    : version;
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
