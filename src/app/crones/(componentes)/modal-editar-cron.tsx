import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import { emptyFetch, useFetch } from '@/hooks/use-merge-fetch';
import { AlertaError, AlertaExito } from '@/utilidades/alertas';
import { useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { FormularioEditarCron } from '../(modelos)';
import { FormatoFrecuenciaIncorrectoError, actualizarCron, buscarCronPorId } from '../(servicios)';
import { InputDescripcionCron } from './input-descripcion-cron';
import { InputFrecuenciaCron } from './input-frecuencia-cron';

interface ModalEditarCronProps {
  show: boolean;
  idCron?: number;
  onCronEditado: () => void;
  onCerrarModal: () => void;
}

export const ModalEditarCron: React.FC<ModalEditarCronProps> = ({
  show,
  idCron,
  onCronEditado,
  onCerrarModal,
}) => {
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const [errorCargarCron, cronPorEditar, cargandoCron] = useFetch(
    idCron ? buscarCronPorId(idCron) : emptyFetch(),
    [idCron],
  );

  const formulario = useForm<FormularioEditarCron>({ mode: 'onBlur' });

  // Parchar fomulario
  useEffect(() => {
    if (cargandoCron || !cronPorEditar || errorCargarCron) {
      return;
    }

    formulario.setValue('codigo', cronPorEditar.codigo);
    formulario.setValue('descripcion', cronPorEditar.descripcion);
    formulario.setValue('frecuencia', cronPorEditar.frecuencia);
  }, [cronPorEditar, cargandoCron, errorCargarCron]);

  const handleCerrarModal = () => {
    formulario.clearErrors();
    onCerrarModal();
  };

  const actualizarCronHandler: SubmitHandler<FormularioEditarCron> = async (data) => {
    if (!idCron) {
      throw new Error('No se tiene el ID del cron por editar');
    }

    try {
      setMostrarSpinner(true);

      await actualizarCron({ ...data, idCron });

      AlertaExito.fire({ html: `Proceso <b>${data.codigo}</b> configurado correctamente` });

      onCronEditado();

      handleCerrarModal();
    } catch (error) {
      if (error instanceof FormatoFrecuenciaIncorrectoError) {
        formulario.setError('frecuencia', {
          message: 'Formato incorrecto',
          type: 'validate',
        });
        return;
      }

      AlertaError.fire({
        title: 'Error',
        html: `Hubo un problema al configurar el proceso <b>${data.codigo}</b>`,
      });
    } finally {
      setMostrarSpinner(false);
    }
  };

  return (
    <>
      <Modal backdrop="static" size="sm" centered show={show} keyboard={false}>
        <Modal.Header closeButton onClick={handleCerrarModal}>
          <Modal.Title className="fs-5">Configurar Proceso</Modal.Title>
        </Modal.Header>

        <FormProvider {...formulario}>
          <form onSubmit={formulario.handleSubmit(actualizarCronHandler)}>
            <Modal.Body>
              <IfContainer show={cargandoCron || mostrarSpinner}>
                <div className="my-5">
                  <LoadingSpinner titulo="Cargando..." />
                </div>
              </IfContainer>

              <IfContainer show={!(cargandoCron || mostrarSpinner) && errorCargarCron}>
                <h4 className="my-4 text-center">Error al cargar datos del proceso</h4>
              </IfContainer>

              <IfContainer show={!(cargandoCron || mostrarSpinner) && !errorCargarCron}>
                <div className="row g-3 align-items-baseline">
                  <Form.Group controlId="codigoCron">
                    <Form.Label>Código</Form.Label>
                    <Form.Control type="text" disabled={true} {...formulario.register('codigo')} />
                  </Form.Group>

                  <InputFrecuenciaCron name="frecuencia" label="Frecuencia" />

                  <InputDescripcionCron opcional name="descripcion" label="Descripción" />
                </div>
              </IfContainer>
            </Modal.Body>

            <Modal.Footer>
              <div className="w-100 d-flex flex-column flex-md-row flex-md-row-reverse">
                <button type="submit" className="btn btn-primary">
                  Grabar
                </button>

                <button
                  type="button"
                  className="btn btn-danger mt-2 mt-md-0 me-0 me-md-2"
                  onClick={handleCerrarModal}>
                  Volver
                </button>
              </div>
            </Modal.Footer>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
};
