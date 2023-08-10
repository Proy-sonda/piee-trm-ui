'use client';

import Position from '@/app/components/stage/Position';
import Stage from '@/app/components/stage/Stage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';

interface UnidadRRHHProps {
  searchParams: {
    rut: string;
    razon: string;
  };
}

const UnidadRRHH = ({ searchParams }: UnidadRRHHProps) => {
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
              <div className="left right active">
                <Link href={`/empleadores/unidad?rut=${rut}&razon=${razon}`}>Unidad de RRHH</Link>
                &nbsp;
              </div>
              <div className="left">
                <Link href={`/empleadores/usuarios?rut=${rut}&razon=${razon}`}>Usuarios</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-8">
            <Stage manual="" url="#">
              Entidad Empleadora / Dirección y Unidades RRHH - {razon}
            </Stage>
          </div>

          <div className="col-md-4">
            <label style={{ cursor: 'pointer', color: 'blue' }}>Manual</label>
            <br />
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-8"></div>
          <div className="col-md-4 float-end">
            <button
              className="btn btn-success btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#AddURHH">
              + Agregar Unidad RRHH
            </button>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-12">
            <table className="table table-hover">
              <thead className="text-center">
                <tr>
                  <th>Nombre</th>
                  <th>Código</th>
                  <th>Dirección</th>
                  <th>Teléfono</th>
                  <th>Correo electrónico</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="text-center align-middle">
                <tr>
                  <td>Prueba 3</td>
                  <td>1</td>
                  <td>Lincoyan 1050</td>
                  <td>1234567</td>
                  <td>elepe@ejemplo.cl</td>
                  <td>
                    <button
                      className="btn text-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#modrrhh">
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button className="btn text-primary">
                      <i className="bi bi-trash3"></i>
                    </button>
                    <Link
                      href={`/empleadores/trabajadores?unidad=${'Prueba 3'}&id=${'1'}&razon=${razon}`}
                      className="btn btn-success btn-sm">
                      Trabajadores
                    </Link>{' '}
                    &nbsp;
                    <Link
                      href={`/empleadores/usuariosrhh?unidad=${'Prueba 3'}&id=${'1'}&razon=${razon}`}
                      className="btn btn-success btn-sm">
                      Usuarios
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>Prueba 3</td>
                  <td>1</td>
                  <td>Lincoyan 1050</td>
                  <td>1234567</td>
                  <td>elepe@ejemplo.cl</td>
                  <td>
                    <button
                      className="btn text-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#modrrhh">
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button className="btn text-primary">
                      <i className="bi bi-trash3"></i>
                    </button>
                    <Link
                      href={`/empleadores/trabajadores?unidad=${'Prueba 3'}&id=${'1'}&razon=${razon}`}
                      className="btn btn-success btn-sm">
                      Trabajadores
                    </Link>{' '}
                    &nbsp;
                    <Link
                      href={`/empleadores/usuariosrhh?unidad=${'Prueba 3'}&id=${'1'}&razon=${razon}`}
                      className="btn btn-success btn-sm">
                      Usuarios
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>Prueba 3</td>
                  <td>1</td>
                  <td>Lincoyan 1050</td>
                  <td>1234567</td>
                  <td>elepe@ejemplo.cl</td>
                  <td>
                    <button
                      className="btn text-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#modrrhh">
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button className="btn text-primary">
                      <i className="bi bi-trash3"></i>
                    </button>
                    <Link
                      href={`/empleadores/trabajadores?unidad=${'Prueba 3'}&id=${'1'}&razon=${razon}`}
                      className="btn btn-success btn-sm">
                      Trabajadores
                    </Link>{' '}
                    &nbsp;
                    <Link
                      href={`/empleadores/usuariosrhh?unidad=${'Prueba 3'}&id=${'1'}&razon=${razon}`}
                      className="btn btn-success btn-sm">
                      Usuarios
                    </Link>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <nav aria-label="Page navigation example" className="float-end">
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
                      {/* <li className="page-item"><a className="page-link" href="#">3</a></li> */}
                      <li className="page-item">
                        <a className="page-link" href="#">
                          Siguiente
                        </a>
                      </li>
                    </ul>
                  </div>
                </nav>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="AddURHH"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Crear nueva Unidad RRHH
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row mt-2">
                <div className="col-md-3">
                  <label className="form-text">Nombre</label>
                  <input type="text" className="form-control" value={''} />
                </div>
                <div className="col-md-3">
                  <label className="form-text">Región</label>
                  <select className="form-select">
                    <option>Seleccionar</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-text">Comuna</label>
                  <select className="form-select">
                    <option>Seleccionar</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-text">Calle</label>
                  <input type="text" className="form-control" value={''} />
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label className="form-text">N° Calle</label>
                  <input type="text" className="form-control" value={''} />
                </div>
                <div className="col-md-3">
                  <label className="form-text">N° casa/Departamento</label>
                  <input type="text" className="form-control" value={''} />
                </div>
                <div className="col-md-3">
                  <label className="form-text">Identificador Único</label>
                  <input type="text" className="form-control" value={''} />
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
              <div className="row mt-2">
                <div className="col-md-3">
                  <label>Correo electrónico unidad RRHH</label>
                  <input type="email" className="form-control" />
                  <small id="cempleHelp" className="form-text text-muted">
                    ejemplo@ejemplo.cl
                  </small>
                </div>

                <div className="col-md-3">
                  <label>Repetir correo electrónico</label>
                  <input type="email" className="form-control" />
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

      <div
        className="modal fade"
        id="modrrhh"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Modificar Unidad RRHH
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row mt-2">
                <div className="col-md-3">
                  <label className="form-text">Nombre</label>
                  <input type="text" className="form-control" value={''} />
                </div>
                <div className="col-md-3">
                  <label className="form-text">Región</label>
                  <select className="form-select">
                    <option>Seleccionar</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-text">Comuna</label>
                  <select className="form-select">
                    <option>Seleccionar</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-text">Calle</label>
                  <input type="text" className="form-control" value={''} />
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label className="form-text">N° Calle</label>
                  <input type="text" className="form-control" value={''} />
                </div>
                <div className="col-md-3">
                  <label className="form-text">N° casa/Departamento</label>
                  <input type="text" className="form-control" value={''} />
                </div>
                <div className="col-md-3">
                  <label className="form-text">Identificador Único</label>
                  <input type="text" className="form-control" value={''} />
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
              <div className="row mt-2">
                <div className="col-md-3">
                  <label>Correo electrónico unidad RRHH</label>
                  <input type="email" className="form-control" />
                  <small id="cempleHelp" className="form-text text-muted">
                    ejemplo@ejemplo.cl
                  </small>
                </div>

                <div className="col-md-3">
                  <label>Repetir correo electrónico</label>
                  <input type="email" className="form-control" />
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
    </div>
  );
};

export default UnidadRRHH;
