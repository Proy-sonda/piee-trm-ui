import {
  ComboSimple,
  InputApellidos,
  InputEmail,
  InputNombres,
  InputRut,
  InputTelefono,
} from '@/components/form';
import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { Empleador } from '@/modelos/empleador';
import { UsuarioEntidadEmpleadoraAPI } from '@/modelos/usuario-entidad-empleadora-api';
import { WebServiceOperadoresError } from '@/modelos/web-service-operadores-error';
import { buscarUsuarioPorRut } from '@/servicios/buscar-usuario-por-rut';
import { AlertaError, AlertaExito } from '@/utilidades/alertas';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { FormularioCrearUsuario } from '../(modelos)/formulario-crear-usuario';
import { usuarioEntidadEmpleadoraDesdeApi } from '../(modelos)/usuario-entidad-empleadora';
import { actualizarUsuario } from '../(servicios)/actualizar-usuario';
import { buscarRolesUsuarios } from '../(servicios)/buscar-roles-usuarios';
import { PersonaUsuariaYaExisteError, crearUsuario } from '../(servicios)/crear-usuario';

interface ModalCrearUsuarioProps {
  show: boolean;
  empleador?: Empleador;
  onCerrarModal: () => void;
  onUsuarioCreado: () => void;
}

const ModalCrearUsuario: React.FC<ModalCrearUsuarioProps> = ({
  show,
  empleador,
  onCerrarModal,
  onUsuarioCreado,
}) => {
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const [errDatosModal, datosModal, datosPendientes] = useMergeFetchObject({
    roles: buscarRolesUsuarios(),
  });

  const [usuarioExistente, setUsuarioExistente] = useState<UsuarioEntidadEmpleadoraAPI>();

  const formulario = useForm<FormularioCrearUsuario>({ mode: 'onBlur' });

  const limpiarFormulario = () => {
    formulario.reset();
    setUsuarioExistente(undefined);
  };

  const handleCrearUsuario: SubmitHandler<FormularioCrearUsuario> = async (data) => {
    try {
      setMostrarSpinner(true);

      await llamarEndpointParaCrearUsuario(data);

      AlertaExito.fire({ text: 'Persona usuaria creada con éxito' });

      limpiarFormulario();

      onUsuarioCreado();
    } catch (error) {
      if (error instanceof PersonaUsuariaYaExisteError) {
        return AlertaError.fire({
          title: 'Error',
          text: 'La persona usuaria ya existe en esta empresa',
        });
      }

      if (error instanceof WebServiceOperadoresError) {
        return AlertaError.fire({
          title: 'Error',
          text: 'Hubo un error al crear a la persona usuaria en el operador',
        });
      }

      return AlertaError.fire({
        title: 'Error al crear usuario',
        text: 'Se ha producido un error desconocido',
      });
    } finally {
      setMostrarSpinner(false);
    }
  };

  const llamarEndpointParaCrearUsuario = async (data: FormularioCrearUsuario) => {
    if (!empleador) {
      throw new Error('NO EXISTE EL EL EMPLEADOR');
    }

    if (!usuarioExistente) {
      await crearUsuario({
        ...data,
        idEmpleador: empleador.idempleador,
        rutEmpleador: empleador.rutempleador,
      });
    } else {
      const usuarioConEmpleadorActual = usuarioEntidadEmpleadoraDesdeApi(
        usuarioExistente,
        empleador.rutempleador,
      );

      if (!usuarioConEmpleadorActual) {
        await crearUsuario({
          ...data,
          idEmpleador: empleador.idempleador,
          rutEmpleador: empleador.rutempleador,
        });
      } else {
        await actualizarUsuario({
          ...data,
          empleador,
          usuarioOriginal: usuarioConEmpleadorActual,
        });
      }
    }
  };

  const handleCerrarModal = () => {
    limpiarFormulario();
    onCerrarModal();
  };

  const parcharConRut = async (rut: string) => {
    const [request] = buscarUsuarioPorRut(rut);

    try {
      setMostrarSpinner(true);

      const usuario = await request();

      if (!usuario || !empleador) {
        return;
      }

      setUsuarioExistente(usuario);

      formulario.clearErrors();
      formulario.setValue('rut', usuario.rutusuario);
      formulario.setValue('nombres', usuario.nombres);
      formulario.setValue('apellidos', usuario.apellidos);

      const empleadorUsuario = usuario.usuarioempleador.find(
        (ue) => ue.empleador.rutempleador === empleador.rutempleador,
      );

      if (empleadorUsuario) {
        // Se usa un valor por defecto en caso de que venga NULL desde la base de datos por la
        // migracion al nuevo modelo de usuario. P.D.: No deberia pasar que venga NULL.
        formulario.setValue('telefono1', empleadorUsuario.telefonouno ?? '');
        formulario.setValue('telefono2', empleadorUsuario.telefonodos ?? '');
        formulario.setValue('email', empleadorUsuario.email ?? '');
        formulario.setValue('confirmarEmail', empleadorUsuario.email ?? '');
      }
    } catch (error) {
      setUsuarioExistente(undefined);
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
          <Modal.Title className="fs-5">Agregar Nueva Persona Usuaria</Modal.Title>
        </Modal.Header>

        <FormProvider {...formulario}>
          <form onSubmit={formulario.handleSubmit(handleCrearUsuario)}>
            <Modal.Body>
              <IfContainer show={errDatosModal.length > 0}>
                <h4 className="my-5 text-center">Hubo un error al cargar los datos</h4>
              </IfContainer>

              <IfContainer show={datosPendientes}>
                <LoadingSpinner />
              </IfContainer>

              <IfContainer show={!datosPendientes && errDatosModal.length === 0}>
                <div className="row mb-4 g-3 align-items-baseline">
                  <InputRut
                    name="rut"
                    label="RUN"
                    tipo="run"
                    deshabilitado={!!usuarioExistente}
                    onBlur={parcharConRut}
                    className="col-12 col-lg-6 col-xl-3"
                  />

                  <InputNombres
                    name="nombres"
                    label="Nombres"
                    className="col-12 col-lg-6 col-xl-3"
                  />

                  <InputApellidos
                    name="apellidos"
                    label="Apellidos"
                    className="col-12 col-lg-6 col-xl-3"
                  />

                  <ComboSimple
                    name="rolId"
                    label="Rol"
                    datos={datosModal?.roles}
                    idElemento={'idrol'}
                    descripcion={'rol'}
                    className="col-12 col-lg-6 col-xl-3"
                  />

                  <InputTelefono
                    opcional
                    name="telefono1"
                    label="Teléfono 1"
                    className="col-12 col-lg-6 col-xl-3"
                  />

                  <InputTelefono
                    opcional
                    name="telefono2"
                    label="Teléfono 2"
                    className="col-12 col-lg-6 col-xl-3"
                  />

                  <InputEmail
                    name="email"
                    label="Correo electrónico"
                    className="col-12 col-lg-6 col-xl-3"
                  />

                  <InputEmail
                    name="confirmarEmail"
                    debeCoincidirCon="email"
                    label="Confirmar correo electrónico"
                    className="col-12 col-lg-6 col-xl-3"
                  />
                </div>
              </IfContainer>
            </Modal.Body>

            <Modal.Footer>
              <div className="w-100 d-flex flex-column flex-sm-row-reverse">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={datosPendientes || errDatosModal.length > 0}>
                  Grabar
                </button>
                <button
                  type="button"
                  className="btn btn-danger mt-2 mt-sm-0 me-sm-2"
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

export default ModalCrearUsuario;
