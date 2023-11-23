export type DocumentoAdjuntoZ3 = DocumentoNuevoZ3 | DocumentoGuardadoZ3;

export interface DocumentoNuevoZ3 {
  idtipoadjunto: number;
  documento: File;
}

export interface DocumentoGuardadoZ3 {
  codigooperador: number;
  foliolicencia: string;
  urladjunto: string;
  idadjunto: string;
  nombrelocal: string;
  nombreremoto: string;
  repositorio: string;
  idtipoadjunto: number;
  idpiielicenciaszc3adjuntos: number;
}

export const esDocumentoNuevoZ3 = (doc: DocumentoAdjuntoZ3): doc is DocumentoNuevoZ3 => {
  return 'documento' in doc && doc.documento instanceof File;
};

export const nombreDocumentoAdjunto = (doc: DocumentoAdjuntoZ3) => {
  return esDocumentoNuevoZ3(doc) ? doc.documento.name : doc.nombrelocal;
};
