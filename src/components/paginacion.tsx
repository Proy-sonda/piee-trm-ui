import React from 'react';
import ReactPaginate from 'react-paginate';

interface PaginacionProps {
  paginaActual: number;
  numeroDePaginas: number;
  tamano?: 'sm' | 'md' | 'lg';
  onCambioPagina: (paginaSeleccionada: number) => void;
}

const Paginacion: React.FC<PaginacionProps> = ({
  paginaActual,
  numeroDePaginas,
  tamano,
  onCambioPagina,
}) => {
  return (
    <ReactPaginate
      breakLabel="..."
      previousLabel="Anterior"
      nextLabel="Siguiente"
      onPageChange={(x) => onCambioPagina(x.selected)}
      pageCount={numeroDePaginas}
      renderOnZeroPageCount={null}
      containerClassName={
        !tamano || tamano === 'md' ? 'pagination' : `pagination pagination-${tamano}`
      }
      forcePage={paginaActual}
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
