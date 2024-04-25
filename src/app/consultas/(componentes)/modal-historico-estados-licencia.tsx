import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import { emptyFetch, useFetch } from '@/hooks';
import { HttpError } from '@/servicios';
import { format } from 'date-fns';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { BuscarHistorialEstadosLmeRequest, buscarHistorialEstadosLicencia } from '../(servicios)';

interface ModalHistoricoEstadoLicenciaProps {
  show: boolean;
  datosLicencia?: BuscarHistorialEstadosLmeRequest;
  onCerrar: () => void;
}

export const ModalHistoricoEstadoLicencia: React.FC<ModalHistoricoEstadoLicenciaProps> = ({
  show,
  datosLicencia,
  onCerrar,
}) => {
  const [erroresInfoLicencia, estadoLME, cargandoInfoLicencia] = useFetch(
    datosLicencia ? buscarHistorialEstadosLicencia(datosLicencia) : emptyFetch(),
    [datosLicencia],
  );

  const handleOnCerrar = () => {
    onCerrar();
  };

  return (
    <>
      <Modal backdrop="static" size="lg" centered show={show} onHide={() => handleOnCerrar()}>
        <Modal.Header closeButton>
          <Modal.Title>Histórico de Estados</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <IfContainer show={cargandoInfoLicencia}>
            <div className="my-5">
              <LoadingSpinner />
            </div>
          </IfContainer>

          <IfContainer show={!cargandoInfoLicencia && erroresInfoLicencia}>
            <h1 className="my-5 fs-5 text-center">
              {(() => {
                if (
                  erroresInfoLicencia instanceof HttpError &&
                  erroresInfoLicencia.status === 404
                ) {
                  return `La licencia con folio ${datosLicencia?.folioLicencia} no existe en el operador.`;
                } else {
                  return 'Hubo un error al cargar los estados de la licencia';
                }
              })()}
            </h1>
          </IfContainer>

          <IfContainer show={!cargandoInfoLicencia && !erroresInfoLicencia}>
            <table className="table table-striped table-hover ">
              <thead>
                <tr className={`text-center`}>
                  <th>ESTADO</th>
                  <th>FECHA</th>
                </tr>
              </thead>
              <tbody>
                {estadoLME && estadoLME.listaestados.length > 0 ? (
                  estadoLME.listaestados.map((listaEstado) => (
                    <tr
                      key={`${listaEstado.fechaevento}/${listaEstado.idestadolicencia}`}
                      className="text-center align-middle">
                      <td>
                        <div className="mb-1 small text-nowrap">
                          {listaEstado.idestadolicencia} - {listaEstado.estadolicencia}
                        </div>
                      </td>
                      <td>{format(new Date(listaEstado.fechaevento), 'dd/MM/yyyy HH:mm:ss')}</td>
                    </tr>
                  ))
                ) : (
                  <tr className={`text-center`}>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                )}
              </tbody>
            </table>
          </IfContainer>
        </Modal.Body>

        <Modal.Footer>
          <div className="d-flex justify-content-end">
            <button className="btn btn-danger" onClick={() => handleOnCerrar()}>
              Volver
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
