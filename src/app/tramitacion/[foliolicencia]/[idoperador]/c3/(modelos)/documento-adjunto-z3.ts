import { TipoDocumento } from '../../(modelo)/tipo-documento';

export type DocumentoAdjuntoZ3 = DocumentoNuevoZ3;

interface DocumentoNuevoZ3 {
  tipoDocumento: TipoDocumento;
  documento: File;
}
