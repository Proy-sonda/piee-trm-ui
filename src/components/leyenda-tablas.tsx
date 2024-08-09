interface LeyendaTablasProps {
  paginaActual: number;
  totalMostrado: number;
  totalDatos: number;
  glosaLeyenda: string;
}

/**
 * Componente que muestra la leyenda de las tablas.
 *
 * @component
 * @param {Object} props - Las propiedades del componente.
 * @param {number} props.totalDatos - El total de datos.
 * @param {number} props.paginaActual - La página actual.
 * @param {string} props.glosaLeyenda - La glosa de la leyenda.
 * @param {number} props.totalMostrado - El total mostrado.
 * @returns {JSX.Element} El componente de la leyenda de las tablas.
 */
const LeyendaTablas: React.FC<LeyendaTablasProps> = ({
  totalDatos,
  paginaActual,
  glosaLeyenda,
  totalMostrado,
}) => {
  return (
    <>
      {totalDatos > 0 && (
        <div>
          Mostrando desde <b>{paginaActual * 5 + 1}</b> a <b>{paginaActual * 5 + totalMostrado}</b>{' '}
          de <b>{totalDatos}</b> {glosaLeyenda}
        </div>
      )}
    </>
  );
};

export default LeyendaTablas;
