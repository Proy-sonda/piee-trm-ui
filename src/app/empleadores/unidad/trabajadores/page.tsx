'use client';

import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import Titulo from '@/components/titulo/titulo';

import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import 'animate.css';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
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
  const [arrerror, setarrerror] = useState(false);
  const [rutconerror, setrutconerror] = useState<any[]>([]);
  const [csvData, setCsvData] = useState<any>([]);
  let [loading, setLoading] = useState(false);
  const [error, seterror] = useState({
    run: false,
    file: false,
    lecturarut: false,
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

    if (error.run) return;
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
        refrescarComponente();
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

  const handleClickNomina = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!getValues('file') || getValues('file')?.length === 0) return;
    if (csvData.length == 0 || csvData == undefined) return;
    if (error.file)
      return Swal.fire({
        icon: 'error',
        html: 'Debe cargar solo archivos de tipo "csv"',
        confirmButtonColor: 'var(--color-blue)',
      });

    let errorEncontrado = csvData.find((rut: string) => !validateRut(formatRut(rut, false)));
    setCsvData(csvData.filter((rut: string) => !validateRut(formatRut(rut, false)) === true));

    if (errorEncontrado?.trim() != '' && errorEncontrado != undefined) {
      return Swal.fire({
        icon: 'error',
        html: `Existe un error en el formato del RUT <b>${errorEncontrado}</b> <br/> Verifique el documento`,
        confirmButtonColor: 'var(--color-blue)',
      });
    }

    let cuentaGrabados = 0;

    for (let index = 0; index < csvData.length; index++) {
      const element = csvData[index];

      if (element.trim() != '') {
        const data = await crearTrabajador({
          ruttrabajador: formatRut(element, false),
          unidad: {
            idunidad: Number(idunidad),
          },
        });

        if (data.ok) {
          cuentaGrabados++;
        } else {
          setrutconerror([
            ...rutconerror,
            {
              rut: element,
              error: (await data.text()).includes('trabajador ya existe')
                ? 'Trabajador ya existe'
                : 'Formato de rut',
            },
          ]);
        }
      }
    }

    if (cuentaGrabados > 0) {
      Swal.fire({
        icon: 'success',
        html: `Se han grabado ${cuentaGrabados} trabajadores con éxito`,
        showConfirmButton: false,
        timer: 2000,
        didClose: () => {
          if (rutconerror.length > 0) setarrerror(true);
        },
      });
    } else {
      Swal.fire({
        icon: 'info',
        html: 'No se ha añadido ningún trabajador',
        confirmButtonColor: 'var(--color-blue)',
        didClose: () => {
          if (rutconerror.length > 0) setarrerror(true);
        },
      });
    }

    refrescarComponente();
  };

  return (
    <>
      <Modal
        show={arrerror}
        onHide={() => {
          setarrerror(false);
        }}>
        <Modal.Header closeButton>
          <Modal.Title>Rut con errores</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table className="table table-hover text-center">
            <Thead>
              <Tr>
                <Th>RUT</Th>
                <Th>ERROR</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rutconerror.map((value: any) => (
                <Tr key={value.rut}>
                  <Td>{value.rut}</Td>
                  <Td>{value.error}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
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
                <a
                  className={styles['span-link']}
                  download="formato.csv"
                  href="data:text/csv;base64,Nzc3MDYxMjcKOTkxMTQ1NWsKNzM1MTMxNTQKMTYwOTY0NDQ4CjUyMDkwOTJrCjU2NzU1NTg2CjExODYwODM0OAoyMjE4MDkxODEKODA1Mzg5MWsKMjM4MzYzMTg3CjI0Njk3ODk5LTkK">
                  siguiente formato
                </a>
              </sub>
              <div className="row mt-3">
                <div className="col-md-6 position-relative">
                  <input
                    type="file"
                    accept=".csv"
                    className={error.file ? 'form-control is-invalid' : 'form-control'}
                    {...register('file', {
                      onChange: (event: ChangeEvent<HTMLInputElement>) => {
                        if (event.target.files?.length == 0) return setValue('file', null);
                        if (!event.target.files) setValue('file', event.target.files);
                        if (!getValues('file')![0].name.includes('csv')) {
                          seterror({ ...error, file: true });
                        } else {
                          seterror({ ...error, file: false });
                          const file = event.target.files![0];
                          const reader = new FileReader();
                          reader.onload = (e: any) => {
                            const content = e.target.result.trim();
                            const lines = content.split('\n');
                            setCsvData(lines);
                          };

                          reader.readAsText(file);
                        }
                      },
                      onBlur: (event: ChangeEvent<HTMLInputElement>) => {
                        if (event.target.files?.length == 0) return setValue('file', null);
                        if (!event.target.files) setValue('file', event.target.files);
                        if (!getValues('file')![0].name.includes('csv')) {
                          seterror({ ...error, file: true });
                        } else {
                          seterror({ ...error, file: false });
                          const file = event.target.files![0];
                          const reader = new FileReader();
                          reader.onload = (e: any) => {
                            const content = e.target.result.trim();
                            const lines = content.split('\n');
                            setCsvData(lines);
                          };

                          reader.readAsText(file);
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
                    <button
                      disabled={
                        getValues('file')?.length === 0 || !getValues('file') ? true : false
                      }
                      className="btn btn-success btn-sm"
                      onClick={handleClickNomina}>
                      Cargar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      disabled={
                        getValues('file')?.length === 0 || !getValues('file') ? true : false
                      }
                      onClick={async (event) => {
                        event.preventDefault();
                        if (getValues('file')?.length === 0) return;
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
                      Borrar todo
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
