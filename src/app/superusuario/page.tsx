'use client';
import { InputNombres, InputRutBusqueda, Titulo } from '@/components';
import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import { AuthContext } from '@/contexts';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { ambiente } from '@/servicios';
import { AlertaConfirmacion, AlertaError } from '@/utilidades';
import TablaEntidadesEmpleadoras from './(componentes)/tabla-entidades-empleadoras';
import TablaUsuarios from './(componentes)/tabla-usuarios';
import { Usuarioempleador, Usuarios } from './(modelos)/usuarios-sistema';
import { ObtenerUsuarios } from './(servicios)/obtener-usuarios';
import {
  AutenticacionTransitoriaError,
  LoginPasswordInvalidoError,
  VerificarUsuario,
} from './(servicios)/verificar-superusuario';

const SuperUsuario = () => {
  const { usuario, estaLogueado, setUsuario, logout } = useContext(AuthContext);
  const [Cargando, setCargando] = useState(false);
  const [usuarios, setusuarios] = useState<Usuarios[]>([]);
  const [usuarioseleccionado, setusuarioseleccionado] = useState<number | undefined>(undefined);
  const [empleadordeusuario, setempleadordeusuario] = useState<Usuarioempleador[]>([]);
  const router = useRouter();

  const formulario = useForm<{
    rut: string;
    nombres: string;
  }>();

  useEffect(() => {
    // obtener la cookie desde el login de adscripcion con nookies
    const cookie = document.cookie;
    const token = cookie.split(`${ambiente()}-token=`)[1];
    if (token) {
      return;
    }

    if (!usuario?.rut) {
      router.push('/');
    }
  }, [usuario]);

  useEffect(() => {
    if (usuarioseleccionado) {
      usuarios.map(
        (usuario) =>
          usuario.idusuario === usuarioseleccionado &&
          setempleadordeusuario(usuario.usuarioempleador),
      );
    }
  }, [usuarioseleccionado]);

  const onHandleSubmit = async (data: { rut: string; nombres: string }) => {
    setusuarioseleccionado(undefined);
    setCargando(true);
    if (data.rut) {
      const [Usuarios] = await ObtenerUsuarios(data.rut, data.nombres);
      if (await Usuarios()) {
        setCargando(false);
        setusuarios(await Usuarios());
      }
    } else {
      setCargando(false);
      setusuarios([]);
      setusuarioseleccionado(undefined);
    }
  };

  const ConfirmarSeleccion = async (rutUsuario: string, nombreUsuario: string) => {
    const resp = await AlertaConfirmacion.fire({
      html: `¿Desea seleccionar a la persona usuaria <b>${nombreUsuario}</b> con RUN <b>${rutUsuario}</b>?`,
    });

    if (resp.isConfirmed) {
      onHandleSubmitLogin(rutUsuario); // login con nuevo rut
    }
  };

  const onHandleSubmitLogin = async (rut: string) => {
    try {
      const resp = await VerificarUsuario(rut);
      setUsuario(resp);
      if (resp) {
        router.push('/tramitacion');
      }
    } catch (error) {
      if (error instanceof LoginPasswordInvalidoError) {
        AlertaError.fire({
          html: 'Usuario o clave incorrectos',
        });
      }

      console.log(error instanceof AutenticacionTransitoriaError);
      if (error instanceof AutenticacionTransitoriaError) {
        AlertaError.fire({
          html: 'Persona usuaria cuenta con contraseña transitoria, favor verificar correo electrónico para obtener nueva contraseña',
        });
      }
    }
  };

  return (
    <>
      <IfContainer show={usuario?.rut}>
        <Titulo url="#">
          <h5>Super Usuario</h5>
        </Titulo>

        <div className="row mt-2">
          <label>
            Para poder continuar como persona super usuaria, debe seleccionar una persona usuaria
            del Portal Integrado para Entidades Empleadoras.
          </label>
        </div>
        <div className="row mt-2">
          <div className="col-md-8">
            <FormProvider {...formulario}>
              <form onSubmit={formulario.handleSubmit(onHandleSubmit)}>
                <div className="row">
                  <div className="col-md-4">
                    <InputRutBusqueda name="rut" label="RUN Usuario" opcional />
                  </div>
                  <div className="col-md-4">
                    <InputNombres name="nombres" label="Nombres" opcional />
                  </div>
                  <div
                    className="col-md-4"
                    style={{
                      alignSelf: 'self-end',
                    }}>
                    <button type="submit" className="btn btn-primary">
                      Buscar
                    </button>
                  </div>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </IfContainer>
      <IfContainer show={Cargando}>
        <LoadingSpinner titulo="Cargando Usuarios" />
      </IfContainer>
      <IfContainer show={!Cargando}>
        <div className="row mt-2">
          <div className="col-md-12">
            <h6>Tabla de usuarios</h6>
            <hr />
            <TablaUsuarios
              setusuarioseleccionado={setusuarioseleccionado}
              usuarios={usuarios}
              usuarioseleccionado={usuarioseleccionado}
              ConfirmarSeleccion={ConfirmarSeleccion}
            />
          </div>
          <div className="row">
            <div className="col-md-4 float-end">
              <button className="btn btn-danger" onClick={() => logout()}>
                Salir
              </button>
            </div>
          </div>
        </div>

        <IfContainer show={usuarioseleccionado}>
          {usuarios && (
            <div className="row mt-2">
              <hr />
              <div className="col-md-12">
                <h6>Tabla de entidades empleadoras</h6>
                <hr />
                <TablaEntidadesEmpleadoras usuarios={empleadordeusuario} />
              </div>
            </div>
          )}
        </IfContainer>
      </IfContainer>
      <IfContainer show={!estaLogueado}>
        <LoadingSpinner titulo="Cargando Super Usuario" />
      </IfContainer>
    </>
  );
};

export default SuperUsuario;
