import Link from 'next/link';
import styles from './Position.module.css';

type MyAppProps = {
  position: number;
};

const Position: React.FC<MyAppProps> = ({ position }) => {
  return (
    <div
      className="row text-center"
      style={{
        backgroundColor: 'white',
        marginLeft: '0.5px',
        marginRight: '0.5px',
        padding: '5px',
      }}>
      <div className={`col-md-3`}>
        <Link href={'/tramitacion'}>
          <label
            className={`mt-2 form-label ${position === 1 && styles.pactive} ${styles.linkpoint}`}>
            Bandeja de Tramitación
          </label>
        </Link>
      </div>
      <div className="col-md-3">
        <Link href={'/tramitacion/tramitadas'}>
          <label
            className={`mt-2 form-label ${position === 2 && styles.pactive} ${styles.linkpoint}`}>
            Licencias Tramitadas
          </label>
        </Link>
      </div>
      <div className="col-md-3">
        <Link href={'/tramitacion/consultas'}>
          <label
            className={`mt-2 form-label ${position === 3 && styles.pactive} ${styles.linkpoint}`}>
            Consultas
          </label>
        </Link>
      </div>
      <div className="col-md-3">
        <Link href={'/empleadores'}>
          <label
            className={`mt-2 form-label ${position === 4 && styles.pactive} ${styles.linkpoint}`}>
            Datos Entidades Empleadoras
          </label>
        </Link>
      </div>

      <hr />
    </div>
  );
};

export default Position;
