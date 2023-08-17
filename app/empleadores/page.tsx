'use client';

import jwt_decode from 'jwt-decode';
import Link from 'next/link';
import { parseCookies } from 'nookies';
import { FormEvent, useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { LoginComponent } from '../components/login/LoginComponent';
import Paginacion from '../components/paginacion/paginacion';
import usePaginacion from '../components/paginacion/paginacion.hook';
import Position from '../components/stage/Position';
import { EmpleadorContext } from '../contexts/EmpleadorContext';
import {
  CCACTLABCB,
  CCAFCB,
  CCCOMUNACB,
  CCREGIONCB,
  CCREMUNERACION,
  CCTAMANOCB,
  CCTIPOEM,
} from '../contexts/interfaces/types';
import {
  CargaEmpleadores,
  Desadscribir,
  InscribirEmpleador,
} from '../helpers/tramitacion/empleadores';
import useCombo from '../hooks/useCombo';
import { useForm } from '../hooks/useForm';
import { Empleador } from './interface/empleador';
import { inscribeEmpleador } from './interface/inscribeEmpleador';
import styles from './page.module.css';

const initialComuna: CCCOMUNACB[] = [
  {
    idcomuna: 0,
    nombre: '',
    region: {
      idregion: 0,
      nombre: '',
    },
  },
];

const EmpleadoresPage = () => {
  const [empleadores, setempleadores] = useState<Empleador[]>([]);
  let CCTIPOEMP: CCTIPOEM[] = useCombo('/tipoempleador/all');
  let CCCOMUNA: CCCOMUNACB[] = useCombo('/comuna/all/region');
  let CCAF: CCAFCB[] = useCombo('/ccaf/all');
  let CCREGION: CCREGIONCB[] = useCombo('/Region/all');
  let CCACTLAB: CCACTLABCB[] = useCombo('/actividadlaboral/all');
  let CCREMUNERACION: CCREMUNERACION[] = useCombo('/sistemaremuneracion/all');
  let CCTAMANOCB: CCTAMANOCB[] = useCombo('/tamanoempresa/all');

  const [ValidMail, setValidMail] = useState('');

  const { empleador, cargaEmpleador } = useContext(EmpleadorContext);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const forms = document.querySelectorAll('.needs-validation');
      Array.from(forms).forEach((form: any) => {
        form.addEventListener(
          'submit',
          (event: Event) => {
            if (!form.checkValidity()) {
              event.preventDefault();
              event.stopPropagation();
            }

            if (ValidMail == 'is-invalid') {
              event.preventDefault();
              event.stopPropagation();
              return;
            }
            form.classList.add('was-validated');
          },
          false,
        );
      });
    }
  }, []);

  const [region, setregion] = useState('');
  const [comunas, setcomuna] = useState(initialComuna);

  const {
    inscribeRun,
    razonsocial,
    templeador,
    ccaf,
    alaboralemp,
    ccomuna,
    sremun,
    npersonas,
    calle,
    numero,
    bdep,
    tf1,
    tf2,
    onInputValidRut,
    cemple,
    recemple,
    onInputChange,
    onInputChangeOnlyNum,
  } = useForm({
    inscribeRun: '',
    razonsocial: '',
    templeador: '',
    ccaf: '',
    alaboralemp: '',
    ccomuna: '',
    npersonas: '',
    calle: '',
    numero: '',
    bdep: '',
    tf1: '',
    tf2: '',
    cemple: '',
    recemple: '',
  });

  const {
    datosPaginados: empleadoresPaginados,
    totalPaginas,
    cambiarPaginaActual,
  } = usePaginacion({
    datos: empleadores,
    tamanoPagina: 5,
  });

  useEffect(() => {
    const loadEmpleador = async () => {
      let respuesta = await CargaEmpleadores('');
      setempleadores(respuesta);
      cargaEmpleador(respuesta);
    };
    loadEmpleador();
  }, []);

  const onChangeRegion = (event: any) => {
    setregion(event.target.value);
    CCCOMUNA = CCCOMUNA.filter(({ region: { idregion } }) => idregion == event.target.value);
    setcomuna(CCCOMUNA);
  };

  const DesadscribirEmp = (empresa: string, rut: string) => {
    Swal.fire({
      title: 'Desadscribir',
      html: `¿Esta seguro que desea desadscribir: <b>${rut} - ${empresa}</b>?`,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonColor: 'red',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'var(--color-blue)',
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        let resp: Response = await Desadscribir(rut);
        if (resp.ok) {
          Swal.fire({
            icon: 'success',
            html: `Entidad empleadora: ${empresa} fue eliminada con éxito`,
            timer: 3000,
            showConfirmButton: false,
          });
          const CargaEmpleador = async () => {
            let respuesta = await CargaEmpleadores('');
            setempleadores(respuesta);
          };
          CargaEmpleador();
        } else {
          Swal.fire({ icon: 'error', html: 'Hubo un problema en la operación' });
        }
      }
    });
  };
  let cookie = parseCookies();
  let token = cookie.token;

  if (token == undefined) return <LoginComponent buttonText="Ingresar" />;

  token = token.replaceAll('Bearer ', '');
  let data: any = jwt_decode(token);

  // CompruebaToken(token);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    let NuevoEmp: inscribeEmpleador = {
      rutempleador: inscribeRun,
      razonsocial: razonsocial,
      telefonohabitual: tf1,
      telefonomovil: tf2,
      email: cemple,
      emailconfirma: recemple,
      tipoempleador: {
        idtipoempleador: Number(templeador),
        tipoempleador: templeador,
      },
      ccaf: {
        idccaf: Number(ccaf),
        nombre: ccaf,
      },
      actividadlaboral: {
        idactividadlaboral: Number(alaboralemp),
        actividadlaboral: alaboralemp,
      },
      tamanoempresa: {
        idtamanoempresa: Number(npersonas),
        descripcion: npersonas,
        nrotrabajadores: Number(npersonas),
      },
      sistemaremuneracion: {
        idsistemaremuneracion: Number(sremun),
        descripcion: sremun,
      },
      direccionempleador: {
        comuna: {
          idcomuna: ccomuna,
          nombre: ccomuna,
        },
        calle: calle,
        depto: bdep,
        numero: numero,
      },
    };

    const Inscribir = async () => {
      const resp = await InscribirEmpleador(NuevoEmp);

      if (resp.ok) {
        const CargaEmpleador = async () => {
          let respuesta = await CargaEmpleadores('');
          setempleadores(respuesta);
        };
        CargaEmpleador();
        return Swal.fire({
          html: 'Operación realizada con éxito',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        let data = await resp.json();
        if (data.message.includes('rutempleador|ya existe'))
          data.message = 'Rut empleador ya existe';
        return Swal.fire({
          html: data.message,
          icon: 'error',
          timer: 3000,
          showConfirmButton: false,
        });
      }
    };

    Inscribir();
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
            <div className="col-md-10 col-xl-8">
              <table className="table table-hover">
                <thead className="align-middle">
                  <tr>
                    <th style={{ width: '100px' }}>RUT</th>
                    <th style={{ width: '150px' }}>Razón Social</th>
                    <th style={{ width: '20px' }}></th>
                  </tr>
                </thead>
                <tbody className="align-middle">
                  {empleadoresPaginados.length > 0 ? (
                    empleadoresPaginados.map((value: Empleador) => (
                      <tr key={value.rutempleador} className="align-middle">
                        <td>
                          <Link
                            href={`/empleadores/datos?rut=${value.rutempleador}&razon=${value.razonsocial}&id=${value.idempleador}`}>
                            {value.rutempleador}
                          </Link>
                        </td>
                        <td>{value.razonsocial}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={(e) => {
                              e.preventDefault();
                              DesadscribirEmp(value.razonsocial, value.rutempleador);
                            }}
                            title={`Desadscribir empleador ${value.razonsocial}`}>
                            Desadscribir
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>-</td>
                      <td>-</td>
                      <td></td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="mt-3">
                <Paginacion
                  totalPages={totalPaginas}
                  onCambioPagina={cambiarPaginaActual}
                  tamano="sm"
                />
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
                  <input type="text" className="form-control" disabled />
                </div>
                <div className="col-md-4">
                  <label>Razón Social/Nombre particular (*)</label>
                  <input type="text" className="form-control" disabled />
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
                  <input type="text" className="form-control" disabled />
                </div>

                <div className="col-md-3">
                  <label className="form-text">Nombres</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="col-md-3">
                  <label className="form-text">Apellidos</label>
                  <input type="text" className="form-control" />
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
                    <input type="text" className="form-control" id="tel1" name="tf1" />
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
                    <input type="text" className="form-control" id="tel1" name="tf1" />
                  </div>
                </div>

                <div className="col-md-3">
                  <label htmlFor="exampleInputEmail1">Correo electrónico</label>
                  <input
                    type="mail"
                    name="cemple"
                    className="form-control"
                    aria-describedby="cempleHelp"
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
                  <input type="text" className="form-control" disabled />
                </div>
                <div className="col-md-4">
                  <label>Razón Social/Nombre particular (*)</label>
                  <input type="text" className="form-control" disabled />
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
                  <input type="text" className="form-control" />
                </div>

                <div className="col-md-3">
                  <label className="form-text">Nombre</label>
                  <input type="text" className="form-control" />
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
                  <input type="text" className="form-control" />
                </div>
                <div className="col-md-3">
                  <label className="form-text">N° casa/Departamento</label>
                  <input type="text" className="form-control" />
                </div>

                <div className="col-md-3">
                  <label className="sr-only" htmlFor="tel1">
                    Teléfono
                  </label>
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text">+56</div>
                    </div>
                    <input type="text" className="form-control" id="tel1" name="tf1" />
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
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="ms-3 me-3">
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
                          name="inscribeRun"
                          maxLength={11}
                          value={inscribeRun}
                          onChange={onInputValidRut}
                          autoComplete="new-custom-value"
                          className="form-control"
                          aria-describedby="rutHelp"
                        />
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">Razón Social/ Nombre (*)</label>
                          <input
                            type="text"
                            name="razonsocial"
                            value={razonsocial}
                            onInput={onInputChange}
                            minLength={4}
                            maxLength={120}
                            autoComplete="new-custom-value"
                            className="form-control"
                            aria-describedby="razonHelp"
                            placeholder=""
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="templeador">Tipo de Entidad Empleadora (*)</label>
                        <select
                          className="form-select"
                          id="templeador"
                          name="templeador"
                          value={templeador}
                          onChange={onInputChange}
                          required>
                          <option value={''}>Seleccionar</option>
                          {CCTIPOEMP.map(({ idtipoempleador, tipoempleador }) => (
                            <option key={idtipoempleador} value={idtipoempleador}>
                              {tipoempleador}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-md-4">
                        <label htmlFor="ccaf">Seleccione CCAF a la cual está afiliada (*)</label>
                        <select
                          className="form-select"
                          id="ccaf"
                          name="ccaf"
                          value={ccaf}
                          onChange={onInputChange}>
                          <option value={''}>Seleccionar</option>
                          {CCAF.map(({ idccaf, nombre }) => (
                            <option key={idccaf} value={idccaf}>
                              {nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="alaboralemp">
                          Actividad Laboral Entidad Empleadora (*)
                        </label>
                        <select
                          className="form-select"
                          id="alaboralemp"
                          name="alaboralemp"
                          value={alaboralemp}
                          onChange={onInputChange}>
                          <option value={''}>Seleccionar</option>
                          {CCACTLAB.map(({ idactividadlaboral, actividadlaboral }) => (
                            <option key={idactividadlaboral} value={idactividadlaboral}>
                              {actividadlaboral}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="region">Región (*)</label>
                        <select
                          className="form-select"
                          id="region"
                          name="region"
                          value={region}
                          onChange={onChangeRegion}
                          required>
                          <option value={''}>Seleccionar</option>
                          {CCREGION.map(({ idregion, nombre }) => (
                            <option key={idregion} value={idregion}>
                              {nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-md-4">
                        <label htmlFor="comuna">Comuna (*)</label>
                        <select
                          className="form-select"
                          name="ccomuna"
                          value={ccomuna}
                          onChange={onInputChange}
                          required>
                          <option value={''}>Seleccionar</option>
                          {comunas.map(({ idcomuna, nombre }) => (
                            <option key={idcomuna} value={idcomuna}>
                              {nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="exampleInputEmail1">Calle (*)</label>
                        <input
                          type="text"
                          name="calle"
                          value={calle}
                          autoComplete="new-custom-value"
                          minLength={2}
                          maxLength={80}
                          onChange={onInputChange}
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
                          value={numero}
                          autoComplete="new-custom-value"
                          minLength={1}
                          maxLength={20}
                          onChange={onInputChangeOnlyNum}
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
                          value={bdep}
                          autoComplete="new-custom-value"
                          minLength={1}
                          maxLength={20}
                          onChange={onInputChange}
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
                          <input
                            type="text"
                            className="form-control"
                            id="tel1"
                            name="tf1"
                            maxLength={9}
                            minLength={9}
                            autoComplete="new-custom-value"
                            value={tf1}
                            onChange={onInputChangeOnlyNum}
                          />
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
                          <input
                            type="text"
                            className="form-control"
                            id="tel2"
                            name="tf2"
                            maxLength={9}
                            minLength={9}
                            autoComplete="new-custom-value"
                            value={tf2}
                            onChange={onInputChangeOnlyNum}
                          />
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
                          value={cemple}
                          onChange={onInputChange}
                          onPaste={(e) => e.preventDefault()}
                          onCopy={(e) => e.preventDefault()}
                          minLength={3}
                          maxLength={250}
                          autoComplete="new-custom-value"
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
                          value={recemple}
                          onChange={onInputChange}
                          minLength={3}
                          maxLength={350}
                          onPaste={(e) => e.preventDefault()}
                          onCopy={(e) => e.preventDefault()}
                          autoComplete="new-custom-value"
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

                          <select
                            className="form-select"
                            id="qtrabajadores"
                            name="npersonas"
                            value={npersonas}
                            onChange={onInputChange}
                            required>
                            <option value={''}>Seleccionar</option>
                            {CCTAMANOCB.map(({ idtamanoempresa, descripcion }) => (
                              <option key={idtamanoempresa} value={idtamanoempresa}>
                                {descripcion}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="sremuneraciones">Sistema de Remuneración</label>
                        <select
                          className="form-select"
                          id="sremuneraciones"
                          name="sremun"
                          value={sremun}
                          onChange={onInputChange}
                          required>
                          <option value={''}>Seleccionar</option>
                          {CCREMUNERACION.map(({ idsistemaremuneracion, descripcion }) => (
                            <option key={idsistemaremuneracion} value={idsistemaremuneracion}>
                              {' '}
                              {descripcion}{' '}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  Confirmar Adscripción
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpleadoresPage;
