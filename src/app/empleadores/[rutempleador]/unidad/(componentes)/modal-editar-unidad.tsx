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
import { AuthContext } from '@/contexts';
import { emptyFetch, useFetch, useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { buscarUnidadesDeRRHH } from '@/servicios';
import { AlertaError, AlertaExito } from '@/utilidades/alertas';
import { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Unidadesrrhh } from '../(modelos)/payload-unidades';
import { actualizarUnidad } from '../(servicios)/actualizar-unidad';
import { buscarComunas } from '../../../(servicios)/buscar-comunas';
import { buscarRegiones } from '../../../(servicios)/buscar-regiones';
import { InputIdentificadorUnidadRRHH } from './input-identificador-unidad-rrhh';
import { InputNombreUnidadRRHH } from './input-nombre-unidad-rrhh';

interface ModalEditarUnidadProps {
  show: boolean;
  rutempleador: string;
  idUnidad?: string;
  Operador: number;
  onUnidadRRHHEditada: () => void;
  onCerrarModal: () => void;
}

export const ModalEditarUnidad: React.FC<ModalEditarUnidadProps> = ({
  show,
  rutempleador,
  idUnidad,
  Operador,
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
    idUnidad ? buscarUnidadesDeRRHH(rutempleador, Operador, idUnidad) : emptyFetch(),
    [idUnidad],
  );

  const { empleadorActual, rolEnEmpleadorActual } = useEmpleadorActual();

  const { usuario } = useContext(AuthContext);

  const formulario = useForm<Unidadesrrhh>({ mode: 'onBlur' });

  const regionSeleccionada = formulario.watch('CodigoRegion');

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

    formulario.setValue(
      'GlosaUnidadRRHH',
      unidadRRHH.find((v) => v.CodigoUnidadRRHH == idUnidad)?.GlosaUnidadRRHH ?? '',
    );
    formulario.setValue(
      'CodigoRegion',
      (unidadRRHH.find((v) => v.CodigoUnidadRRHH == idUnidad)?.CodigoRegion ?? '').length == 1
        ? '0' + (unidadRRHH.find((v) => v.CodigoUnidadRRHH == idUnidad)?.CodigoRegion ?? '')
        : unidadRRHH.find((v) => v.CodigoUnidadRRHH == idUnidad)?.CodigoRegion ?? '',
    );
    formulario.setValue(
      'Direccion',
      unidadRRHH.find((v) => v.CodigoUnidadRRHH == idUnidad)?.Direccion ?? '',
    );
    formulario.setValue(
      'CodigoUnidadRRHH',
      idUnidad ?? unidadRRHH.find((v) => v.CodigoUnidadRRHH == idUnidad)?.CodigoUnidadRRHH ?? '',
    );
    formulario.setValue(
      'CodigoComuna',
      unidadRRHH.find((v) => v.CodigoUnidadRRHH == idUnidad)?.CodigoComuna ?? '',
    );

    formulario.setValue(
      'Telefono',
      unidadRRHH.find((v) => v.CodigoUnidadRRHH == idUnidad)?.Telefono ?? '',
    );

    formulario.setValue(
      'CodigoTipoCalle',
      unidadRRHH.find((v) => v.CodigoUnidadRRHH == idUnidad)?.CodigoTipoCalle ?? 0,
    );

    formulario.setValue(
      'Numero',
      unidadRRHH.find((v) => v.CodigoUnidadRRHH == idUnidad)?.Numero ?? '',
    );

    formulario.setValue(
      'BlockDepto',
      unidadRRHH.find((v) => v.CodigoUnidadRRHH == idUnidad)?.BlockDepto ?? '',
    );
    /* NOTA: Hay que darle un timeout antes de parchar la comuna. Puede ser porque react necesita
     * un tiempo para actualizar el combo de comunas al parchar la region. */
    setTimeout(() => {
      formulario.setValue(
        'CodigoComuna',
        (unidadRRHH.find((v) => v.CodigoUnidadRRHH == idUnidad)?.CodigoComuna ?? '').length == 4
          ? +'0' + (unidadRRHH.find((v) => v.CodigoUnidadRRHH == idUnidad)?.CodigoComuna ?? '')
          : unidadRRHH.find((v) => v.CodigoUnidadRRHH == idUnidad)?.CodigoComuna ?? '',
      );
      setMostrarSpinner(false);
    }, 100);
  }, [
    cargandoCombos,
    unidadRRHH,
    cargandoUnidad,
    errorCargarUnidad,
    erroresCargarCombos,
    formulario,
    idUnidad,
  ]);

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

      await actualizarUnidad(data, empleadorActual.rutempleador, usuario.rut, 2, Operador);

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
      <Modal backdrop="static" size="xl" centered show={show} keyboard={false}>
        <Modal.Header closeButton onClick={handleCerrarModal}>
          <Modal.Title className="fs-5">
            {rolEnEmpleadorActual === 'administrador'
              ? `Modificar Unidad RRHH - ${
                  unidadRRHH!?.find((v) => v.CodigoUnidadRRHH == idUnidad)?.CodigoUnidadRRHH ?? ''
                }`
              : `Unidad RRHH - ${
                  unidadRRHH!?.find((v) => v.CodigoUnidadRRHH == idUnidad)?.GlosaUnidadRRHH ?? ''
                }`}
          </Modal.Title>
        </Modal.Header>

        <FormProvider {...formulario}>
          <form onSubmit={formulario.handleSubmit(editarUnidadDeRRHH)}>
            <Modal.Body>
              <IfContainer show={cargandoCombos || cargandoUnidad || mostrarSpinner}>
                <div className="my-5">
                  <LoadingSpinner titulo="Cargando..." />
                </div>
              </IfContainer>

              <IfContainer
                show={
                  !(cargandoCombos || cargandoUnidad) &&
                  erroresCargarCombos.length > 0 &&
                  !mostrarSpinner
                }>
                <div className="modal-body">
                  <h4 className="my-4 text-center">Error al cargar combos</h4>
                </div>
              </IfContainer>

              <IfContainer
                show={!(cargandoCombos || cargandoUnidad) && errorCargarUnidad && !mostrarSpinner}>
                <div className="modal-body">
                  <h4 className="my-4 text-center">Error al cargar la unidad de RRHH</h4>
                </div>
              </IfContainer>

              <IfContainer
                show={
                  !(cargandoCombos || cargandoUnidad) &&
                  !errorCargarUnidad &&
                  erroresCargarCombos.length === 0 &&
                  !mostrarSpinner
                }>
                <div className="row mt-2 g-3 align-items-baseline">
                  <InputIdentificadorUnidadRRHH
                    name="CodigoUnidadRRHH"
                    label="Código Unidad"
                    className="col-12 col-lg-6 col-xl-3"
                    deshabilitado
                  />

                  <InputNombreUnidadRRHH
                    name="GlosaUnidadRRHH"
                    label="Nombre"
                    className="col-12 col-lg-6 col-xl-3"
                  />

                  <ComboSimple
                    name="CodigoRegion"
                    label="Región"
                    datos={combos?.CCREGION}
                    idElemento="idregion"
                    descripcion="nombre"
                    className="col-12 col-lg-6 col-xl-3"
                    tipoValor="string"
                  />

                  <ComboComuna
                    label="Comuna"
                    name="CodigoComuna"
                    comunas={combos?.CCCOMUNA}
                    regionSeleccionada={regionSeleccionada}
                    className="col-12 col-lg-6 col-xl-3"
                  />

                  <ComboSimple
                    label="Tipo de calle"
                    name="CodigoTipoCalle"
                    datos={combos?.TIPOCALLE}
                    idElemento={'idtipocalle'}
                    descripcion={'tipocalle'}
                    className="col-12 col-lg-6 col-xl-3"
                  />

                  <InputCalle label="Calle" name="Direccion" className="col-12 col-lg-6 col-xl-3" />

                  <InputNumero name="Numero" label="Número" className="col-12 col-lg-6 col-xl-3" />

                  <InputBlockDepartamento
                   opcional
                    name="BlockDepto"
                    label="Departamento"
                    className="col-12 col-lg-6 col-xl-3"
                  />

                  <InputTelefono
                    name="Telefono"
                    label="Teléfono"
                    className="col-12 col-lg-6 col-xl-3"
                  />
                </div>
              </IfContainer>
            </Modal.Body>

            <Modal.Footer>
              <div className="w-100 d-flex flex-column flex-md-row flex-md-row-reverse">
                {rolEnEmpleadorActual === 'administrador' && (
                  <button type="submit" className="btn btn-primary">
                    Grabar
                  </button>
                )}

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
