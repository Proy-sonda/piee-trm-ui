'use client';

import Position from '@/app/components/stage/Position';
import Stage from '@/app/components/stage/Stage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';

interface UsuariosProps {
  searchParams: {
    rut: string;
    razon: string;
  };
}

const UnidadRRHH = ({ searchParams }: UsuariosProps) => {
  const router = useRouter();

  const { rut, razon } = searchParams;
  let valorSInguion = rut?.replaceAll('-', '');

  let cookie = parseCookies();
  let token = cookie.token;

  if (!token) {
    router.push('/login');
    return null;
  }

  return (
    <div className="bgads">
      <Position position={4} />

      <div className="container">
        <div className="row">
          <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-3">
            <div id="flowBoxes">
              <div className="right">
                <Link href={`/empleadores/datos?rut=${rut}&razon=${razon}`}>
                  Datos Entidad Empleadora
                </Link>{' '}
                &nbsp;
              </div>
              <div className="left right">
                <Link href={`/empleadores/unidad?rut=${rut}&razon=${razon}`}>Unidad de RRHH</Link>
                &nbsp;
              </div>
              <div className="left active">
                <Link href={`/empleadores/usuarios?rut=${rut}&razon=${razon}`}>Usuarios</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-8">
            <Stage manual="" url="#">
              Entidad Empleadora / Usuarios - {razon}
            </Stage>
          </div>

          <div className="col-md-4">
            <label style={{ cursor: 'pointer', color: 'blue' }}>Manual</label>
            <br />
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-8"></div>
          <div className="col-md-4">
            <button
              className="btn btn-success btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#AddUsr">
              + Agregar Usuario
            </button>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-12">
            <table className="table table-hover">
              <thead className="text-center align-middle">
                <tr>
                  <th>RUT</th>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Correo electrónico</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="text-center align-middle">
                <tr>
                  <td>12404183-k</td>
                  <td>Teresa</td>
                  <td>1234567</td>
                  <td>tgonzalez@fonasa.cl</td>
                  <td>
                    <select className="form-select" disabled>
                      <option>Administrador</option>
                    </select>
                  </td>
                  <td>Activo</td>
                  <td>
                    <button className="btn text-primary">
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button className="btn text-primary">
                      <i className="bi bi-trash3"></i>
                    </button>
                    <button className="btn text-primary" title="Reenviar clave">
                      <i className="bi bi-key"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>12404183-k</td>
                  <td>Teresa</td>
                  <td>1234567</td>
                  <td>tgonzalez@fonasa.cl</td>
                  <td>
                    <select className="form-select" disabled>
                      <option>Administrador</option>
                    </select>
                  </td>
                  <td>Activo</td>
                  <td>
                    <button className="btn text-primary">
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button className="btn text-primary">
                      <i className="bi bi-trash3"></i>
                    </button>
                    <button className="btn text-primary" title="Reenviar clave">
                      <i className="bi bi-key"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
                Agregar nuevo usuario
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row mt-2">
                <h5>Datos del Usuario</h5>
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
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary">
                Guardar
              </button>
              <button type="button" className="btn btn-success" data-bs-dismiss="modal">
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnidadRRHH;
