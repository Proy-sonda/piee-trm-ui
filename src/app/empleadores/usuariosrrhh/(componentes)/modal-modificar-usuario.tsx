import React from 'react';

interface ModalModificarUsuarioProps {}

const ModalModificarUsuario: React.FC<ModalModificarUsuarioProps> = ({}) => {
  return (
    <>
      <div
        className="modal fade"
        id="modusr"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Modificar Usuario
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <label>RUN</label>
                  <input type="text" className="form-control" disabled value={'111111'} />
                </div>
                <div className="col-md-6">
                  <label>Nombre</label>
                  <input type="text" className="form-control" value={'Juan'} />
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-6">
                  <label>Apellido</label>
                  <input type="text" className="form-control" value={'Rodriguez'} />
                </div>
                <div className="col-md-6">
                  <label>Correo</label>
                  <input type="text" className="form-control" value={'juan@gmail.com'} />
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-6">
                  <label>RRHH</label>
                  <select className="form-select">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary">
                Modificar
              </button>
              <button type="button" className="btn btn-success" data-bs-dismiss="modal">
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalModificarUsuario;
