import { versionApp } from '@/servicios';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';

export default async function Version() {
  const rutaArchivoInformacionApp = path.join(process.cwd(), 'public', 'appinfo.json');

  let version = '';
  let versionConHash = '';
  if (existsSync(rutaArchivoInformacionApp)) {
    const appInfoJSON = await readFile(rutaArchivoInformacionApp, 'utf-8');
    const appInfo = JSON.parse(appInfoJSON);
    versionConHash = appInfo.version ?? versionApp();
  } else {
    version = versionApp();
  }

  if (versionConHash) {
    version = versionConHash.split(' ')[0];
  }

  return (
    <>
      <div className="mt-2 text-center text-secondary">
        Versión: {version} &nbsp;<p style={{ display: 'none' }}>{versionConHash.split(' ')[1]}</p>
      </div>
    </>
  );
}
