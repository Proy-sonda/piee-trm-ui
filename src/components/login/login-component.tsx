'use client';

import { AuthContext } from '@/contexts';
import { useForm } from '@/hooks/use-form';
import {
  AutenticacionTransitoriaError,
  LoginPasswordInvalidoError,
  RutInvalidoError,
  UsuarioNoExisteError,
} from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useContext, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { validateRut } from 'rutlib';
import Swal from 'sweetalert2';
import styles from './login.module.css';

type LoginComponentProps = {
  buttonText?: string;
};

type changePass = {
  rutusuario: string;
  claveanterior: string;
  clavenuevauno: string;
  clavenuevados: string;
};

export const LoginComponent: React.FC<LoginComponentProps> = ({ buttonText = 'Ingresar' }) => {
  const [show, setShow] = useState('');
  const [display, setDisplay] = useState('none');
  const [showModalRecu, setShowModalRecu] = useState(false);
  const [showModalRecu2, setshowModalRecu2] = useState(false);

  const router = useRouter();

  const searchParams = useSearchParams();

  const handleShowModalRecu = () => {
    setShowModalRecu(true);
  };

  const handleCloseModalRecu = () => {
    setShowModalRecu(false);
    onResetForm();
  };

  const handleCloseModalRecu2 = () => {
    setshowModalRecu2(false);
  };

  const handleShowModalRecu2 = () => {
    setshowModalRecu2(true);
  };

  const { login } = useContext(AuthContext);

  const {
    rutusuario,
    clave,
    claveanterior,
    clavenuevauno,
    clavenuevados,
    rutrecu,
    onInputChange,
    onInputValidRut,
    onResetForm,
  } = useForm({
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
        didClose: () => router.push(searchParams.get('redirectTo') ?? '/tramitacion'),
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
        setShow('show');
        setDisplay('block');
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

  const ChangeTemporal = async () => {
    if (!claveanterior) {
      return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe ingresar clave transitoria',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: 'var(--color-blue)',
      });
    }

    if (clavenuevauno != clavenuevados) {
      return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas deben coincidir',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: 'var(--color-blue)',
      });
    }

    let PostVal: changePass = {
      rutusuario: rutusuario,
      claveanterior: claveanterior,
      clavenuevauno: clavenuevauno,
      clavenuevados: clavenuevados,
    };

    const resp = await fetch(`${apiUrl()}/auth/change`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(PostVal),
    });

    if (resp.ok) {
      return Swal.fire({
        html: 'Contraseña actualizada correctamente, vuelva a iniciar sesión',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        willClose: () => {
          OncloseModal();
          onResetForm();
        },
      });
    }

    const body = await resp.json();
    if (body.message === 'Login/Password invalida') {
      return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La clave temporal es inválida',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: 'var(--color-blue)',
      });
    }

    return Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al actualizar la contraseña',
      showConfirmButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: 'var(--color-blue)',
    });
  };

  const validaRut = async () => {
    if (rutrecu == '') {
      return Swal.fire({
        html: 'El campo RUT no puede estar vació',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
    }

    if (!validateRut(rutrecu)) {
      return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El RUT ingresado no es válido',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: 'var(--color-blue)',
      });
    }

    handleCloseModalRecu();

    const data = await fetch(`${apiUrl()}/auth/recover`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rutusuario: rutrecu,
      }),
    });

    if (data.ok) {
      OncloseModal();
      return handleShowModalRecu2();
    }

    const resp = await data.json();
    if (resp.statusCode == 401)
      return Swal.fire({
        html: resp.message,
        icon: 'error',
        showConfirmButton: false,
        timer: 2000,
      });
  };

  const OncloseModal = () => {
    setShow('');
    setDisplay('none');
    onResetForm();
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
      <div
        className={`modal fade ${show}`}
        style={{ display: display }}
        id="modalclavetransitoria"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Clave Transitoria
              </h1>
              <button
                type="button"
                onClick={OncloseModal}
                className="btn-close"
                aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <h6>
                Tu cuenta posee con una clave transitoria, completa el siguiente formulario para
                activar tu cuenta.
              </h6>
              <br />
              <label htmlFor="transitoria">Contraseña transitoria</label>
              <div className="input-group mb-3">
                <input
                  type={visibleInput.claveanterior ? 'text' : 'password'}
                  className="form-control"
                  name="claveanterior"
                  aria-describedby="button-addon2"
                  value={claveanterior}
                  onChange={onInputChange}
                  required
                />
                <button
                  className="btn btn-primary"
                  type="button"
                  tabIndex={-1}
                  id="button-addon2"
                  title={visibleInput.claveanterior ? 'Ocultar clave' : 'Ver clave'}
                  onClick={(e) => verClave(e, 'claveanterior')}>
                  {visibleInput.claveanterior ? (
                    <i className="bi bi-eye-slash-fill"></i>
                  ) : (
                    <i className="bi bi-eye-fill"></i>
                  )}
                </button>
              </div>

              <label htmlFor="claveuno">Contraseña Nueva</label>
              <div className="input-group mb-3">
                <input
                  type={visibleInput.clavenuevauno ? 'text' : 'password'}
                  className="form-control"
                  name="clavenuevauno"
                  aria-describedby="button-addon2"
                  value={clavenuevauno}
                  onChange={onInputChange}
                  required
                />
                <button
                  className="btn btn-primary"
                  type="button"
                  tabIndex={-1}
                  id="button-addon2"
                  title={visibleInput.clavenuevauno ? 'Ocultar clave' : 'Ver clave'}
                  onClick={(e) => verClave(e, 'clavenuevauno')}>
                  {visibleInput.clavenuevauno ? (
                    <i className="bi bi-eye-slash-fill"></i>
                  ) : (
                    <i className="bi bi-eye-fill"></i>
                  )}
                </button>
              </div>

              <label htmlFor="claveuno">Repetir Contraseña</label>
              <div className="input-group mb-3">
                <input
                  type={visibleInput.clavenuevados ? 'text' : 'password'}
                  className="form-control"
                  name="clavenuevados"
                  aria-describedby="button-addon2"
                  value={clavenuevados}
                  onChange={onInputChange}
                  required
                />
                <button
                  className="btn btn-primary"
                  type="button"
                  tabIndex={-1}
                  id="button-addon2"
                  title={visibleInput.clavenuevados ? 'Ocultar clave' : 'Ver clave'}
                  onClick={(e) => verClave(e, 'clavenuevados')}>
                  {visibleInput.clavenuevados ? (
                    <i className="bi bi-eye-slash-fill"></i>
                  ) : (
                    <i className="bi bi-eye-fill"></i>
                  )}
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={OncloseModal}>
                Cerrar
              </button>
              <button type="button" className="btn btn-primary" onClick={ChangeTemporal}>
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

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
            onClick={handleShowModalRecu}>
            Recuperar clave de acceso
          </label>{' '}
          &nbsp;
          <button type="submit" className={'btn btn-primary'}>
            Ingresar
          </button>
        </div>
      </form>

      <Modal show={showModalRecu} onHide={handleCloseModalRecu} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Recuperar Clave de acceso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Escriba su RUT para solicitar una nueva clave de acceso</p>
          <div className="row">
            <div className="col-md-12">
              <input
                type="text"
                className="form-control"
                name="rutrecu"
                value={rutrecu}
                onChange={onInputValidRut}
                autoComplete="off"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalRecu}>
            Cerrar
          </Button>
          <button type="button" className="btn btn-primary" onClick={validaRut}>
            Recuperar Clave
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showModalRecu2}
        onHide={handleCloseModalRecu2}
        backdrop="static"
        keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Recuperar Clave de acceso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row text-center" style={{ textAlign: 'justify' }}>
            <p>¡Felicitaciones!</p>
            <p>
              Hemos creado y enviado a su correo una nueva clave temporal para acceder al Portal de
              Tramitación.
            </p>
            {/* Descomentar cuando se implemente la vigencia de la clave temporal */}
            {/* <p>Esta clave tiene una vigencia de 48 horas</p> */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={handleCloseModalRecu2} className="btn btn-primary">
            Aceptar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
