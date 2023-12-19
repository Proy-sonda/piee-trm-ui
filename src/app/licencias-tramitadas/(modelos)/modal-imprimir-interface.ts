export interface ModalImprimirPdfProps {
  foliolicencia: string;
  idOperadorNumber: number;
  onComprobanteGenerado: () => void | Promise<void>;

  modalimprimir?: boolean;
  setmodalimprimir?: (modal: boolean) => void;
  refrescarZona4?: () => void;
  refresh?: boolean;
  setCargaPDF?: (carga: boolean) => void;
  actualizaTramitacion?: boolean;
}
