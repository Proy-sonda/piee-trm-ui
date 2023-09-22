'use client';

import { AuthContext } from '@/contexts';
import {
  AutenticacionTransitoriaError,
  LoginPasswordInvalidoError,
  RutInvalidoError,
  UsuarioNoExisteError,
} from '@/servicios/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { formatRut, validateRut } from 'rutlib';
import Swal from 'sweetalert2';
import styles from './login.module.css';
import ModalCambiarClaveTemporal from './modal-cambiar-clave-temporal';
import ModalClaveEnviada from './modal-clave-enviada';
import ModalRecuperarClave from './modal-recuperar-clave';

interface LoginComponentProps {
  buttonText?: string;
}

interface FormularioLogin {
  rut: string;
  clave: string;
}

// TODO: Eliminar props cuando se terminen las rutas dinamicas
export const LoginComponent: React.FC<LoginComponentProps> = ({ buttonText = 'Ingresar' }) => {
  const [verClave, setVerClave] = useState(false);

  const [showModalCambiarClave, setShowModalCambiarClave] = useState(false);
  const [showModalRecuperarClave, setShowModalRecuperarClave] = useState(false);
  const [showModalClaveEnviada, setShowModalClaveEnviada] = useState(false);

  const router = useRouter();

  const searchParams = useSearchParams();

  const { login } = useContext(AuthContext);

  const { register, handleSubmit, watch, setValue } = useForm<FormularioLogin>();

  const rutUsuario = watch('rut');

  const handleLoginUsuario: SubmitHandler<FormularioLogin> = async ({ rut, clave }) => {
    if (!rut || !clave) {
      return Swal.fire({
        icon: 'error',
        title: 'Error',
        html: 'Debe completar los campos',
      });
    }

    try {
      await login(rut, clave);

      return Swal.fire({
        html: 'Sesión iniciada correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        didClose: () => router.push(searchParams.get('redirectTo') ?? '/empleadores'),
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
      <form onSubmit={handleSubmit(handleLoginUsuario)} className={styles.formlogin}>
        <label>
          Ingresa tus credenciales de acceso al Portal Integrado para Entidades Empleadoras
        </label>
        <br />

        <div className="mb-3 mt-3">
          {/* TODO: Validar con react-hook-form, no con validacion del HTML */}
          <label htmlFor="rutUsuario">RUN Persona Usuaria:</label>
          <input
            id="rutUsuario"
            type="text"
            className="form-control"
            minLength={9}
            maxLength={10}
            required
            {...register('rut', {
              onChange: (event: any) => {
                const regex = /[^0-9kK\-]/g; // solo números, guiones y la letra K
                let rut = event.target.value as string;

                if (regex.test(rut)) {
                  rut = rut.replaceAll(regex, '');
                }

                setValue('rut', rut.length > 2 ? formatRut(rut, false) : rut);
              },
              onBlur: (event) => {
                const rut = event.target.value;
                if (validateRut(rut)) {
                  setValue('rut', formatRut(rut, false));
                }
              },
            })}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password">Clave de acceso:</label>
          {/* TODO: Validar con react-hook-form, no con validacion del HTML */}
          <div className="input-group mb-3">
            <input
              id="password"
              type={verClave ? 'text' : 'password'}
              className="form-control"
              required
              {...register('clave')}
            />
            <button
              className="btn btn-primary"
              tabIndex={-1}
              type="button"
              id="button-addon2"
              title={verClave ? 'Ocultar clave' : 'Ver clave'}
              onClick={() => setVerClave((x) => !x)}>
              <i className={`bi ${verClave ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
            </button>
          </div>
        </div>
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
