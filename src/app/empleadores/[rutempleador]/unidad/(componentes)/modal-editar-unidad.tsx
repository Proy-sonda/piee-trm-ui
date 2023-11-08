import { useEmpleadorActual } from '@/app/empleadores/(contexts)/empleador-actual-context';
import { buscarCalle } from '@/app/tramitacion/[foliolicencia]/[idoperador]/(servicios)/tipo-calle';
import {
  ComboComuna,
  ComboSimple,
  InputBlockDepartamento,
  InputCalle,
  InputNumero,
  InputTelefono,
} from '@/components/form';
import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { AuthContext } from '@/contexts';
import { emptyFetch, useFetch, useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { AlertaError, AlertaExito } from '@/utilidades/alertas';
import { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Unidadesrrhh } from '../(modelos)/payload-unidades';
import { actualizarUnidad } from '../(servicios)/actualizar-unidad';
import { buscarUnidadPorId } from '../(servicios)/buscar-unidad-por-id';
import { buscarComunas } from '../../../(servicios)/buscar-comunas';
import { buscarRegiones } from '../../../(servicios)/buscar-regiones';
import { InputIdentificadorUnidadRRHH } from './input-identificador-unidad-rrhh';
import { InputNombreUnidadRRHH } from './input-nombre-unidad-rrhh';

interface ModalEditarUnidadProps {
  show: boolean;
  rutempleador: string;
  idUnidad?: string;
  onUnidadRRHHEditada: () => void;
  onCerrarModal: () => void;
}

const ModalEditarUnidad: React.FC<ModalEditarUnidadProps> = ({
  show,
  rutempleador,
  idUnidad,
  onUnidadRRHHEditada,
  onCerrarModal,
}) => {
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const [erroresCargarCombos, combos, cargandoCombos] = useMergeFetchObject({
    CCREGION: buscarRegiones(),
    CCCOMUNA: buscarComunas(),
    TIPOCALLE: buscarCalle(),
  });

  const [errorCargarUnidad, unidadRRHH, cargandoUnidad] = useFetch(
    idUnidad ? buscarUnidadPorId(idUnidad.toString()) : emptyFetch(),
    [idUnidad],
  );

  const { empleadorActual } = useEmpleadorActual();
  const { usuario } = useContext(AuthContext);

  const formulario = useForm<Unidadesrrhh>({ mode: 'onBlur' });

  const regionSeleccionada = formulario.watch('codigoregion');

  // Parchar fomulario
  useEffect(() => {
    if (
      cargandoCombos ||
      cargandoUnidad ||
      !unidadRRHH ||
      erroresCargarCombos.length > 0 ||
      errorCargarUnidad
    ) {
      return;
    }

    setMostrarSpinner(true);

    formulario.setValue('glosaunidadrrhh', unidadRRHH.glosaunidadrrhh);
    formulario.setValue('codigoregion', unidadRRHH.codigoregion);
    formulario.setValue('direccion', unidadRRHH.direccion);
    formulario.setValue('numero', unidadRRHH.numero);
    formulario.setValue('blockdepto', unidadRRHH.blockdepto);
    formulario.setValue('codigounidadrrhh', unidadRRHH.codigounidadrrhh);
    formulario.setValue('telefono', unidadRRHH.telefono);
    formulario.setValue('codigotipocalle', unidadRRHH.codigotipocalle);
    formulario.setValue('codigocomuna', unidadRRHH.codigocomuna);

    /* NOTA: Hay que darle un timeout antes de parchar la comuna. Puede ser porque react necesita
     * un tiempo para actualizar el combo de comunas al parchar la region. */
    setTimeout(() => {
      formulario.setValue('codigocomuna', unidadRRHH.codigocomuna);
      setMostrarSpinner(false);
    }, 1000);
  }, [cargandoCombos, unidadRRHH]);

  const handleCerrarModal = () => {
    formulario.clearErrors();
    onCerrarModal();
  };

  const editarUnidadDeRRHH: SubmitHandler<Unidadesrrhh> = async (data) => {
    if (!idUnidad) {
      throw new Error('NO SE TIENE EL ID DE LA UNIDAD');
    }

    try {
      setMostrarSpinner(true);

      if (empleadorActual == undefined || usuario == undefined) return;

      await actualizarUnidad(data, empleadorActual.rutempleador, usuario.rut);

      AlertaExito.fire({ text: 'Unidad fue actualizada con éxito' });

      onUnidadRRHHEditada();

      handleCerrarModal();
    } catch (error) {
      AlertaError.fire({
        title: 'Error',
        text: 'Hubo un problema al actualizar la unidad, por favor contactar a un administrador',
      });
    } finally {
      setMostrarSpinner(false);
    }
  };

  return (
    <>
      <IfContainer show={mostrarSpinner}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <Modal backdrop="static" size="xl" centered show={show} keyboard={false}>
        <Modal.Header closeButton onClick={handleCerrarModal}>
          <Modal.Title className="fs-5">Modificar Unidad RRHH</Modal.Title>
        </Modal.Header>

        <FormProvider {...formulario}>
          <form onSubmit={formulario.handleSubmit(editarUnidadDeRRHH)}>
            <Modal.Body>
              <IfContainer show={cargandoCombos || cargandoUnidad}>
                <div className="my-5">
                  <LoadingSpinner titulo="Cargando..." />
                </div>
              </IfContainer>

              <IfContainer
                show={!(cargandoCombos || cargandoUnidad) && erroresCargarCombos.length > 0}>
                <div className="modal-body">
                  <h4 className="my-4 text-center">Error al cargar combos</h4>
                </div>
              </IfContainer>

              <IfContainer show={!(cargandoCombos || cargandoUnidad) && errorCargarUnidad}>
                <div className="modal-body">
                  <h4 className="my-4 text-center">Error al cargar la unidad de RRHH</h4>
                </div>
              </IfContainer>

              <IfContainer
                show={
                  !(cargandoCombos || cargandoUnidad) &&
                  !errorCargarUnidad &&
                  erroresCargarCombos.length === 0
                }>
                <div className="row mt-2 g-3 align-items-baseline">
                  <InputIdentificadorUnidadRRHH
                    name="codigounidadrrhh"
                    label="Código Unidad"
                    className="col-12 col-lg-6 col-xl-3"
                  />

                  <InputNombreUnidadRRHH
                    name="glosaunidadrrhh"
                    label="Nombre"
                    className="col-12 col-lg-6 col-xl-3"
                  />

                  <ComboSimple
                    name="codigoregion"
                    label="Región"
                    datos={combos?.CCREGION}
                    idElemento="idregion"
                    descripcion="nombre"
                    className="col-12 col-lg-6 col-xl-3"
                    tipoValor="string"
                  />

                  <ComboComuna
                    label="Comuna"
                    name="codigocomuna"
                    comunas={combos?.CCCOMUNA}
                    regionSeleccionada={regionSeleccionada}
                    className="col-12 col-lg-6 col-xl-3"
                  />

                  <ComboSimple
                    label="TIpo Calle"
                    name="codigotipocalle"
                    datos={combos?.TIPOCALLE}
                    descripcion={'tipocalle'}
                    idElemento={'idtipocalle'}
                    className="col-12 col-lg-6 col-xl-3"
                  />

                  <InputCalle name="direccion" label="Calle" className="col-12 col-lg-6 col-xl-3" />

                  <InputNumero name="numero" label="Número" className="col-12 col-lg-6 col-xl-3" />

                  <InputBlockDepartamento
                    opcional
                    name="blockdepto"
                    label="Departamento"
                    className="col-12 col-lg-6 col-xl-3"
                  />

                  <InputTelefono
                    name="telefono"
                    label="Teléfono"
                    className="col-12 col-lg-6 col-xl-3"
                  />
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
                  className="btn btn-danger   mt-2 mt-md-0 me-0 me-md-2"
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

export default ModalEditarUnidad;
