'use client';

import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import Titulo from '@/components/titulo/titulo';

import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import 'animate.css';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { formatRut, validateRut } from 'rutlib';
import Swal from 'sweetalert2';
import TablaTrabajadores from './(componentes)/tabla-trabajadores';
import { Trabajador } from './(modelos)/';
import {
  actualizarTrabajador,
  buscarTrabajadoresDeUnidad,
  buscarUnidadesDeEmpleador,
  crearTrabajador,
  eliminarTrabajador,
} from './(servicios)/';
import styles from './trabajadores.module.css';

interface TrabajadoresPageProps {
  searchParams: {
    idunidad: number;
    razon: string;
    rutempleador: string;
  };
}

const TrabajadoresPage: React.FC<TrabajadoresPageProps> = ({ searchParams }) => {
  const [unidad, setunidad] = useState('');
  const [csvData, setCsvData] = useState<any>([]);
  let [loading, setLoading] = useState(false);
  const [error, seterror] = useState({
    run: false,
    file: false,
  });
  const { idunidad, razon, rutempleador } = searchParams;
  const [editar, seteditar] = useState<Trabajador>({
    idtrabajador: 0,
    unidad: {
      idunidad: 0,
    },
  });
  const { register, setValue, getValues } = useForm<{ run: string; file: FileList | null }>({
    mode: 'onBlur',
  });
  const [rutedit, setrutedit] = useState<string>();
  const [show, setshow] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const [err, datosPagina, pendiente] = useMergeFetchObject(
    {
      trabajadores: buscarTrabajadoresDeUnidad(Number(idunidad)),
      unidadEmpleador: buscarUnidadesDeEmpleador(rutempleador),
    },
    [refresh],
  );

  useEffect(() => setunidad(datosPagina?.unidadEmpleador[0].unidad || ''), [datosPagina]);

  const refrescarComponente = () => setRefresh(Math.random());

  const handleEditTrabajador = (idtrabajador: number, idunidad: number, ruttrabajador: string) => {
    seteditar({
      idtrabajador: idtrabajador,
      unidad: {
        idunidad: idunidad,
      },
    });
    setrutedit(ruttrabajador);
    refrescarComponente();
    setshow(true);
  };

  const handleClose = () => setshow(false);

  const handleDeleteTrabajador = (idtrabajador: number, rut: string) => {
    const EliminarTrabajador = async () => {
      const data = await eliminarTrabajador(idtrabajador);

      if (data.ok) {
        refrescarComponente();
        return Swal.fire({
          html: `Persona trabajadora ${rut} fue eliminada con éxito`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      }
      Swal.fire({ html: 'Ha ocurrido un problema', icon: 'error' });
    };
    Swal.fire({
      icon: 'question',
      html: `¿Desea eliminar a la persona trabajadora <b>${rut}</b>?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Si',
      confirmButtonColor: 'var(--color-blue)',
      denyButtonColor: 'var(--bs-danger)',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) EliminarTrabajador();
    });
  };

  const handleChangeUnidad = (event: ChangeEvent<HTMLSelectElement>) => {
    seteditar({
      idtrabajador: editar?.idtrabajador,
      unidad: {
        idunidad: Number(event.target.value),
      },
    });
  };

  const handleSubmitEdit = () => {
    const ActualizaTrabajador = async () => {
      const data = await actualizarTrabajador(editar);
      if (data.ok) {
        Swal.fire({
          html: 'Trabajador modificado con éxito',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        setshow(false);
        refrescarComponente();
      } else {
        Swal.fire({ html: 'Se ha producido un error', icon: 'error' });
      }
    };

    ActualizaTrabajador();
  };

  const handleAddTrabajador = (e: FormEvent) => {
    e.preventDefault();
    if (error) return;
    setLoading(true);

    const crearTrabajadorAux = async () => {
      const data = await crearTrabajador({
        ruttrabajador: getValues('run'),
        unidad: {
          idunidad: Number(idunidad),
        },
      });

      if (data.ok) {
        Swal.fire({
          html: 'Persona trabajadora agregada correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        const obtenerTrabajadorUnidad = async () => {
          refrescarComponente();
        };
        obtenerTrabajadorUnidad();
        setLoading(false);
      } else {
        setLoading(false);
        let msgError: string | boolean = await data.text();
        if (msgError.includes('trabajador ya existe')) msgError = '<p>Trabajador ya existe</p>';
        if (msgError.includes('verificador invalido'))
          msgError = '<p>Código verificador invalido</p>';

        Swal.fire({
          html: 'Existe un problema al momento de grabar ' + (msgError ? msgError : data.text()),
          icon: 'error',
        });
      }
    };

    crearTrabajadorAux();
  };

  const handleClickNomina = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!getValues('file')) return;
    if (error.file)
      return Swal.fire({
        icon: 'error',
        html: 'Debe cargar solo archivos de tipo "csv"',
        confirmButtonColor: 'var(--color-blue)',
      });

    const file = getValues('file')![0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const content = e.target.result;
      const lines = content.split('\n');

      setCsvData(lines);
    };

    reader.readAsText(file);
    console.log(csvData);
  };

  return (
    <>
      <div className="bgads">
        <div className="me-5 ms-5 animate__animate animate__fadeIn">
          <div className="row mt-5">
            <Titulo url="">
              Entidad Empleadora / Dirección y Unidades RRHH - {razon} / Trabajadores - {unidad}
            </Titulo>
          </div>

          <div className="row mt-2">
            <div className="col-md-6 col-xs-12">
              <h5>Cargar Trabajadores</h5>
              <sub style={{ color: 'blue' }}>Agregar Persona Trabajadora</sub>
              <br />
              <form onSubmit={handleAddTrabajador}>
                <div className="row mt-2">
                  <div className="col-md-8 position-relative">
                    <label htmlFor="run">RUN</label>
                    <input
                      type="text"
                      className={error.run ? 'form-control is-invalid' : 'form-control'}
                      minLength={4}
                      maxLength={11}
                      {...register('run', {
                        required: {
                          value: true,
                          message: 'Este campo es obligatorio',
                        },
                        onChange: (event) => {
                          if (!validateRut(formatRut(event.target.value))) {
                            seterror({
                              ...error,
                              run: true,
                            });
                            setValue('run', formatRut(event.target.value, false));
                          } else {
                            seterror({
                              ...error,
                              run: false,
                            });
                            setValue('run', formatRut(event.target.value, false));
                          }
                        },

                        onBlur: (event) => {
                          if (!validateRut(formatRut(event.target.value))) {
                            seterror({
                              ...error,
                              run: true,
                            });
                            setValue('run', formatRut(event.target.value, false));
                          } else {
                            seterror({
                              ...error,
                              run: false,
                            });
                            setValue('run', formatRut(event.target.value, false));
                          }
                        },
                      })}
                    />
                    <IfContainer show={error.run}>
                      <div className="invalid-tooltip">Debe ingresar un RUT valido</div>
                    </IfContainer>
                  </div>
                  <div
                    className="col-md-4"
                    style={{
                      alignSelf: 'end',
                    }}>
                    <div className="d-grid gap-2 d-md-flex">
                      <button type="submit" className="btn btn-success btn-sm">
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <br />

            <div className="col-md-6 col-xs-12">
              <h5>Cargar Nómina</h5>
              <sub>
                Para poder cargar trabajadores de la unidad <b>{unidad}</b>, solo tiene que
                seleccionar un archivo (formato CSV) según el{' '}
                <span className={styles['span-link']}>siguiente formato</span>
              </sub>
              <div className="row mt-3">
                <div className="col-md-6 position-relative">
                  <input
                    type="file"
                    accept=".csv"
                    className={error.file ? 'form-control is-invalid' : 'form-control'}
                    {...register('file', {
                      onChange: (event: ChangeEvent<HTMLInputElement>) => {
                        if (!event.target.files) setValue('file', event.target.files);
                        if (!getValues('file')![0].name.includes('csv')) {
                          seterror({ ...error, file: true });
                        } else {
                          seterror({ ...error, file: false });
                        }
                      },
                    })}
                  />
                  <IfContainer show={error.file}>
                    <div className="invalid-tooltip">Debe ingresar un archivo con formato .csv</div>
                  </IfContainer>
                </div>

                <div className="col-md-6 col-xs-6">
                  <div className="d-grid gap-2 d-md-flex">
                    <button className="btn btn-success btn-sm" onClick={handleClickNomina}>
                      Grabar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      disabled={!getValues('file') ? true : false}
                      onClick={async (event) => {
                        event.preventDefault();
                        if (!getValues('file')) return;
                        const resp = await Swal.fire({
                          icon: 'question',
                          html: `¿Desea eliminar el archivo <b>${
                            getValues('file')![0].name
                          }</b> cargado?`,
                          confirmButtonColor: 'var(--color-blue)',
                          confirmButtonText: 'Sí',
                          showDenyButton: true,
                          denyButtonColor: 'var(--bs-danger)',
                        });
                        if (resp.isDenied || resp.isDismissed) return;
                        seterror({
                          ...error,
                          file: false,
                        });
                        setValue('file', null);
                      }}>
                      Borrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-5">
            <div className="col-md-12 text-center">
              <h5>Trabajadores</h5>

              <hr />
              <IfContainer show={pendiente || loading}>
                <div className="mb-5">
                  <LoadingSpinner titulo="Cargando trabajadores..." />
                </div>
              </IfContainer>
              <IfContainer show={!pendiente || !loading}>
                {datosPagina?.trabajadores?.length || 0 > 0 ? (
                  <TablaTrabajadores
                    handleDeleteTrabajador={handleDeleteTrabajador}
                    handleEditTrabajador={handleEditTrabajador}
                    idunidad={idunidad}
                    trabajadores={datosPagina?.trabajadores || []}
                  />
                ) : (
                  <div className="text-center">
                    <b>No se han encontrado trabajadores</b>
                  </div>
                )}
              </IfContainer>
            </div>
          </div>
          <div
            className="row mt-2"
            style={{
              alignSelf: 'end',
            }}>
            <div className="col-md-6"></div>
            <div className="col-md-6 text-end">
              <button className="btn btn-danger" onClick={() => window.history.go(-2)}>
                Volver
              </button>
            </div>
          </div>
          <br />
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modificar Persona Trabajadora</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                <label>Run</label>
                <input
                  type="text"
                  className="form-control"
                  disabled
                  value={rutedit}
                  onChange={(e) => e.preventDefault}
                />
              </div>
              <div className="col-md-6">
                <label>Unidad</label>
                <select
                  className="form-select"
                  value={editar?.unidad.idunidad}
                  onChange={handleChangeUnidad}>
                  <option value={''}>Seleccionar</option>
                  {datosPagina?.unidadEmpleador.length || 0 > 0 ? (
                    datosPagina?.unidadEmpleador.map(({ idunidad, unidad }) => (
                      <option key={idunidad} value={idunidad}>
                        {unidad}
                      </option>
                    ))
                  ) : (
                    <></>
                  )}
                </select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-danger" onClick={() => handleClose()}>
              Volver
            </button>{' '}
            &nbsp;
            <button type="submit" className="btn btn-primary" onClick={() => handleSubmitEdit()}>
              Grabar <i className="bi bi-floppy"></i>
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default TrabajadoresPage;
