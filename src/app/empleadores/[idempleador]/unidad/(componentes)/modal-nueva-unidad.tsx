import { buscarComunas } from '@/app/empleadores/(servicios)/buscar-comunas';
import { buscarRegiones } from '@/app/empleadores/(servicios)/buscar-regiones';
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
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { AlertaError, AlertaExito } from '@/utilidades/alertas';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { FormularioCrearUnidadRRHH } from '../(modelos)/formulario-crear-unidad-rrhh';
import { crearUnidad } from '../(servicios)/crear-unidad';
import { InputIdentificadorUnidadRRHH } from './input-identificador-unidad-rrhh';
import { InputNombreUnidadRRHH } from './input-nombre-unidad-rrhh';

interface ModalNuevaUnidadProps {
  show: boolean;
  idEmpleador: number;
  onCerrarModal: () => void;
  onNuevaUnidadCreada: () => void;
}

const ModalNuevaUnidad: React.FC<ModalNuevaUnidadProps> = ({
  show,
  idEmpleador,
  onCerrarModal,
  onNuevaUnidadCreada,
}) => {
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const [erroresCargarCombos, combos, cargandoCombos] = useMergeFetchObject({
    CCREGION: buscarRegiones(),
    CCCOMUNA: buscarComunas(),
  });

  const formulario = useForm<FormularioCrearUnidadRRHH>({
    mode: 'onBlur',
  });

  const regionSeleccionada = formulario.watch('regionId');

  const resetearFormulario = () => {
    formulario.reset();
  };

  const handleCerrarModal = () => {
    resetearFormulario();
    onCerrarModal();
  };

  const crearUnidadDeRRHH: SubmitHandler<FormularioCrearUnidadRRHH> = async (data) => {
    try {
      setMostrarSpinner(true);

      await crearUnidad({
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
      });

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

                  <InputCalle label="Calle" name="calle" className="col-12 col-lg-6 col-xl-3" />

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
