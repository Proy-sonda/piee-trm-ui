'use client';

import { InputClave, InputRut } from '@/components/form';
import { AuthContext } from '@/contexts';
import { useFetch } from '@/hooks';
import { Mensaje, estaMensajeVigente } from '@/modelos/mensaje';
import { adsUrl } from '@/servicios';
import {
  AutenticacionTransitoriaError,
  LoginPasswordInvalidoError,
  RutInvalidoError,
  UsuarioDebeHomologarError,
  UsuarioNoExisteError,
} from '@/servicios/auth';
import { BuscarUsuarioSu } from '@/servicios/buscar-super-usuario';
import { obtenerMensajes } from '@/servicios/obtiene-mensajes';
import { AlertaConfirmacion, AlertaExito, existe } from '@/utilidades';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import IfContainer from '../if-container';
import SpinnerPantallaCompleta from '../spinner-pantalla-completa';
import styles from './login.module.css';
import ModalCambiarClaveTemporal from './modal-cambiar-clave-temporal';
import ModalClaveEnviada from './modal-clave-enviada';
import ModalRecuperarClave from './modal-recuperar-clave';

interface FormularioLogin {
  rut: string;
  clave: string;
}

export const LoginComponent: React.FC<{}> = () => {
  const MENSAJE_BIENVENIDA_POR_DEFECTO = '<p>Bienvenido al Portal de Tramitación</p>';

  const [showModalCambiarClave, setShowModalCambiarClave] = useState(false);
  const [showModalRecuperarClave, setShowModalRecuperarClave] = useState(false);
  const [showModalClaveEnviada, setShowModalClaveEnviada] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [, mensajes] = useFetch(obtenerMensajes());
  const [inicioComoSuperusuario, setInicioComoSuperusuario] = useState(false);
  const [sinUsuarioEnTRM, setsinUsuarioEnTRM] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { usuario, login, loginSU } = useContext(AuthContext);
  const formulario = useForm<FormularioLogin>({
    mode: 'onBlur',
    defaultValues: {
      rut: '',
      clave: '',
    },
  });

  const rutUsuario = formulario.watch('rut');

  // Redirigir al usuario si esta logueado
  useEffect(() => {
    if (!usuario || !mensajes) {
      return;
    }

    const modalBienvenida = AlertaExito.mixin({
      html: `
      ${obtenerMensajesDeBienvenida(mensajes)} 
      <p>Cargando bandeja de tramitación...</p>
      `,
      timer: 6000,
      didClose: () => router.push(searchParams.get('redirectTo') ?? '/tramitacion'),
    });

    if (inicioComoSuperusuario) {
      if (sinUsuarioEnTRM) {
        AlertaExito.fire({
          html: 'Iniciando como superusuario...',
          timer: 3000,
          didClose: () => router.push('/superusuario'),
        });

        return;
      }

      AlertaConfirmacion.fire({
        title: 'RUN ingresado es de superusuario',
        html: '¿Desea ingresar como superusuario?',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/superusuario');
        } else {
          modalBienvenida.fire();
        }
      });
    } else {
      modalBienvenida.fire();
    }
  }, [usuario, mensajes]);

  const obtenerMensajesDeBienvenida = (mensajes?: Mensaje[]) => {
    const bienvenidaGeneral = (mensajes ?? []).find((m) => m.idmensajegeneral === 2);
    const bienvenidaTramitacion = (mensajes ?? []).find((m) => m.idmensajegeneral === 3);

    if (existe(bienvenidaGeneral) && estaMensajeVigente(bienvenidaGeneral)) {
      return bienvenidaGeneral.mensaje;
    } else if (existe(bienvenidaTramitacion) && estaMensajeVigente(bienvenidaTramitacion)) {
      return bienvenidaTramitacion.mensaje;
    } else {
      return MENSAJE_BIENVENIDA_POR_DEFECTO;
    }
  };

  const handleLoginUsuario: SubmitHandler<FormularioLogin> = async ({ rut, clave }) => {
    try {
      setShowSpinner(true);

      const esRutSuperusuario = await BuscarUsuarioSu(rut);
      if (esRutSuperusuario === true) {
        setInicioComoSuperusuario(true);
      }

      await login(rut, clave);
    } catch (error) {
      try {
        // si no cuenta con usuario en tramitación manda al catch

        await loginSU(rut, clave);
        setsinUsuarioEnTRM(true);
      } catch (error) {
        console.log(error);
      }
      let messageError = '';

      if (error instanceof RutInvalidoError) {
        messageError = `<br/> Rut Inválido`;
      } else if (
        error instanceof LoginPasswordInvalidoError ||
        error instanceof UsuarioNoExisteError
      ) {
        messageError = 'Contraseña inválida';
      } else if (error instanceof AutenticacionTransitoriaError) {
        setShowModalCambiarClave(true);
      } else if (error instanceof UsuarioDebeHomologarError) {
        // Nota: el RUN va en base 64 y en parametro 'r' para que sea menos obvio a que se refiere
        const urlHomologacion = new URL(`${adsUrl()}/homologar`);
        urlHomologacion.searchParams.set('r', btoa(rut));
        router.push(urlHomologacion.toString());
        return;
      } else {
        messageError = 'Ocurrió un problema en el sistema';
      }

      if (messageError != '')
        Swal.fire({
          title: 'Error',
          icon: 'error',
          html: messageError,
          confirmButtonColor: 'var(--color-blue)',
        });
    } finally {
      setShowSpinner(false);
    }
  };

  return (
    <>
      <IfContainer show={showSpinner}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <FormProvider {...formulario}>
        <form
          onSubmit={formulario.handleSubmit(handleLoginUsuario)}
          className={`mx-auto p-3 p-sm-4 w-100 rounded ${styles.formlogin}`}>
          <label className="fw-bold">
            Ingresa tus credenciales de acceso al Portal Integrado para Entidades Empleadoras
          </label>
          <br />

          <InputRut
            ocultarTooltip
            omitirSignoObligatorio
            autocompletar={false}
            label="RUN Persona Usuaria"
            name="rut"
            tipo="run"
            className="mb-3 mt-3"
          />

          <InputClave
            omitirSignoObligatorio
            label="Clave de acceso"
            name="clave"
            className="mb-3"
          />

          <div className="mt-3 pt-2 w-100 d-flex flex-column-reverse flex-lg-row align-items-lg-center justify-content-lg-between">
            <label
              className="cursor-pointer mt-3 mt-lg-0 text-center text-decoration-underline"
              style={{ color: 'blue' }}
              onClick={() => setShowModalRecuperarClave(true)}>
              Recuperar clave de acceso
            </label>
            <button type="submit" className="btn btn-primary text-nowrap">
              Ingresar al Portal
            </button>
          </div>
        </form>
      </FormProvider>

      <ModalCambiarClaveTemporal
        rutUsuario={rutUsuario}
        show={showModalCambiarClave}
        onCerrarModal={() => setShowModalCambiarClave(false)}
        onClaveCambiada={() => {
          setShowModalCambiarClave(false);
          formulario.setValue('clave', '', { shouldValidate: false });
          formulario.setFocus('clave');
        }}
      />

      <ModalRecuperarClave
        show={showModalRecuperarClave}
        onCerrarModal={() => setShowModalRecuperarClave(false)}
        onClaveEnviada={() => {
          setShowModalRecuperarClave(false);
          setShowModalClaveEnviada(true);
        }}
      />

      <ModalClaveEnviada
        show={showModalClaveEnviada}
        onCerrarModal={() => setShowModalClaveEnviada(false)}
      />
    </>
  );
};
