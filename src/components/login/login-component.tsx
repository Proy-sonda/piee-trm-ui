'use client';

import { AuthContext } from '@/contexts';
import { useForm } from '@/hooks/use-form';
import {
  AutenticacionTransitoriaError,
  LoginPasswordInvalidoError,
  RutInvalidoError,
  UsuarioNoExisteError,
} from '@/servicios/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useContext, useState } from 'react';
import Swal from 'sweetalert2';
import styles from './login.module.css';
import ModalCambiarClaveTemporal from './modal-cambiar-clave-temporal';
import ModalClaveEnviada from './modal-clave-enviada';
import ModalRecuperarClave from './modal-recuperar-clave';

type LoginComponentProps = {
  buttonText?: string;
};

export const LoginComponent: React.FC<LoginComponentProps> = ({ buttonText = 'Ingresar' }) => {
  const [showModalCambiarClave, setShowModalCambiarClave] = useState(false);

  const [showModalRecuperarClave, setShowModalRecuperarClave] = useState(false);

  const [showModalClaveEnviada, setShowModalClaveEnviada] = useState(false);

  const router = useRouter();

  const searchParams = useSearchParams();

  const { login } = useContext(AuthContext);

  const { rutusuario, clave, onInputChange, onInputValidRut } = useForm({
    claveanterior: '',
    clavenuevauno: '',
    clavenuevados: '',
    rutusuario: '',
    clave: '',
    rutrecu: '',
  });

  const input: any = {
    clave: false,
    claveanterior: false,
    clavenuevauno: false,
    clavenuevados: false,
  };

  const handleLoginUsuario = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!rutusuario || !clave) {
      return Swal.fire('Error', 'Debe completar los campos', 'error');
    }

    try {
      await login(rutusuario, clave);

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
        // setShow('show');
        // setDisplay('block');
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

  const [visibleInput, setvisibleInput] = useState(input);

  const verClave = (e: FormEvent<HTMLButtonElement>, textbox: string) => {
    e.preventDefault();

    setvisibleInput({
      ...visibleInput,
      [textbox]: !visibleInput[textbox],
    });
  };

  return (
    <>
      <form onSubmit={handleLoginUsuario} className={styles.formlogin}>
        <label>
          Ingresa tus credenciales de acceso al Portal Integrado para Entidades Empleadoras
        </label>
        <br />

        <div className="mb-3 mt-3">
          <label htmlFor="username">RUN Persona Usuaria:</label>
          <input
            type="text"
            name="rutusuario"
            className="form-control"
            value={rutusuario}
            onChange={onInputValidRut}
            minLength={9}
            maxLength={10}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password">Clave de acceso:</label>
          <div className="input-group mb-3">
            <input
              type={visibleInput.clave ? 'text' : 'password'}
              className="form-control"
              name="clave"
              aria-describedby="button-addon2"
              value={clave}
              onChange={onInputChange}
              required
            />
            <button
              className="btn btn-primary"
              tabIndex={-1}
              type="button"
              id="button-addon2"
              title={visibleInput.clave ? 'Ocultar clave' : 'Ver clave'}
              onClick={(e) => verClave(e, 'clave')}>
              {visibleInput.clave ? (
                <i className="bi bi-eye-slash-fill"></i>
              ) : (
                <i className="bi bi-eye-fill"></i>
              )}
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
          <button type="submit" className={'btn btn-primary'}>
            Ingresar
          </button>
        </div>
      </form>

      <ModalCambiarClaveTemporal
        rutUsuario={rutusuario}
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
