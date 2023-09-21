import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';

interface FormularioCambiarClaveTransitoria {
  claveTransitoria: string;
  nuevaClave: string;
  confirmaClave: string;
}

interface ModalCambiarClaveTemporalProps {
  show: boolean;
  onCerrarModal: () => void;
  onClaveCambiada: () => void;
}

const ModalCambiarClaveTemporal: React.FC<ModalCambiarClaveTemporalProps> = ({
  show,
  onCerrarModal,
  onClaveCambiada,
}) => {
  const [verClaveTemporal, setVerClaveTemporal] = useState(false);
  const [verNuevaClave, setVerNuevaClave] = useState(false);
  const [verConfirmaClave, setVerConfirmaClave] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormularioCambiarClaveTransitoria>({
    mode: 'onBlur',
  });

  const handleCerrarModal = () => {
    onCerrarModal();
  };

  const cambiarClaveTransitoria: SubmitHandler<FormularioCambiarClaveTransitoria> = () => {
    // if (!claveanterior) {
    //   return Swal.fire({
    //     icon: 'error',
    //     title: 'Error',
    //     text: 'Debe ingresar clave transitoria',
    //     showConfirmButton: true,
    //     confirmButtonText: 'OK',
    //     confirmButtonColor: 'var(--color-blue)',
    //   });
    // }
    // if (clavenuevauno != clavenuevados) {
    //   return Swal.fire({
    //     icon: 'error',
    //     title: 'Error',
    //     text: 'Las contraseñas deben coincidir',
    //     showConfirmButton: true,
    //     confirmButtonText: 'OK',
    //     confirmButtonColor: 'var(--color-blue)',
    //   });
    // }
    // let PostVal: changePass = {
    //   rutusuario: rutusuario,
    //   claveanterior: claveanterior,
    //   clavenuevauno: clavenuevauno,
    //   clavenuevados: clavenuevados,
    // };
    // const resp = await fetch(`${apiUrl()}/auth/change`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(PostVal),
    // });
    // if (resp.ok) {
    //   return Swal.fire({
    //     html: 'Contraseña actualizada correctamente, vuelva a iniciar sesión',
    //     icon: 'success',
    //     timer: 2000,
    //     showConfirmButton: false,
    //     willClose: () => {
    //       OncloseModal();
    //       onResetForm();
    //     },
    //   });
    // }
    // const body = await resp.json();
    // if (body.message === 'Login/Password invalida') {
    //   return Swal.fire({
    //     icon: 'error',
    //     title: 'Error',
    //     text: 'La clave temporal es inválida',
    //     showConfirmButton: true,
    //     confirmButtonText: 'OK',
    //     confirmButtonColor: 'var(--color-blue)',
    //   });
    // }
    // return Swal.fire({
    //   icon: 'error',
    //   title: 'Error',
    //   text: 'Hubo un error al actualizar la contraseña',
    //   showConfirmButton: true,
    //   confirmButtonText: 'OK',
    //   confirmButtonColor: 'var(--color-blue)',
    // });
  };

  return (
    <>
      <Modal show={show} onHide={handleCerrarModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Clave Transitoria</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit(cambiarClaveTransitoria)}>
          <Modal.Body>
            <h6>
              Tu cuenta posee con una clave transitoria, completa el siguiente formulario para
              activar tu cuenta.
            </h6>
            <br />
            <label htmlFor="transitoria">Contraseña transitoria</label>
            <div className="input-group mb-3">
              <input
                type={verClaveTemporal ? 'text' : 'password'}
                className="form-control"
                // name="claveanterior"
                // aria-describedby="button-addon2"
                // value={claveanterior}
                // onChange={onInputChange}
                // required
              />
              <button
                className="btn btn-primary"
                type="button"
                tabIndex={-1}
                id="button-addon2"
                title={verClaveTemporal ? 'Ocultar clave' : 'Ver clave'}
                onClick={() => setVerClaveTemporal((x) => !x)}>
                <i className={'bi ' + verClaveTemporal ? 'bi-eye-slash-fill' : 'bi-eye-fill'}></i>
              </button>
            </div>

            <label htmlFor="claveuno">Contraseña Nueva</label>
            <div className="input-group mb-3">
              <input
                type={verNuevaClave ? 'text' : 'password'}
                className="form-control"
                // name="clavenuevauno"
                // aria-describedby="button-addon2"
                // value={clavenuevauno}
                // onChange={onInputChange}
                // required
              />
              <button
                className="btn btn-primary"
                type="button"
                tabIndex={-1}
                id="button-addon2"
                title={verNuevaClave ? 'Ocultar clave' : 'Ver clave'}
                onClick={() => setVerNuevaClave((x) => !x)}>
                <i className={'bi ' + verNuevaClave ? 'bi-eye-slash-fill' : 'bi-eye-fill'}></i>
              </button>
            </div>

            <label htmlFor="claveuno">Repetir Contraseña</label>
            <div className="input-group mb-3">
              <input
                type={verConfirmaClave ? 'text' : 'password'}
                className="form-control"
                // name="clavenuevados"
                // aria-describedby="button-addon2"
                // value={clavenuevados}
                // onChange={onInputChange}
                // required
              />
              <button
                className="btn btn-primary"
                type="button"
                tabIndex={-1}
                id="button-addon2"
                title={verConfirmaClave ? 'Ocultar clave' : 'Ver clave'}
                onClick={() => setVerConfirmaClave((x) => !x)}>
                <i className={'bi ' + verConfirmaClave ? 'bi-eye-slash-fill' : 'bi-eye-fill'}></i>
              </button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-secondary" onClick={handleCerrarModal}>
              Cerrar
            </button>
            <button type="submit" className="btn btn-primary">
              Actualizar
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default ModalCambiarClaveTemporal;
