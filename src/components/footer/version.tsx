import { versionApp } from '@/servicios';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';

export default async function Version() {
  const rutaArchivoInformacionApp = path.join(process.cwd(), 'public', 'appinfo.json');

  let version = '';
  if (existsSync(rutaArchivoInformacionApp)) {
    const appInfoJSON = await readFile(rutaArchivoInformacionApp, 'utf-8');
    const appInfo = JSON.parse(appInfoJSON);
    version = appInfo.version ?? versionApp();
  } else {
    version = versionApp();
  }

  return (
    <>
      <div className="mt-2 text-center text-secondary">Versión: {version}</div>
    </>
  );
}
