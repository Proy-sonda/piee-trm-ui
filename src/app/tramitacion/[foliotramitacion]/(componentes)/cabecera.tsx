import { Stepper } from '@/components/stepper/stepper';
import Titulo from '@/components/titulo/titulo';

interface myprops {
  foliotramitacion: string;
  step: any[];
  title: string;
}

const Cabecera: React.FC<myprops> = ({ foliotramitacion, step, title }) => {
  return (
    <>
      <div className="row mt-5">
        <Titulo url="">Tramitación / Tramitar</Titulo>
      </div>
      <div className="row mt-2">
        <div className="col-md-12 col-lg-12">
          <p>
            Licencia otorgada el día <b>29/05/2023</b> en plataforma operador <b>MEDIPASS</b> con
            Folio <b>{foliotramitacion}</b> por <b>ENFERMEDAD O ACCIDENTE COMUN</b>, a la persona
            trabajadora <b>11179371-9 MARISOL VIVIANA SOTO GARCÉS</b> estableciendo{' '}
            <b>Reposo Total</b> por <b>30 días(s)</b> desde <b>29/05/2022 </b>
            al <b>28/06/2022</b>
          </p>
        </div>
      </div>
      <div className="row me-5">
        <div className="mt-3 mb-4 mx-0 mx-md-5">
          <Stepper Options={step} />
        </div>
      </div>
      <div className="row mt-2">
        <h5>{title}</h5>
        <hr />
      </div>
    </>
  );
};

export default Cabecera;
