export interface TipoDocumento {
  idtipoadjunto: number;
  tipoadjunto: string;
}

export const esDocumentoDiatDiep = ({ idtipoadjunto }: TipoDocumento) => {
  return idtipoadjunto === 5;
};
