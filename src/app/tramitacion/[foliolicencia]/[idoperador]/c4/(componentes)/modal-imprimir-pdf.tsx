import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { LicenciaC1 } from '../../c1/(modelos)';
import { buscarZona0, buscarZona1 } from '../../c1/(servicios)';
import { buscarZona2 } from '../../c2/(servicios)/buscar-z2';
import { buscarZona3 } from '../../c3/(servicios)/buscar-z3';

interface IModalImprimirPdfProps {
  foliolicencia: string;
  idOperadorNumber: number;
  modalimprimir: boolean;
  setmodalimprimir: (modal: boolean) => void;
  refrescarZona4: () => void;
  refresh: boolean;
}

const ModalImprimirPdf: React.FC<IModalImprimirPdfProps> = ({
  foliolicencia,
  idOperadorNumber,
  modalimprimir,
  setmodalimprimir,
  refrescarZona4,
  refresh,
}) => {
  const [zona1, setzona1] = useState<LicenciaC1 | undefined>();

  const [errorCargaZona, zonas, cargandoZonas] = useMergeFetchObject(
    {
      zona0: buscarZona0(foliolicencia, idOperadorNumber),
      zona2: buscarZona2(foliolicencia, idOperadorNumber),
      zona3: buscarZona3(foliolicencia, idOperadorNumber),
    },
    [refresh],
  );
  useEffect(() => {
    const BusquedaZona1 = async () => {
      const data = await buscarZona1(foliolicencia, idOperadorNumber);
      if (data !== undefined) setzona1(data);
    };
    BusquedaZona1();
    refrescarZona4();
  }, []);
  return (
    <Modal show={modalimprimir} size="xl" centered>
      <Modal.Header closeButton onClick={() => setmodalimprimir(!modalimprimir)}>
        <Modal.Title>Imprimir</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <LoadingSpinner titulo="Cargando información..." /> */}
        <div className="row">
          <div className="col-md-6">
            <label>
              <b>RUT Entidad Empleadora: </b>
              {zona1?.rutempleador}
            </label>
          </div>
          <div className="col-md-6">
            <label>
              <b>Calidad de la Persona Trabajadora: </b>
              {zonas?.zona2.calidadtrabajador.calidadtrabajador}
            </label>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label>
              <b>RUN: {zonas?.zona0.ruttrabajador}</b>
            </label>
          </div>
          <div className="col-md-6">
            <b>Folio LME: </b>
            {zona1?.foliolicencia}
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label>
              <b>Nombre: </b>
              {zonas?.zona0.nombres +
                ' ' +
                zonas?.zona0.apellidopaterno +
                ' ' +
                zonas?.zona0.apellidomaterno}
            </label>
          </div>
          <div className="col-md-6">
            <label>
              <b>Fecha Primera Afiliación: </b>{' '}
              {format(new Date(zonas?.zona2.fechaafiliacion ?? '01/10/2022'), 'dd/MM/yyyy')}
            </label>
          </div>
        </div>
        <object type="application/pdf">
          <div>Prueba de documento a imprimir</div>
        </object>
      </Modal.Body>
    </Modal>
  );
};

export default ModalImprimirPdf;
