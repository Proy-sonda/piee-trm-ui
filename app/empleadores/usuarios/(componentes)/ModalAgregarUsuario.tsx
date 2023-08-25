import IfContainer from '@/app/components/IfContainer';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { useMergeFetchResponseObject } from '@/app/hooks/useMergeFetch';
import React from 'react';
import { buscarRolesUsuarios } from '../(servicios)/rolesUsuarios';

interface ModalAgregarUsuarioProps {}

const ModalAgregarUsuario: React.FC<ModalAgregarUsuarioProps> = ({}) => {
  const [errCombos, combos, estaPendiente] = useMergeFetchResponseObject({
    roles: buscarRolesUsuarios(),
  });

  return (
    <div
      className="modal fade"
      id="AddUsr"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Agregar Nuevo Usuario
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>

          <div className="modal-body">
            <IfContainer show={estaPendiente}>
              <LoadingSpinner />
            </IfContainer>

            <IfContainer show={!estaPendiente}>
              <div className="row mt-2">
                <h5>Datos del Usuario </h5>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label className="form-text">RUT</label>
                  <input type="text" className="form-control" value={''} />
                  <small id="rutHelp" className="form-text text-muted" style={{ fontSize: '10px' }}>
                    No debe incluir guiones ni puntos (EJ: 175967044)
                  </small>
                </div>

                <div className="col-md-3">
                  <label className="form-text">Nombres</label>
                  <input type="text" className="form-control" value={''} />
                </div>
                <div className="col-md-3">
                  <label className="form-text">Apellidos</label>
                  <input type="text" className="form-control" value={''} />
                </div>
                <div className="col-md-3">
                  <label className="form-text">Fecha de nacimiento</label>
                  <input type="date" className="form-control" value={''} />
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label className="sr-only" htmlFor="tel1">
                    Teléfono 1
                  </label>
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text">+56</div>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      id="tel1"
                      name="tf1"
                      value={'997948811'}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <label className="sr-only" htmlFor="tel1">
                    Teléfono 2
                  </label>
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text">+56</div>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      id="tel1"
                      name="tf1"
                      value={'222250208'}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <label htmlFor="exampleInputEmail1">Correo electrónico</label>
                  <input
                    type="mail"
                    name="cemple"
                    className="form-control"
                    aria-describedby="cempleHelp"
                    value={'marcelo.ortiz.silva@gmail.com'}
                    placeholder=""
                  />
                  <small id="cempleHelp" className="form-text text-muted">
                    ejemplo@ejemplo.cl
                  </small>
                </div>
                <div className="col-md-3">
                  <label htmlFor="exampleInputEmail1">Repetir Correo</label>
                  <input
                    type="mail"
                    name="cemple"
                    className="form-control"
                    aria-describedby="cempleHelp"
                    value={'marcelo.ortiz.silva@gmail.com'}
                    placeholder=""
                  />
                  <small id="cempleHelp" className="form-text text-muted"></small>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label>Dirección</label>
                  <input type="text" className="form-control" />
                </div>

                <div className="col-md-3">
                  <label className="form-text">Rol</label>
                  <select className="form-select">
                    <option>Seleccionar</option>
                    {combos &&
                      combos.roles.map((rol) => (
                        <option key={rol.idrol} value={rol.idrol}>
                          {rol.rol}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </IfContainer>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-primary" disabled={estaPendiente}>
              Guardar
            </button>
            <button type="button" className="btn btn-success" data-bs-dismiss="modal">
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarUsuario;
