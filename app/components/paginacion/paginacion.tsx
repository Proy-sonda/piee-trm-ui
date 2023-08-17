import ReactPaginate from 'react-paginate';

interface PaginacionProps {
  totalPages: number;
  tamano?: 'sm' | 'md' | 'lg';
  onCambioPagina: (paginaSeleccionada: number) => void;
}

export default function Paginacion({ totalPages, tamano, onCambioPagina }: PaginacionProps) {
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
}
