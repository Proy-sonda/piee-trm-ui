'use client';

import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import Titulo from '@/components/titulo/titulo';

import TablaTrabajadores from '@/app/empleadores/[rutempleador]/unidad/[idunidad]/trabajadores/(componentes)/tabla-trabajadores';
import { Trabajador } from '@/app/empleadores/[rutempleador]/unidad/[idunidad]/trabajadores/(modelos)';
import {
  actualizarTrabajador,
  buscarTrabajadoresDeUnidad,
  buscarUnidadesDeEmpleador,
  crearTrabajador,
  eliminarTrabajador,
} from '@/app/empleadores/[rutempleador]/unidad/[idunidad]/trabajadores/(servicios)';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import 'animate.css';
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { formatRut, validateRut } from 'rutlib';

import { useEmpleadorActual } from '@/app/empleadores/(contexts)/empleador-actual-context';
import { AuthContext } from '@/contexts';
import { Trabajadoresunidadrrhh, Unidadesrrhh } from '@/modelos/tramitacion';
import { AlertaConfirmacion, AlertaError, AlertaExito } from '@/utilidades/alertas';
import exportFromJSON from 'export-from-json';
import { Trabajadoresxrrhh } from '../../(modelos)/payload-unidades';
import { buscarUnidadPorId } from '../../(servicios)/buscar-unidad-por-id';
import { useRol } from '../../../(hooks)/use-Rol';
import { ProgressBarCustom } from './(componentes)/progress-bar';
import styles from './trabajadores.module.css';

interface TrabajadoresPageProps {
  params: {
    rutempleador: string;
    idunidad: string;
  };
}

const TrabajadoresPage: React.FC<TrabajadoresPageProps> = ({ params }) => {
  const [unidad, setunidad] = useState('');
  const [cuentagrabados, setcuentagrabados] = useState<number>(0);
  const [textProgress, settextProgress] = useState('');
  const [spinnerCargar, setspinnerCargar] = useState(false);
  const [unidadEmpleador, setunidadEmpleador] = useState<Unidadesrrhh[] | undefined>();
  const [trabajadores, settrabajadores] = useState<Trabajadoresunidadrrhh[]>([]);

  const { RolUsuario } = useRol();
  const { empleadorActual } = useEmpleadorActual();
  const [csvData, setCsvData] = useState<any[]>([]);
  let [loading, setLoading] = useState(false);
  const [error, seterror] = useState({
    run: false,
    file: false,
    lecturarut: false,
  });
  const { rutempleador, idunidad } = params;

  const [editar, seteditar] = useState<Trabajador>({
    runtrabajador: '',
    unidad: {
      codigounidad: '',
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
      trabajadores: buscarTrabajadoresDeUnidad(idunidad, rutempleador),
    },
    [refresh],
  );

  useEffect(() => {
    const busquedaUnidadEmpleador = async () => {
      const [resp] = await buscarUnidadesDeEmpleador(rutempleador, idunidad);
      const [unidadNombre] = await buscarUnidadPorId(idunidad);
      setunidad((await unidadNombre())!?.glosaunidadrrhh);
      setunidadEmpleador(await resp());
    };
    busquedaUnidadEmpleador();
  }, [trabajadores]);

  useEffect(() => {
    if (datosPagina?.trabajadores != undefined) {
      settrabajadores(datosPagina!?.trabajadores);
    }
  }, [datosPagina?.trabajadores || refresh]);

  const refrescarComponente = () => setRefresh(Math.random());

  const handleEditTrabajador = (codigounidad: string, runtrabajador: string) => {
    seteditar({
      runtrabajador,
      unidad: {
        codigounidad,
      },
    });
    setrutedit(runtrabajador);
    refrescarComponente();
    setshow(true);
  };

  const handleClose = () => setshow(false);

  const handleDeleteTrabajador = (trabajadores: Trabajadoresunidadrrhh) => {
    const EliminarTrabajador = async () => {
      const TrabajadorAEliminar: Trabajadoresxrrhh = {
        acciontraxrrhh: 3,
        codigounidadrrhh: trabajadores.codigounidadrrhh,
        runtrabajador: trabajadores.runtrabajador,
      };
      if (empleadorActual == undefined || usuario == undefined) return;
      const data = await eliminarTrabajador(
        TrabajadorAEliminar,
        usuario?.rut,
        empleadorActual?.rutempleador,
      );

      if (data.ok) {
        refrescarComponente();

        return AlertaExito.fire({
          html: `Persona trabajadora ${trabajadores.runtrabajador} fue eliminada con éxito`,
        });
      }
      AlertaError.fire({ html: 'Ha ocurrido un problema', icon: 'error' });
    };
    AlertaConfirmacion.fire({
      html: `¿Desea eliminar a la persona trabajadora <b>${trabajadores.runtrabajador}</b>?`,
    }).then((result) => {
      if (result.isConfirmed) EliminarTrabajador();
    });
  };

  const handleChangeUnidad = (event: ChangeEvent<HTMLSelectElement>) => {
    seteditar({
      runtrabajador: editar?.runtrabajador,
      unidad: {
        codigounidad: event.target.value,
      },
    });
  };

  const handleSubmitEdit = () => {
    const ActualizaTrabajador = async () => {
      if (usuario == undefined || empleadorActual == undefined) return;
      const data = await actualizarTrabajador(editar, usuario!?.rut, empleadorActual?.rutempleador);
      if (data.ok) {
        AlertaExito.fire({
          html: 'Persona Trabajadora modificada con éxito',
        });
        setshow(false);
        refrescarComponente();
      } else {
        AlertaError.fire({ html: 'Se ha producido un error' });
      }
    };

    ActualizaTrabajador();
  };

  const handleDeleteAll = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const resp = await AlertaConfirmacion.fire({
      html: `¿Desea eliminar todos los trabajadores de la unidad "<b>${unidad}</b>"?`,
    });

    if (resp.isDenied) return;

    setspinnerCargar(true);
    let recuento = 0;
    settextProgress('Eliminando Personas Trabajadoras...');

    for (let index = 0; index < datosPagina!?.trabajadores.length; index++) {
      const element = datosPagina?.trabajadores[index];
      if (element == undefined) return;
      const TrabajadorAEliminar: Trabajadoresxrrhh = {
        acciontraxrrhh: 3,
        codigounidadrrhh: element.codigounidadrrhh,
        runtrabajador: element.runtrabajador,
      };
      if (empleadorActual == undefined || usuario == undefined) return;

      const resp = await eliminarTrabajador(
        TrabajadorAEliminar,
        usuario?.rut,
        empleadorActual?.rutempleador,
      );
      if (resp.ok) {
        recuento = ++recuento;
        setcuentagrabados((recuento / datosPagina!?.trabajadores.length) * 100);
      }
    }

    setspinnerCargar(false);
    if (recuento > 0) {
      AlertaExito.fire({
        html: `Se han eliminado un total de <b>${recuento}</b> personas trabajadoras`,
        didClose: () => {
          setcuentagrabados(0);
          settextProgress('');
          refrescarComponente();
        },
      });
    } else {
      AlertaError.fire({
        html: `No se han eliminado las personas trabajadoras`,
        didClose: () => {
          setcuentagrabados(0);
          settextProgress('');
          refrescarComponente();
        },
      });
    }
  };

  const { usuario } = useContext(AuthContext);

  const handleAddTrabajador = (e: FormEvent) => {
    e.preventDefault();
    if (error.run) return;

    const crearTrabajadorAux = async () => {
      const trabajador: Trabajadoresxrrhh = {
        acciontraxrrhh: 1,
        codigounidadrrhh: idunidad,
        runtrabajador: getValues('run'),
      };

      if (empleadorActual == undefined || usuario == undefined) return;
      const data = await crearTrabajador(trabajador, empleadorActual?.rutempleador, usuario?.rut);

      if (data.ok) {
        AlertaExito.fire({ html: 'Persona trabajadora agregada correctamente' });
        refrescarComponente();
        setLoading(false);
        setValue('run', '');
      } else {
        setLoading(false);
        let msgError: string | boolean = await data.text();
        if (msgError.includes('trabajador ya existe en el empleador'))
          msgError = '<p>Persona trabajadora ya existe</p>';
        if (msgError.includes('verificador invalido'))
          msgError = '<p>Código verificador invalido</p>';

        AlertaError.fire({
          html: 'Existe un problema al momento de grabar ' + (msgError ? msgError : data.text()),
        });
      }
    };

    crearTrabajadorAux();
  };

  const handleClickNomina = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!getValues('file') || getValues('file')?.length === 0) return;
    // if (csvData.length == 0 || csvData == undefined) return;
    if (error.file) return AlertaError.fire({ html: 'Debe cargar solo archivos de tipo "csv"' });

    /* El regex verifica que el RUT tenga el formato "<correlativo>-<DV>" o "<correlativo>-<DV>"
     * para descartar los que tienen separadores de miles. Despues `validateRut` hace su magia
     * y verrifica que el rut sea valido. */
    let errorEncontrado = csvData
      .map((x: any) => (typeof x === 'string' ? x.trim() : x))
      .find(
        (rut: string) =>
          !rut.match(/^\d+-?[\dkK]$/g) ||
          !validateRut(formatRut(rut, false)) ||
          Number(formatRut(rut, false).split('-')[0]) > 50000000,
      );

    setCsvData(csvData.filter((rut: string) => !validateRut(formatRut(rut, false)) === true));

    if (errorEncontrado?.trim() != '' && errorEncontrado != undefined) {
      return AlertaError.fire({
        html: `
          <p>Existe un error en el formato del RUN <b>${errorEncontrado}</b></p>
          <p class="mb-0 pb-0">
            Verifique que cada RUN del documento sea válido y no incluya separadores de miles. El 
            dígito verificador es opcional. Ejemplo: <b>9789016-1</b> o <b>97890161</b>.
          </p>`,
      });
    }

    setspinnerCargar(true);
    let recuento = 0;
    let recuentoError = 0;
    settextProgress('Cargando Personas Trabajadoras...');
    let rutagregados: any[] = [];

    for (let index = 0; index < csvData.length; index++) {
      const element = csvData[index];
      recuento = ++recuento;
      if (element.trim() != '') {
        const trabajador: Trabajadoresxrrhh = {
          acciontraxrrhh: 1,
          codigounidadrrhh: idunidad,
          runtrabajador: formatRut(element, false),
        };

        if (empleadorActual == undefined || usuario == undefined) return;
        const data = await crearTrabajador(trabajador, usuario.rut, empleadorActual.rutempleador);
        if (data.ok) {
          setcuentagrabados((recuento / csvData.length) * 100);
        } else {
          setcuentagrabados((recuento / csvData.length) * 100);
          recuentoError = ++recuentoError;
          rutagregados = [...rutagregados, element];
        }
      }
    }

    if (recuento - recuentoError > 0) {
      setspinnerCargar(false);
      AlertaExito.fire({
        html: `Se ha grabado <b>${
          recuento - recuentoError
        } persona(s) trabajadora(s)</b> con éxito`,
        didClose: async () => {
          refrescarComponente();
          setcuentagrabados(0);
          settextProgress('');
          setValue('file', null);
          if (!(recuentoError > 0)) return;
          const resp = await AlertaConfirmacion.fire({
            icon: 'info',
            html: `<p>Existen personas trabajadoras ya registradas en una unidad.</p>
                  <b>¿Desea verificar los RUN ya asociados a otra unidad?</b>`,
          });

          if (resp.isDenied || resp.isDismissed) return;

          exportFromJSON({
            data: rutagregados.map((value) => ({ ['']: value })),
            fileName: `run-ya-con-unidad`,
            exportType: 'csv',
          });
        },
      });
    } else {
      refrescarComponente();
      setspinnerCargar(false);
      AlertaError.fire({
        icon: 'info',
        html: 'Las personas trabajadoras ya se encuentran registrados',
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

      <div className="animate__animate animate__fadeIn">
        <div className="row">
          <Titulo url="">
            Entidad Empleadora - <b>{empleadorActual!?.razonsocial}</b> / Unidades de RRHH -{' '}
            <b> {unidad} </b>/ Personas Trabajadoras
          </Titulo>
        </div>

        {RolUsuario == 'Administrador' && (
          <div className="row mt-4">
            <div className="col-md-12 col-xs-12 col-lg-5">
              <h5>Cargar Personas Trabajadoras</h5>
              <sub style={{ color: 'blue' }}>Agregar RUN Persona Trabajadora</sub>
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
                      <div className="invalid-tooltip">Debe ingresar un RUN valido</div>
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

            <div className="d-none d-md-inline d-lg-none col-md-12">
              <div className="col-md-12">
                <br />
              </div>
            </div>

            <div className="col-md-12 col-xs-12 col-lg-7">
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
                        const resp = await AlertaConfirmacion.fire({
                          html: `¿Desea eliminar el fichero <b>${getValues('file')![0].name}</b>?`,
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
        )}

        <div className="row mt-5">
          <div className="col-md-12">
            <div className="row">
              <h5 className="text-center">Personas Trabajadoras</h5>
              {RolUsuario == 'Administrador' && (
                <span
                  className="text-end animate animate__fadeIn"
                  style={{
                    display: datosPagina!?.trabajadores.length > 1 ? 'block' : 'none',
                  }}>
                  <button className="btn btn-danger btn-sm" onClick={handleDeleteAll}>
                    Borrar todo
                  </button>
                </span>
              )}
            </div>

            <hr />
            <IfContainer show={pendiente || loading}>
              <div className="mb-5">
                <LoadingSpinner titulo="Cargando personas trabajadoras..." />
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
                    placeholder="Búsqueda por RUN..."
                    onInput={(e: ChangeEvent<HTMLInputElement>) => {
                      e.preventDefault();
                      settrabajadores(
                        datosPagina?.trabajadores.filter((trabajador) =>
                          trabajador.runtrabajador.includes(e.target.value.toUpperCase()),
                        ) || [],
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
                  <b>No se han encontrado personas trabajadoras</b>
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
                value={editar?.unidad.codigounidad}
                onChange={handleChangeUnidad}>
                <option value={''}>Seleccionar</option>
                {unidadEmpleador!?.length || 0 > 0 ? (
                  unidadEmpleador!?.map(({ codigounidadrrhh, glosaunidadrrhh }) => (
                    <option key={codigounidadrrhh} value={codigounidadrrhh}>
                      {glosaunidadrrhh}
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
    </>
  );
};

export default TrabajadoresPage;
