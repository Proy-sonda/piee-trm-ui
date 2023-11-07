import { useEmpleadorActual } from '@/app/empleadores/(contexts)/empleador-actual-context';
import { buscarComunas } from '@/app/empleadores/(servicios)/buscar-comunas';
import { buscarRegiones } from '@/app/empleadores/(servicios)/buscar-regiones';
import {
  ComboComuna,
  ComboSimple,
  InputBlockDepartamento,
  InputCalle,
  InputNumero,
  InputTelefono,
} from '@/components/form';
import IfContainer from '@/components/if-container';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { AuthContext } from '@/contexts';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { AlertaError, AlertaExito } from '@/utilidades/alertas';
import React, { useContext, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Unidadesrrhh } from '../(modelos)/payload-unidades';
import { crearUnidad } from '../(servicios)/crear-unidad';
import { buscarCalle } from '../../../../tramitacion/[foliolicencia]/[idoperador]/(servicios)/tipo-calle';
import { InputNombreUnidadRRHH } from './input-nombre-unidad-rrhh';

interface ModalNuevaUnidadProps {
  show: boolean;
  rutempleador: string;
  onCerrarModal: () => void;
  onNuevaUnidadCreada: () => void;
}

const ModalNuevaUnidad: React.FC<ModalNuevaUnidadProps> = ({
  show,
  rutempleador,
  onCerrarModal,
  onNuevaUnidadCreada,
}) => {
  const [mostrarSpinner, setMostrarSpinner] = useState(false);
  const { empleadorActual } = useEmpleadorActual();
  const { usuario } = useContext(AuthContext);

  const [erroresCargarCombos, combos, cargandoCombos] = useMergeFetchObject({
    CCREGION: buscarRegiones(),
    CCCOMUNA: buscarComunas(),
    CCTIPOCALLE: buscarCalle(),
  });

  const formulario = useForm<Unidadesrrhh>({
    mode: 'onBlur',
  });

  const regionSeleccionada = formulario.watch('codigoregion');

  const resetearFormulario = () => {
    formulario.reset();
  };

  const handleCerrarModal = () => {
    resetearFormulario();
    onCerrarModal();
  };

  const crearUnidadDeRRHH: SubmitHandler<Unidadesrrhh> = async (data) => {
    try {
      setMostrarSpinner(true);

      if (empleadorActual == undefined || usuario == undefined) return;

      await crearUnidad(data, empleadorActual?.rutempleador, usuario?.rut);

      AlertaExito.fire({
        text: 'Unidad fue creada con éxito',
      });

      resetearFormulario();

      onNuevaUnidadCreada();
    } catch (error) {
      AlertaError.fire({
        title: 'Error',
        text: 'Hubo un problema al crear la unidad, por favor contactar a un administrador',
      });
    } finally {
      setMostrarSpinner(false);
    }
  };

  return (
    <>
      <Modal show={show} backdrop="static" size="xl" centered keyboard={false}>
        <Modal.Header closeButton onClick={handleCerrarModal}>
          <Modal.Title className="fs-5">Crear Nueva Unidad de RRHH</Modal.Title>
        </Modal.Header>

        <FormProvider {...formulario}>
          <form onSubmit={formulario.handleSubmit(crearUnidadDeRRHH)}>
            <Modal.Body>
              <IfContainer show={mostrarSpinner || cargandoCombos}>
                <SpinnerPantallaCompleta />
              </IfContainer>

              <IfContainer show={erroresCargarCombos.length > 0}>
                <div className="modal-body">
                  <h4 className="my-5 text-center">Error al cargar combos</h4>
                </div>
              </IfContainer>

              <IfContainer show={erroresCargarCombos.length === 0}>
                <div className="row mt-2 g-3 align-items-baseline">
                  <InputNombreUnidadRRHH
                    label="Código Unidad"
                    className="col-12 col-lg-6 col-xl-3"
                    name="codigounidadrrhh"
                  />

                  <InputNombreUnidadRRHH
                    name="glosaunidadrrhh"
                    label="Nombre Unidad"
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
                    label="Tipo de Calle"
                    name="codigotipocalle"
                    datos={combos?.CCTIPOCALLE}
                    idElemento={'idtipocalle'}
                    descripcion={'tipocalle'}
                    className="col-12 col-lg-6 col-xl-3"
                  />

                  <InputCalle label="Calle" name="direccion" className="col-12 col-lg-6 col-xl-3" />

                  <InputNumero name="numero" label="Número" className="col-12 col-lg-6 col-xl-3" />

                  <InputBlockDepartamento
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
                  className="btn btn-danger mt-2 mt-md-0 me-0 me-md-2"
                  data-bs-dismiss="modal"
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

export default ModalNuevaUnidad;
