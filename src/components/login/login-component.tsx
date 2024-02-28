'use client';

import { InputClave, InputRut } from '@/components/form';
import { AuthContext } from '@/contexts';
import { useFetch } from '@/hooks';
import {
  AutenticacionTransitoriaError,
  LoginPasswordInvalidoError,
  RutInvalidoError,
  UsuarioNoExisteError,
} from '@/servicios/auth';
import { obtenerMensajes } from '@/servicios/obtiene-mensajes';
import { AlertaExito } from '@/utilidades';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import IfContainer from '../if-container';
import SpinnerPantallaCompleta from '../spinner-pantalla-completa';
import styles from './login.module.css';
import ModalCambiarClaveTemporal from './modal-cambiar-clave-temporal';
import ModalClaveEnviada from './modal-clave-enviada';
import { ModalSuperUsuario } from './modal-login-sup';
import ModalRecuperarClave from './modal-recuperar-clave';

interface FormularioLogin {
  rut: string;
  clave: string;
}

export const LoginComponent: React.FC<{}> = () => {
  const [showModalCambiarClave, setShowModalCambiarClave] = useState(false);
  const [showModalRecuperarClave, setShowModalRecuperarClave] = useState(false);
  const [showModalClaveEnviada, setShowModalClaveEnviada] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [err, mensajes, pendiente] = useFetch(obtenerMensajes());

  const router = useRouter();

  const searchParams = useSearchParams();

  const { usuario, login } = useContext(AuthContext);

  const formulario = useForm<FormularioLogin>({ mode: 'onBlur' });

  const rutUsuario = formulario.watch('rut');

  // Redirigir al usuario si esta logueado
  useEffect(() => {
    if (!usuario) {
      return;
    }
    // validamos si existe un mensaje vigente entre las fechas de inicio y termino, tanto general como en especifico de tramitación
    if (mensajes?.find((m) => m.idmensajegeneral === 2)!?.mensaje) {
      const fechainicio = mensajes?.find((m) => m.idmensajegeneral === 2)!?.fechainicio || '';
      const fechafin = mensajes?.find((m) => m.idmensajegeneral === 2)!?.fechatermino || '';
      const fechaactual = new Date();
      if (fechaactual >= new Date(fechainicio) && fechaactual <= new Date(fechafin)) return;
    }

    if (mensajes?.find((m) => m.idmensajegeneral === 3)!?.mensaje) {
      const fechainicio = mensajes?.find((m) => m.idmensajegeneral === 3)!?.fechainicio || '';
      const fechafin = mensajes?.find((m) => m.idmensajegeneral === 3)!?.fechatermino || '';
      const fechaactual = new Date();
      if (fechaactual >= new Date(fechainicio) && fechaactual <= new Date(fechafin)) return;
    }

    // en caso contrario mostrara mensaje por default
    router.push(searchParams.get('redirectTo') ?? '/tramitacion');
  }, [usuario]);

  const handleLoginUsuario: SubmitHandler<FormularioLogin> = async ({ rut, clave }) => {
    try {
      setShowSpinner(true);

      await login(rut, clave);

      if (mensajes) {
        // primero verificamos si hay mensaje general vigente entre fechas de inicio y termino
        if (mensajes.find((m) => m.idmensajegeneral === 2)!?.mensaje) {
          const fechainicio = mensajes.find((m) => m.idmensajegeneral === 2)!?.fechainicio || '';
          const fechafin = mensajes.find((m) => m.idmensajegeneral === 2)!?.fechatermino || '';
          const fechaactual = new Date();
          if (fechaactual >= new Date(fechainicio) && fechaactual <= new Date(fechafin)) {
            AlertaExito.fire({
              html: `${mensajes.find((m) => m.idmensajegeneral === 2)!?.mensaje} <br/>
                     Cargando página de tramitación...`,
              timer: 6000,
              didClose: () => router.push(searchParams.get('redirectTo') ?? '/tramitacion'),
            });
            return;
          }
        }

        if (mensajes.find((m) => m.idmensajegeneral === 3)!?.mensaje) {
          //validamos si el mensaje se encuentra en la fecha de inicio y fin
          const fechainicio = mensajes.find((m) => m.idmensajegeneral === 3)!?.fechainicio || '';
          const fechafin = mensajes.find((m) => m.idmensajegeneral === 3)!?.fechatermino || '';
          const fechaactual = new Date();
          if (fechaactual >= new Date(fechainicio) && fechaactual <= new Date(fechafin)) {
            AlertaExito.fire({
              html: `${mensajes.find((m) => m.idmensajegeneral === 3)!?.mensaje} <br/>
              Cargando página de tramitación...`,
              timer: 6000,
              didClose: () => router.push(searchParams.get('redirectTo') ?? '/tramitacion'),
            });
          } else {
            AlertaExito.fire({ html: 'Sesión iniciada correctamente' });
          }
        }
      }
    } catch (error) {
      let messageError = '';

      if (error instanceof RutInvalidoError) {
        messageError = `<br/> Rut Invalido`;
      } else if (
        error instanceof LoginPasswordInvalidoError ||
        error instanceof UsuarioNoExisteError
      ) {
        messageError = 'Contraseña invalida';
      } else if (error instanceof AutenticacionTransitoriaError) {
        setShowModalCambiarClave(true);
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

      <ModalSuperUsuario show={true} />

      <FormProvider {...formulario}>
        <form onSubmit={formulario.handleSubmit(handleLoginUsuario)} className={styles.formlogin}>
          <label style={{ fontWeight: 'bold' }}>
            Ingresa tus credenciales de acceso al Portal Integrado para Entidades Empleadoras
          </label>
          <br />

          <InputRut
            omitirSignoObligatorio
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

          <div className={'mt-2 ' + styles.btnlogin}>
            <label
              style={{
                cursor: 'pointer',
                textDecoration: 'underline',
                color: 'blue',
                marginRight: '50px',
              }}
              onClick={() => setShowModalRecuperarClave(true)}>
              Recuperar clave de acceso
            </label>{' '}
            &nbsp;
            <button type="submit" className="btn btn-primary">
              Ingresar
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
