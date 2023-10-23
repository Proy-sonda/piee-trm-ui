import {
  ComboComuna,
  ComboSimple,
  InputBlockDepartamento,
  InputCalle,
  InputEmail,
  InputNumero,
  InputTelefono,
} from '@/components/form';
import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { emptyFetch, useFetch, useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { AlertaDeError, AlertaDeExito } from '@/utilidades/alertas';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { FormularioEditarUnidadRRHH } from '../(modelos)/formulario-editar-unidad-rrhh';
import { actualizarUnidad } from '../(servicios)/actualizar-unidad';
import { buscarUnidadPorId } from '../(servicios)/buscar-unidad-por-id';
import { buscarComunas } from '../../../(servicios)/buscar-comunas';
import { buscarRegiones } from '../../../(servicios)/buscar-regiones';
import { InputIdentificadorUnidadRRHH } from './input-identificador-unidad-rrhh';
import { InputNombreUnidadRRHH } from './input-nombre-unidad-rrhh';

interface ModalEditarUnidadProps {
  show: boolean;
  idEmpleador: number;
  idUnidad?: number;
  onUnidadRRHHEditada: () => void;
  onCerrarModal: () => void;
}

const ModalEditarUnidad: React.FC<ModalEditarUnidadProps> = ({
  show,
  idEmpleador,
  idUnidad,
  onUnidadRRHHEditada,
  onCerrarModal,
}) => {
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const [erroresCargarCombos, combos, cargandoCombos] = useMergeFetchObject({
    CCREGION: buscarRegiones(),
    CCCOMUNA: buscarComunas(),
  });

  const [errorCargarUnidad, unidadRRHH, cargandoUnidad] = useFetch(
    idUnidad ? buscarUnidadPorId(idUnidad) : emptyFetch(),
    [idUnidad],
  );

  const formulario = useForm<FormularioEditarUnidadRRHH>({ mode: 'onBlur' });

  const regionSeleccionada = formulario.watch('regionId');

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

    formulario.setValue('nombre', unidadRRHH.unidad);
    formulario.setValue('regionId', unidadRRHH.direccionunidad.comuna.region.idregion);
    formulario.setValue('calle', unidadRRHH.direccionunidad.calle);
    formulario.setValue('numero', unidadRRHH.direccionunidad.numero);
    formulario.setValue('departamento', unidadRRHH.direccionunidad.depto);
    formulario.setValue('identificadorUnico', unidadRRHH.identificador);
    formulario.setValue('telefono', unidadRRHH.telefono);
    formulario.setValue('email', unidadRRHH.email);
    formulario.setValue('emailConfirma', unidadRRHH.email);

    formulario.setValue('comunaId', unidadRRHH.direccionunidad.comuna.idcomuna);

    /* NOTA: Hay que darle un timeout antes de parchar la comuna. Puede ser porque react necesita
     * un tiempo para actualizar el combo de comunas al parchar la region. */
    setTimeout(() => {
      formulario.setValue('comunaId', unidadRRHH.direccionunidad.comuna.idcomuna);
      setMostrarSpinner(false);
    }, 1000);
  }, [cargandoCombos, unidadRRHH]);

  const handleCerrarModal = () => {
    formulario.clearErrors();
    onCerrarModal();
  };

  const editarUnidadDeRRHH: SubmitHandler<FormularioEditarUnidadRRHH> = async (data) => {
    if (!idUnidad) {
      throw new Error('NO SE TIENE EL ID DE LA UNIDAD');
    }

    try {
      setMostrarSpinner(true);

      await actualizarUnidad({
        nombre: data.nombre,
        regionId: data.regionId,
        comunaId: data.comunaId,
        calle: data.calle,
        numero: data.numero,
        departamento: data.departamento,
        identificadorUnico: data.identificadorUnico,
        telefono: data.telefono,
        email: data.email,
        emailConfirma: data.emailConfirma,
        empleadorId: idEmpleador,
        unidadId: idUnidad,
      });

      AlertaDeExito.fire({ text: 'Unidad fue actualizada con éxito' });

      onUnidadRRHHEditada();

      handleCerrarModal();
    } catch (error) {
      AlertaDeError.fire({
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
                    name="identificadorUnico"
                    label="Identificador Único"
                    className="col-12 col-lg-6 col-xl-3"
                  />

                  <InputNombreUnidadRRHH
                    name="nombre"
                    label="Nombre"
                    className="col-12 col-lg-6 col-xl-3"
                  />

                  <ComboSimple
                    name="regionId"
                    label="Región"
                    datos={combos?.CCREGION}
                    idElemento="idregion"
                    descripcion="nombre"
                    className="col-12 col-lg-6 col-xl-3"
                    tipoValor="string"
                  />

                  <ComboComuna
                    label="Comuna"
                    name="comunaId"
                    comunas={combos?.CCCOMUNA}
                    regionSeleccionada={regionSeleccionada}
                    className="col-12 col-lg-6 col-xl-3"
                  />

                  <InputCalle name="calle" label="Calle" className="col-12 col-lg-6 col-xl-3" />

                  <InputNumero name="numero" label="Número" className="col-12 col-lg-6 col-xl-3" />

                  <InputBlockDepartamento
                    name="departamento"
                    label="Departamento"
                    className="col-12 col-lg-6 col-xl-3"
                  />

                  <InputTelefono
                    name="telefono"
                    label="Teléfono"
                    className="col-12 col-lg-6 col-xl-3"
                  />

                  <InputEmail
                    name="email"
                    label="Correo electrónico unidad RRHH"
                    className="col-12 col-lg-6 col-xl-3"
                  />

                  <InputEmail
                    name="emailConfirma"
                    debeCoincidirCon="email"
                    label="Repetir correo electrónico"
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
