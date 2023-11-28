export interface ModalImprimirPdfProps {
  foliolicencia: string;
  idOperadorNumber: number;
  modalimprimir: boolean;
  setmodalimprimir: (modal: boolean) => void;
  refrescarZona4: () => void;
  refresh: boolean;
  setCargaPDF: (carga: boolean) => void;
  actualizaTramitacion?: boolean;
}
