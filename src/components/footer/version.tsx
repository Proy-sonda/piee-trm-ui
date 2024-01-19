import { existsSync } from 'fs';
import { readFile, readdir } from 'fs/promises';
import path from 'path';

export default async function Version() {
  let version = 'DESARROLLO';
  const rutaArchivoInformacionApp = path.join(process.cwd(), 'public', 'appinfo.json');
  const archivos = await readdir(path.join(process.cwd(), 'public'));
  const existeArchivoDeVersion = existsSync(rutaArchivoInformacionApp);

  if (existeArchivoDeVersion) {
    const appInfoJSON = await readFile(rutaArchivoInformacionApp, 'utf-8');
    const appInfo = JSON.parse(appInfoJSON);
    version = appInfo.version ?? 'VERSIÓN NO GENERADA';
  }

  return (
    <>
      <span style={{ display: 'none' }}>
        {JSON.stringify({ rutaArchivoInformacionApp, archivos, existeArchivoDeVersion })}
      </span>
      <div className="mt-2 text-center text-secondary">Versión: {version}</div>
    </>
  );
}
