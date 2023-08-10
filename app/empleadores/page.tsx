'use client';

import jwt_decode from 'jwt-decode';
import Link from 'next/link';
import { parseCookies } from 'nookies';
import { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import { LoginComponent } from '../components/login/LoginComponent';
import Position from '../components/stage/Position';
import { AuthContext } from '../contexts';
import { CompruebaToken } from '../helpers/adscripcion/LoginUsuario';
import styles from './page.module.css';

interface Trabajadores {
  id: number;
  value: string;
}

const EmpleadoresPage = () => {
  const [trabajadores, setData] = useState<any[]>([]);

  const { CompletarUsuario } = useContext(AuthContext);

  let cookie = parseCookies();
  let token = cookie.token;

  if (token == undefined) return <LoginComponent buttonText="Ingresar" />;

  token = token.replaceAll('Bearer ', '');
  let data: any = jwt_decode(token);

  CompruebaToken(token);

  const editarEmpleador = (empresa: string, rut: string) => {
    Swal.fire({
      title: 'Desascribir',
      html: `¿Esta seguro que desea desascribir: <b>${rut} - ${empresa}</b>?`,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonColor: 'red',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'var(--color-blue)',
    });
  };

  return (
    <div className="bgads">
      <Position position={4} />
      <div>
        <div className="ms-5 me-5">
          <div className="row">
            <div className="col-md-4">
              <h5>Listado de entidades empleadoras</h5>
            </div>
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <div className="float-end" style={{ cursor: 'pointer', color: 'blue' }}>
                Manual
                {/* TODO: REVISAR */}
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-3 float-end">
              <label>Razón Social</label>
              <input type="text" className="form-control" />
            </div>
            <div className="col-md-3 float-end">
              <label>RUT</label>
              <input type="text" className="form-control" />
            </div>
            <div className="col-md-6 float-end align-self-end">
              <button className="btn btn-primary">Buscar</button>
              <button
                className="ms-2 btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#Addsempresa">
                Inscribe Entidad Empleadora
              </button>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th style={{ width: '200px' }}>RUT</th>
                    <th>Razón Social</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="align-middle">
                    <td>
                      <Link href={`/empleadores/datos?rut=76279970-7&razon=BONILLA Y GOMEZ LTDA.`}>
                        76279970-7
                      </Link>
                    </td>
                    <td>BONILLA Y GOMEZ LTDA.</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => editarEmpleador('BONILLA Y GOMEZ LTDA.', '76279970-7')}>
                        Desascribir
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-3">
                <div>
                  <ul className="pagination">
                    <li className="page-item">
                      <a className="page-link" href="#">
                        Anterior
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        1
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        2
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        Siguiente
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <br />
        </div>
      </div>

      <div
        className="modal fade"
        id="DatosUsuario"
        tabIndex={-1}
        aria-labelledby="DatosUsuarioLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="DatosUsuarioLabel">
                Actualización Datos Usuarios
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-4">
                  <label>RUT Empleador (*)</label>
                  <input type="text" className="form-control" value={'7777792'} disabled />
                </div>
                <div className="col-md-4">
                  <label>Razón Social/Nombre particular (*)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={'BONILLA Y GOMEZ LTDA.'}
                    disabled
                  />
                </div>
              </div>

              <div className="row mt-2">
                <table className="table table-hover">
                  <thead>
                    <tr className={`text-center ${styles['text-tr']}`}>
                      <th>RUT</th>
                      <th>Razón Social</th>
                      <th>Teléfono</th>
                      <th>Correo electrónico</th>
                      <th>Rol</th>
                      <th>RRHH</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-center align-middle">
                      <td>11230233-9</td>
                      <td>MARCELO</td>
                      <td>997948811</td>
                      <td>marcelo.ortiz.silva@gmail.com</td>

                      <td>
                        <select className="form-select" style={{ fontSize: '13px' }} disabled>
                          <option>Administrador</option>
                        </select>
                      </td>
                      <td>
                        <select className="form-select" style={{ fontSize: '13px' }}>
                          <option>Sarragosi</option>
                        </select>
                      </td>
                      <td>
                        <div className="d-inline-grid gap-2">
                          <button className="btn btn-success" style={{ fontSize: '13px' }}>
                            + Agregar Usuario
                          </button>{' '}
                          &nbsp;
                          <button className="btn btn-danger" style={{ fontSize: '13px' }}>
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="row mt-2">
                <h5>Datos del Usuario</h5>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label className="form-text">RUT</label>
                  <input type="text" className="form-control" value={'112302239'} disabled />
                </div>

                <div className="col-md-3">
                  <label className="form-text">Nombres</label>
                  <input type="text" className="form-control" value={'MARCELO'} />
                </div>
                <div className="col-md-3">
                  <label className="form-text">Apellidos</label>
                  <input type="text" className="form-control" value={'ORTIZ'} />
                </div>
                <div className="col-md-3">
                  <label className="form-text">Rol</label>
                  <select className="form-select">
                    <option>Administrador</option>
                  </select>
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
                  <small id="cempleHelp" className="form-text text-muted"></small>
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
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary">
                Actualizar Datos
              </button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="DatosRRHH"
        tabIndex={-1}
        aria-labelledby="DatosRRHHLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="DatosRRHHLabel">
                Actualización Datos Unidades RRHH
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-4">
                  <label>RUT Empleador (*)</label>
                  <input type="text" className="form-control" value={'7777792'} disabled />
                </div>
                <div className="col-md-4">
                  <label>Razón Social/Nombre particular (*)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={'BONILLA Y GOMEZ LTDA.'}
                    disabled
                  />
                </div>
              </div>

              <div className="row mt-2">
                <table className="table table-hover">
                  <thead>
                    <tr className={`text-center ${styles['text-tr']}`}>
                      <th>Nombre</th>
                      <th>Código</th>
                      <th>Dirección</th>
                      <th>Teléfono</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-center align-middle">
                      <td>sarragosi</td>
                      <td>1</td>
                      <td>sarragosi</td>
                      <td>222250208</td>

                      <td>
                        <div className="d-inline-grid gap-2">
                          <button className="btn btn-success" style={{ fontSize: '13px' }}>
                            + Agregar RRHH
                          </button>{' '}
                          &nbsp;
                          <button className="btn btn-danger" style={{ fontSize: '13px' }}>
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label className="form-text">Identificador Único</label>
                  <input type="text" className="form-control" value={'1'} />
                </div>

                <div className="col-md-3">
                  <label className="form-text">Nombre</label>
                  <input type="text" className="form-control" value={'sarragosi'} />
                </div>
                <div className="col-md-3">
                  <label className="form-text">Región</label>
                  <select className="form-select">
                    <option>RM</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-text">Comuna</label>
                  <select className="form-select">
                    <option>Providencia</option>
                  </select>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label className="form-text">Calle</label>
                  <input type="text" className="form-control" value={'sarragosi'} />
                </div>
                <div className="col-md-3">
                  <label className="form-text">N° casa/Departamento</label>
                  <input type="text" className="form-control" value={'1460'} />
                </div>

                <div className="col-md-3">
                  <label className="sr-only" htmlFor="tel1">
                    Teléfono
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
                      value={'22225208'}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.modalfoot}>
              <button className="btn btn-success" style={{ float: 'left' }}>
                Agregar Trabajadores
              </button>
              <button type="button" className="btn btn-primary">
                Actualizar Datos
              </button>
              &nbsp;
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="Addsempresa"
        tabIndex={-1}
        aria-labelledby="AddsempresaLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="AddsempresaLabel">
                Inscribir Entidad Empleadora
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="ms-3 me-3">
                <form>
                  <div
                    style={{
                      marginLeft: '15px',
                      marginRight: '15px',
                    }}></div>

                  <br />
                  <div className="row">
                    <div
                      className="float-end text-end"
                      style={{
                        marginRight: '3%',
                        paddingRight: '3%',
                        color: 'blueviolet',
                      }}>
                      <label>(*) Son campos obligatorios.</label>
                    </div>
                  </div>

                  <div className="ms-5 me-5">
                    <div className="row mt-2">
                      <div className="col-md-4">
                        <label htmlFor="exampleInputEmail1">
                          RUN Entidad Empleadora/ Persona Trabajadora Independiente (*)
                        </label>
                        <input
                          type="text"
                          name="rut"
                          className="form-control"
                          aria-describedby="rutHelp"
                        />
                        <small
                          id="rutHelp"
                          className="form-text text-muted"
                          style={{ fontSize: '10px' }}>
                          No debe incluir guiones ni puntos (EJ: 175967044)
                        </small>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">Razón Social/ Nombre (*)</label>
                          <input
                            type="text"
                            name="razon"
                            className="form-control"
                            aria-describedby="razonHelp"
                            placeholder=""
                          />
                          <small id="razonHelp" className="form-text text-muted"></small>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="templeador">Tipo de Entidad Empleadora (*)</label>
                        <select className="form-select" id="templeador">
                          <option>Seleccionar</option>
                        </select>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-md-4">
                        <label htmlFor="ccaf">Seleccione CCAF a la cual está afiliada (*)</label>
                        <select className="form-select" id="ccaf">
                          <option>Seleccionar</option>
                          <option>No Afiliada</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="alaboralemp">
                          Actividad Laboral Entidad Empleadora (*)
                        </label>
                        <select className="form-select" id="alaboralemp">
                          <option>Seleccionar</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="region">Región (*)</label>
                        <select className="form-select" id="region">
                          <option>Seleccionar</option>
                        </select>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-md-4">
                        <label htmlFor="comuna">Comuna (*)</label>
                        <select className="form-select" id="comuna">
                          <option>Seleccionar</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="exampleInputEmail1">Calle (*)</label>
                        <input
                          type="text"
                          name="calle"
                          className="form-control"
                          aria-describedby="calleHelp"
                          placeholder=""
                        />
                        <small id="calleHelp" className="form-text text-muted"></small>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="exampleInputEmail1">Número (*)</label>
                        <input
                          type="text"
                          name="numero"
                          className="form-control"
                          aria-describedby="numHelp"
                          placeholder=""
                        />
                        <small id="numHelp" className="form-text text-muted"></small>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-md-4">
                        <label htmlFor="exampleInputEmail1">Block / Departamento</label>
                        <input
                          type="text"
                          name="bdep"
                          className="form-control"
                          aria-describedby="bdepHelp"
                          placeholder=""
                        />
                        <small id="bdepHelp" className="form-text text-muted"></small>
                      </div>
                      <div className="col-md-4">
                        <label className="sr-only" htmlFor="tel1">
                          Teléfono 1 (*)
                        </label>
                        <div className="input-group mb-2">
                          <div className="input-group-prepend">
                            <div className="input-group-text">+56</div>
                          </div>
                          <input type="text" className="form-control" id="tel1" name="tf1" />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <label className="sr-only" htmlFor="tel2">
                          Teléfono 2 (*)
                        </label>
                        <div className="input-group mb-2">
                          <div className="input-group-prepend">
                            <div className="input-group-text">+56</div>
                          </div>
                          <input type="text" className="form-control" id="tel2" name="tf2" />
                        </div>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-md-4">
                        <label htmlFor="exampleInputEmail1">
                          Correo electrónico entidad empleadora (*)
                        </label>
                        <input
                          type="mail"
                          name="cemple"
                          className="form-control"
                          aria-describedby="cempleHelp"
                          placeholder=""
                        />
                        <small id="cempleHelp" className="form-text text-muted">
                          ejemplo@ejemplo.cl
                        </small>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="exampleInputEmail1">
                          Repetir correo electrónico entidad empleadora (*)
                        </label>
                        <input
                          type="mail"
                          name="recemple"
                          className="form-control"
                          aria-describedby="recempleHelp"
                          placeholder=""
                        />
                        <small id="recempleHelp" className="form-text text-muted"></small>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="qtrabajadores">N° de personas trabajadoras (*)</label>

                          <select className="form-select" id="qtrabajadores">
                            {trabajadores.map(({ id, value }: Trabajadores) => (
                              <option key={id} id={id.toString()}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="sremuneraciones">Sistema de Remuneración</label>
                        <select className="form-select" id="sremuneraciones">
                          <option>Seleccionar</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary">
                Confirmar Adscripción
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpleadoresPage;
