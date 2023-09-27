'use client';

import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import Titulo from '@/components/titulo/titulo';

import TablaTrabajadores from '@/app/empleadores/[idempleador]/unidad/[idunidad]/trabajadores/(componentes)/tabla-trabajadores';
import {
  Trabajador,
  Trabajadores,
  UnidadEmpleador,
} from '@/app/empleadores/[idempleador]/unidad/[idunidad]/trabajadores/(modelos)';
import {
  actualizarTrabajador,
  buscarTrabajadoresDeUnidad,
  buscarUnidadesDeEmpleador,
  crearTrabajador,
  eliminarTrabajador,
} from '@/app/empleadores/[idempleador]/unidad/[idunidad]/trabajadores/(servicios)';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import 'animate.css';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { formatRut, validateRut } from 'rutlib';
import Swal from 'sweetalert2';

import { buscarEmpleadorPorId } from '@/app/empleadores/[idempleador]/datos/(servicios)/buscar-empleador-por-id';
import { ProgressBarCustom } from './(componentes)/progress-bar';
import styles from './trabajadores.module.css';

interface TrabajadoresPageProps {
  params: {
    idempleador: string;
    idunidad: string;
  };
}

const TrabajadoresPage: React.FC<TrabajadoresPageProps> = ({ params }) => {
  const [unidad, setunidad] = useState('');
  const [cuentagrabados, setcuentagrabados] = useState<number>(0);
  const [textProgress, settextProgress] = useState('');
  const [spinnerCargar, setspinnerCargar] = useState(false);
  const [unidadEmpleador, setunidadEmpleador] = useState<UnidadEmpleador[]>([]);
  const [trabajadores, settrabajadores] = useState<Trabajadores[]>([]);
  const [razon, setRazon] = useState('');
  const [csvData, setCsvData] = useState<any[]>([]);
  let [loading, setLoading] = useState(false);
  const [error, seterror] = useState({
    run: false,
    file: false,
    lecturarut: false,
  });
  const { idempleador, idunidad } = params;

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
      empleador: buscarEmpleadorPorId(Number(idempleador)),
    },
    [refresh],
  );

  useEffect(() => {
    if (datosPagina?.empleador != undefined) {
      const busquedaUnidadEmpleador = async () => {
        const [resp] = await buscarUnidadesDeEmpleador(datosPagina.empleador?.rutempleador || '');
        setunidadEmpleador(await resp());
        resp().then((value: UnidadEmpleador[]) => {
          setunidad(value.find((value) => value.idunidad === Number(idunidad))?.unidad || '');
        });
      };
      busquedaUnidadEmpleador();
    }
  }, [datosPagina?.empleador]);

  useEffect(() => {
    if (datosPagina?.trabajadores != undefined) {
      settrabajadores(datosPagina!?.trabajadores);
      setRazon(datosPagina!?.empleador!?.razonsocial);
    }
  }, [datosPagina?.trabajadores]);

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

  const handleDeleteAll = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const resp = await Swal.fire({
      icon: 'question',
      html: `¿Desea eliminar todos los trabajadores de la unidad "<b>${unidad}</b>"?`,
      confirmButtonColor: 'var(--color-blue)',
      confirmButtonText: 'Sí',
      showDenyButton: true,
      denyButtonText: 'No',
      denyButtonColor: 'var(--bs-danger)',
    });

    if (resp.isDenied) return;

    setspinnerCargar(true);
    let recuento = 0;
    settextProgress('Eliminando Trabajadores...');

    for (let index = 0; index < datosPagina!?.trabajadores.length; index++) {
      const element = datosPagina?.trabajadores[index];
      const resp = await eliminarTrabajador(element!?.idtrabajador);
      if (resp.ok) {
        recuento = ++recuento;
        setcuentagrabados((recuento / datosPagina!?.trabajadores.length) * 100);
      }
    }

    setspinnerCargar(false);
    if (recuento > 0) {
      Swal.fire({
        icon: 'success',
        html: `Se han eliminado un total de <b>${recuento}</b> trabajadores`,
        showConfirmButton: false,
        timer: 2000,
        didClose: () => {
          setcuentagrabados(0);
          settextProgress('');
          refrescarComponente();
        },
      });
    } else {
      Swal.fire({
        icon: 'error',
        html: `No se han eliminado los trabajadores`,
        confirmButtonColor: 'var(--color-blue)',
        didClose: () => {
          setcuentagrabados(0);
          settextProgress('');
          refrescarComponente();
        },
      });
    }
  };

  const handleAddTrabajador = (e: FormEvent) => {
    e.preventDefault();
    if (error.run) return;

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
        setValue('run', '');
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
    // if (csvData.length == 0 || csvData == undefined) return;
    if (error.file)
      return Swal.fire({
        icon: 'error',
        html: 'Debe cargar solo archivos de tipo "csv"',
        confirmButtonColor: 'var(--color-blue)',
      });

    let errorEncontrado = csvData.find(
      (rut: string) =>
        !validateRut(formatRut(rut, false)) ||
        Number(formatRut(rut, false).split('-')[0]) > 50000000,
    );
    setCsvData(csvData.filter((rut: string) => !validateRut(formatRut(rut, false)) === true));

    if (errorEncontrado?.trim() != '' && errorEncontrado != undefined) {
      return Swal.fire({
        icon: 'error',
        html: `Existe un error en el formato del RUT <b>${errorEncontrado}</b> <br/> Verifique el documento`,
        confirmButtonColor: 'var(--color-blue)',
      });
    }

    setspinnerCargar(true);
    let recuento = 0;
    settextProgress('Cargando Trabajadores...');

    for (let index = 0; index < csvData.length; index++) {
      const element = csvData[index];
      recuento = ++recuento;
      if (element.trim() != '') {
        const data = await crearTrabajador({
          ruttrabajador: formatRut(element, false),
          unidad: {
            idunidad: Number(idunidad),
          },
        });
        if (data.ok) {
          setcuentagrabados((recuento / csvData.length) * 100);
        } else {
        }
      }
    }

    if (recuento > 0) {
      setspinnerCargar(false);
      Swal.fire({
        icon: 'success',
        html: `Se han grabado <b>${recuento} trabajadores</b> con éxito`,
        showConfirmButton: false,
        timer: 2000,
        didClose: () => {
          setcuentagrabados(0);
          settextProgress('');
          setValue('file', null);
        },
      });
      refrescarComponente();
    } else {
      setspinnerCargar(false);
      Swal.fire({
        icon: 'info',
        html: 'Los trabajadores ya se encuentran registrados',
        confirmButtonColor: 'var(--color-blue)',
        didClose: () => {
          settextProgress('');
          setValue('file', null);
        },
      });
      settextProgress('');
    }
  };

  return (
    <>
      <ProgressBarCustom show={spinnerCargar} text={textProgress} count={cuentagrabados} />

      <div className="bgads">
        <div className="me-5 ms-5 animate__animate animate__fadeIn">
          <div className="row mt-5">
            <Titulo url="">
              Entidad Empleadora - <b>{razon}</b> / Dirección y Unidades RRHH - <b> {unidad} </b>/
              Trabajadores
            </Titulo>
          </div>

          <div className="row mt-2">
            <div className="col-md-5 col-xs-12">
              <h5>Cargar Trabajadores</h5>
              <sub style={{ color: 'blue' }}>Agregar RUN persona Trabajadora</sub>
              <br />
              <br />

              <form onSubmit={handleAddTrabajador}>
                <div className="row mt-1">
                  <div className="col-md-8 position-relative">
                    <input
                      id="run"
                      type="text"
                      className={error.run ? 'form-control is-invalid' : 'form-control'}
                      minLength={4}
                      maxLength={11}
                      {...register('run', {
                        required: {
                          value: true,
                          message: 'Este campo es obligatorio',
                        },
                        onChange: (event: ChangeEvent<HTMLInputElement>) => {
                          if (event.target.value.trim() == '') {
                            return seterror({ ...error, run: false });
                          }
                          if (Number(event.target.value.split('-')[0]) > 50000000)
                            return seterror({ ...error, run: true });
                          const regex = /[^0-9kK\-]/g; // solo números, puntos, guiones y la letra K
                          let rut = event.target.value as string;

                          if (regex.test(rut)) {
                            rut = rut.replaceAll(regex, '');
                          }

                          seterror({ ...error, run: !validateRut(formatRut(rut)) });

                          setValue('run', rut.length > 2 ? formatRut(rut, false) : rut);
                        },
                        onBlur: (event: ChangeEvent<HTMLInputElement>) => {
                          if (event.target.value.trim() == '') {
                            return seterror({ ...error, run: false });
                          }
                          if (Number(event.target.value.split('-')[0]) > 50000000)
                            return seterror({ ...error, run: true });
                          const rut = event.target.value as string;

                          seterror({ ...error, run: !validateRut(formatRut(rut)) });

                          setValue('run', rut.length > 2 ? formatRut(rut, false) : rut);
                        },
                      })}
                    />
                    <IfContainer show={error.run}>
                      <div className="invalid-tooltip">Debe ingresar un RUT valido</div>
                    </IfContainer>
                  </div>
                  <div className="d-block d-sm-none d-md-none d-xs-block">
                    <div className="col-md-12">
                      <br />
                    </div>
                  </div>
                  <div
                    className="col-md-4"
                    style={{
                      alignSelf: 'end',
                    }}>
                    <div className="d-grid gap-2 d-md-flex">
                      <button type="submit" className="btn btn-success">
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="d-block d-sm-none d-md-none">
              <div className="col-md-12">
                <br />
              </div>
            </div>

            <div className="col-md-7 col-xs-12">
              <h5>Cargar Nómina</h5>
              <sub className="d-inline d-sm-none d-xl-inline">
                Para poder cargar las personas trabajadoras de la unidad <b>{unidad}</b>, solo tiene
                que seleccionar un archivo (formato CSV) según el{' '}
                <a
                  className={styles['span-link']}
                  download="formato.csv"
                  href="data:text/csv;base64,Nzc3MDYxMjcKOTkxMTQ1NWsKNzM1MTMxNTQKMTYwOTY0NDQ4CjUyMDkwOTJrCjU2NzU1NTg2CjExODYwODM0OAoyMjE4MDkxODEKODA1Mzg5MWsKMjM4MzYzMTg3Cg==">
                  siguiente formato
                </a>
              </sub>
              <sub className="d-none d-sm-inline d-xl-none">
                Para poder cargar la nomina de las personas trabajadoras, se debe utilizar el{' '}
                <a
                  className={styles['span-link']}
                  download="formato.csv"
                  href="data:text/csv;base64,Nzc3MDYxMjcKOTkxMTQ1NWsKNzM1MTMxNTQKMTYwOTY0NDQ4CjUyMDkwOTJrCjU2NzU1NTg2CjExODYwODM0OAoyMjE4MDkxODEKODA1Mzg5MWsKMjM4MzYzMTg3Cg==">
                  siguiente formato
                </a>
              </sub>
              <div className="row mt-4">
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
                <div className="d-block d-sm-none d-md-none">
                  <div className="col-md-12">
                    <br />
                  </div>
                </div>
                <div className="col-md-6 col-xs-6">
                  <div className="d-grid gap-2 d-md-flex">
                    <button
                      disabled={
                        getValues('file')?.length === 0 || !getValues('file') ? true : false
                      }
                      className="btn btn-success"
                      onClick={handleClickNomina}>
                      Cargar
                    </button>
                    <button
                      disabled={
                        getValues('file')?.length === 0 || getValues('file') === null ? true : false
                      }
                      className="btn btn-primary"
                      onClick={async () => {
                        if (!getValues('file')) return;
                        const resp = await Swal.fire({
                          icon: 'question',
                          html: `¿Desea eliminar el fichero <b>${getValues('file')![0].name}</b>?`,
                          confirmButtonText: 'Sí',
                          confirmButtonColor: 'var(--color-blue)',
                          showDenyButton: true,
                          denyButtonText: 'No',
                          showCancelButton: false,
                          denyButtonColor: 'var(--bs-danger)',
                        });
                        if (resp.isConfirmed) {
                          setValue('file', null);
                          refrescarComponente();
                        }
                      }}>
                      Limpiar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-5">
            <div className="col-md-12">
              <div className="row">
                <h5 className="text-center">Trabajadores</h5>
                <span
                  className="text-end animate animate__fadeIn"
                  style={{
                    display: datosPagina!?.trabajadores.length > 1 ? 'block' : 'none',
                  }}>
                  <button className="btn btn-danger btn-sm" onClick={handleDeleteAll}>
                    Borrar todo
                  </button>
                </span>
              </div>

              <hr />
              <IfContainer show={pendiente || loading}>
                <div className="mb-5">
                  <LoadingSpinner titulo="Cargando trabajadores..." />
                </div>
              </IfContainer>
              <IfContainer show={!pendiente || !loading}>
                <div
                  className="row mb-2"
                  style={{ display: datosPagina?.trabajadores.length || 0 > 0 ? 'block' : 'none' }}>
                  <div className="col-md-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="...Búsqueda por Run"
                      onInput={(e: ChangeEvent<HTMLInputElement>) => {
                        e.preventDefault();
                        settrabajadores(
                          datosPagina?.trabajadores.filter((trabajador) =>
                            trabajador.ruttrabajador.includes(e.target.value.toUpperCase()),
                          ) ||
                            datosPagina?.trabajadores.filter((trabajador) =>
                              trabajador.fechaafiliacion
                                .toString()
                                .includes(e.target.value.toUpperCase()),
                            ) ||
                            [],
                        );
                      }}
                    />
                  </div>
                </div>
                {trabajadores.length || 0 > 0 ? (
                  <>
                    <TablaTrabajadores
                      unidad={unidad}
                      handleDeleteTrabajador={handleDeleteTrabajador}
                      handleEditTrabajador={handleEditTrabajador}
                      idunidad={Number(idunidad)}
                      trabajadores={trabajadores || []}
                    />
                  </>
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
              <button className="btn btn-danger" onClick={() => window.history.back()}>
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
                  {unidadEmpleador.length || 0 > 0 ? (
                    unidadEmpleador.map(({ idunidad, unidad }) => (
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
              Grabar
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default TrabajadoresPage;
