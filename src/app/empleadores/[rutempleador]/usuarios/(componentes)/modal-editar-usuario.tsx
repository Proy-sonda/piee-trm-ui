import { EmpleadorPorId } from '@/app/empleadores/(modelos)/empleador-por-id';
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
import { emptyFetch, useFetch, useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { WebServiceOperadoresError } from '@/modelos/web-service-operadores-error';
import { AlertaError, AlertaExito } from '@/utilidades/alertas';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { FormularioEditarUsuario } from '../(modelos)/formulario-editar-usuario';
import { esUsuarioAdministrador } from '../(modelos)/usuario-entidad-empleadora';
import { actualizarUsuario } from '../(servicios)/actualizar-usuario';
import { buscarRolesUsuarios } from '../(servicios)/buscar-roles-usuarios';
import { buscarUsuarioPorId } from '../(servicios)/buscar-usuario-por-id';

interface ModalEditarUsuarioProps {
  show: boolean;
  idUsuario?: number;
  cantidadUsuariosAdminActivos: number;
  empleador?: EmpleadorPorId;
  onCerrarModal: () => void;
  onUsuarioEditado: () => void;
}

const ModalEditarUsuario: React.FC<ModalEditarUsuarioProps> = ({
  show,
  idUsuario,
  cantidadUsuariosAdminActivos,
  empleador,
  onCerrarModal,
  onUsuarioEditado,
}) => {
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const [errCargarCombos, combos, cargandoCombos] = useMergeFetchObject({
    roles: buscarRolesUsuarios(),
  });

  const [errUsuario, usuarioEditar, cargandoUsuario] = useFetch(
    idUsuario ? buscarUsuarioPorId(idUsuario) : emptyFetch(),
    [idUsuario],
  );

  const formulario = useForm<FormularioEditarUsuario>({ mode: 'onBlur' });

  // Parchar formulario
  useEffect(() => {
    if (
      cargandoCombos ||
      cargandoUsuario ||
      errCargarCombos.length > 0 ||
      errUsuario ||
      !usuarioEditar ||
      !combos
    ) {
      return;
    }

    formulario.setValue('rut', usuarioEditar.rutusuario);
    formulario.setValue('nombres', usuarioEditar.nombres);
    formulario.setValue('apellidos', usuarioEditar.apellidos);
    formulario.setValue('telefono1', usuarioEditar.telefonouno);
    formulario.setValue('telefono2', usuarioEditar.telefonodos);
    formulario.setValue('email', usuarioEditar.email);
    formulario.setValue('confirmarEmail', usuarioEditar.email);
    formulario.setValue('rolId', usuarioEditar.rol.idrol);
  }, [cargandoUsuario, usuarioEditar, errUsuario]);

  const handleActualizarUsuario: SubmitHandler<FormularioEditarUsuario> = async (data) => {
    try {
      if (!empleador) {
        throw new Error('NO EXISTE EL EMPLEADOR');
      }

      if (!usuarioEditar) {
        throw new Error('No se encuentra la persona usuaria para editar');
      }

      setMostrarSpinner(true);

      await actualizarUsuario({
        ...data,
        idUsuario: usuarioEditar.idusuario,
        estadoUsuarioId: usuarioEditar.estadousuario.idestadousuario,
        rutEmpleador: empleador.rutempleador,
      });

      AlertaExito.fire({ text: 'Persona usuaria actualizada con éxito' });

      onUsuarioEditado();
    } catch (error) {
      if (error instanceof WebServiceOperadoresError) {
        return AlertaError.fire({
          title: 'Error',
          text: 'Hubo un error al actualizar a la persona usuaria en el operador',
        });
      }

      return AlertaError.fire({
        title: 'Error al actualizar persona usuaria',
        text: 'Se ha producido un error desconocido',
      });
    } finally {
      setMostrarSpinner(false);
    }
  };

  const handleCerrarModal = () => {
    formulario.reset();
    onCerrarModal();
  };

  return (
    <>
      <IfContainer show={mostrarSpinner}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <Modal backdrop="static" size="xl" centered show={show} keyboard={false}>
        <Modal.Header closeButton onClick={handleCerrarModal}>
          <Modal.Title className="fs-5">Editar Persona Usuaria</Modal.Title>
        </Modal.Header>

        <FormProvider {...formulario}>
          <form onSubmit={formulario.handleSubmit(handleActualizarUsuario)}>
            <Modal.Body>
              <IfContainer show={cargandoCombos || cargandoUsuario}>
                <LoadingSpinner titulo="Cargando..." />
              </IfContainer>

              <IfContainer
                show={
                  !(cargandoCombos || cargandoUsuario) && (errCargarCombos.length > 0 || errUsuario)
                }>
                <h4 className="my-5 text-center">Hubo un error al cargar los datos</h4>
              </IfContainer>

              <IfContainer
                show={
                  !(cargandoCombos || cargandoUsuario) &&
                  errCargarCombos.length === 0 &&
                  !errUsuario
                }>
                <div className="row mb-4 g-3 align-items-baseline">
                  <InputRut
                    deshabilitado
                    name="rut"
                    label="RUN"
                    tipo="run"
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

                  {cantidadUsuariosAdminActivos > 1 ||
                  (usuarioEditar && !esUsuarioAdministrador(usuarioEditar)) ? (
                    <ComboSimple
                      name="rolId"
                      label="Rol"
                      datos={combos?.roles}
                      idElemento={'idrol'}
                      descripcion={'rol'}
                      className="col-12 col-lg-6 col-xl-3"
                    />
                  ) : (
                    <div className="col-12 col-lg-6 col-xl-3">
                      <label className="form-label mb-2">Rol (*)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={usuarioEditar?.rol.rol ?? ''}
                        disabled
                      />
                    </div>
                  )}

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
                  disabled={
                    cargandoCombos || cargandoUsuario || errCargarCombos.length > 0 || !!errUsuario
                  }>
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

export default ModalEditarUsuario;
