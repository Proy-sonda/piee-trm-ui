import { useWindowSize } from '@/hooks/use-window-size';
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
  const [ancho] = useWindowSize();

  return (
    <div className="overflow-auto">
      <ReactPaginate
        breakLabel="..."
        previousLabel={ancho < 576 ? '«' : 'Anterior'}
        nextLabel={ancho < 576 ? '»' : 'Siguiente'}
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
    </div>
  );
};

export default Paginacion;
