import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { fileToBase64 } from '@/utilidades/file-to-base64';
import { DocumentoAdjuntoZ3 } from '../(modelos)/documento-adjunto-z3';

interface SubirDocumentosZ3Request {
  codigoOperador: number;
  folioLicencia: string;
  documentos: DocumentoAdjuntoZ3[];
}

export const subirDocumentosZ3 = async (request: SubirDocumentosZ3Request) => {
  const payloadPromise = request.documentos.map(async ({ tipoDocumento, documento }) => ({
    name: documento.name,
    codigooperador: request.codigoOperador,
    foliolicencia: request.folioLicencia,
    idtipoadjunto: tipoDocumento.idtipoadjunto,
    base64: await fileToBase64(documento),
  }));

  const payload = { documentos: await Promise.all(payloadPromise) };

  await runFetchConThrow<void>(`${urlBackendTramitacion()}/licencia/zona3/upload`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};
