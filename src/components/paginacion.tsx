import React from 'react';
import ReactPaginate from 'react-paginate';

interface PaginacionProps {
  totalPages: number;
  tamano?: 'sm' | 'md' | 'lg';
  onCambioPagina: (paginaSeleccionada: number) => void;
}

const Paginacion: React.FC<PaginacionProps> = ({ totalPages, tamano, onCambioPagina }) => {
  return (
    <ReactPaginate
      breakLabel="..."
      previousLabel="Anterior"
      nextLabel="Siguiente"
      onPageChange={(x) => onCambioPagina(x.selected)}
      pageCount={totalPages}
      renderOnZeroPageCount={null}
      containerClassName={
        !tamano || tamano === 'md' ? 'pagination' : `pagination pagination-${tamano}`
      }
      activeClassName="active"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      nextClassName="page-item"
      nextLinkClassName="page-link"
      disabledClassName="disabled"
    />
  );
};

export default Paginacion;
