'use client';

import { InputClave, InputRut } from '@/components/form';
import { AuthContext } from '@/contexts';
import {
  AutenticacionTransitoriaError,
  LoginPasswordInvalidoError,
  RutInvalidoError,
  UsuarioNoExisteError,
} from '@/servicios/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import styles from './login.module.css';
import ModalCambiarClaveTemporal from './modal-cambiar-clave-temporal';
import ModalClaveEnviada from './modal-clave-enviada';
import ModalRecuperarClave from './modal-recuperar-clave';

interface FormularioLogin {
  rut: string;
  clave: string;
}

export const LoginComponent: React.FC<{}> = () => {
  const [showModalCambiarClave, setShowModalCambiarClave] = useState(false);
  const [showModalRecuperarClave, setShowModalRecuperarClave] = useState(false);
  const [showModalClaveEnviada, setShowModalClaveEnviada] = useState(false);

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

    const redirectPath = searchParams.get('redirectTo');
    const redirectTo =
      !redirectPath || (redirectPath.startsWith('/empleadores') && !usuario.tieneRol('admin'))
        ? null
        : redirectPath;

    router.push(redirectTo ?? '/tramitacion');
  }, [usuario]);

  const handleLoginUsuario: SubmitHandler<FormularioLogin> = async ({ rut, clave }) => {
    try {
      await login(rut, clave);

      Swal.fire({
        html: 'Sesión iniciada correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
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
    }
  };

  return (
    <>
      <FormProvider {...formulario}>
        <form onSubmit={formulario.handleSubmit(handleLoginUsuario)} className={styles.formlogin}>
          <label style={{ fontWeight: 'bold' }}>
            Ingresa tus credenciales de acceso al Portal Integrado para Entidades Empleadoras
          </label>
          <br />

          <InputRut
            label="RUN Persona Usuaria"
            name="rut"
            tipo="run"
            omitirSignoObligatorio
            className="mb-3 mt-3"
          />

          <InputClave
            label="Clave de acceso"
            name="clave"
            omitirSignoObligatorio
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
        onCerrarModal={() => {
          setShowModalCambiarClave(false);
        }}
        onClaveCambiada={() => {
          setShowModalCambiarClave(false);
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
