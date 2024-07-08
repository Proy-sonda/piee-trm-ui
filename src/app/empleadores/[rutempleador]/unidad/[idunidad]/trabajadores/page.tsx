'use client';

import {
  actualizarTrabajador,
  buscarTrabajadoresDeUnidad,
  crearTrabajador,
  eliminarTrabajador,
} from '@/app/empleadores/[rutempleador]/unidad/[idunidad]/trabajadores/(servicios)';

import { useEmpleadorActual } from '@/app/empleadores/(contexts)/empleador-actual-context';
import { Titulo } from '@/components';
import { GuiaUsuario } from '@/components/guia-usuario';
import { AuthContext } from '@/contexts';
import { useMergeFetchObject } from '@/hooks';
import { Trabajadoresunidadrrhh, Unidadesrrhh } from '@/modelos/tramitacion';
import { buscarUnidadesDeRRHH } from '@/servicios';
import { AlertaConfirmacion, AlertaError, AlertaExito } from '@/utilidades/alertas';
import 'animate.css';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { formatRut, validateRut } from 'rutlib';
import { TIPOS_DE_OPERADORESID, TipoOperadorId, Trabajadoresxrrhh } from '../../(modelos)';
import { TablaTrabajadores } from './(componentes)';
import { Trabajador } from './(modelos)';
import styles from './trabajadores.module.css';
const IfContainer = dynamic(() => import('@/components/if-container'));
const LoadingSpinner = dynamic(() => import('@/components/loading-spinner'));
interface TrabajadoresPageProps {
  params: {
    rutempleador: string;
    idunidad: string;
  };
}

const TrabajadoresPage: React.FC<TrabajadoresPageProps> = ({ params }) => {
  const search = useSearchParams();

  const tabOperadorQuery: TipoOperadorId =
    TIPOS_DE_OPERADORESID.find((x) => x === Number(search.get('operador'))) ?? 3;

  const [tabOperador] = useState<TipoOperadorId>(tabOperadorQuery);
  const [unidad, setunidad] = useState('');
  const [unidadEmpleador, setunidadEmpleador] = useState<Unidadesrrhh[] | undefined>();
  const [trabajadores, settrabajadores] = useState<Trabajadoresunidadrrhh[]>([]);

  const { empleadorActual, rolEnEmpleadorActual } = useEmpleadorActual();
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
  const { register, setValue, getValues, watch } = useForm<{ run: string; file: FileList | null }>({
    mode: 'onBlur',
  });
  const [rutedit, setrutedit] = useState<string>();
  const [show, setshow] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const cargaNomina = useRef(null);
  const [btnenable, setbtnenable] = useState(false);

  const [err, datosPagina, pendiente] = useMergeFetchObject(
    {
      trabajadores: buscarTrabajadoresDeUnidad(idunidad, rutempleador, tabOperador),
    },
    [refresh],
  );

  useEffect(() => {
    const busquedaUnidad = async () => {
      const [resp] = await buscarUnidadesDeRRHH(rutempleador, tabOperador);
      setunidad((await resp()).find((u) => u.CodigoUnidadRRHH == idunidad)?.GlosaUnidadRRHH ?? '');
    };
    busquedaUnidad();

    refrescarComponente();
  }, [idunidad]);

  useEffect(() => {
    if (datosPagina?.trabajadores != undefined) {
      settrabajadores(datosPagina!?.trabajadores);
    }
  }, [datosPagina]);

  const refrescarComponente = () => setRefresh(Math.random());

  const handleClose = () => setshow(false);

  const handleDeleteTrabajador = (trabajadores: Trabajadoresunidadrrhh) => {
    const EliminarTrabajador = async () => {
      const TrabajadorAEliminar: Trabajadoresxrrhh = {
        acciontraxrrhh: 3,
        codigounidadrrhh: idunidad,
        runtrabajador: trabajadores.RunTrabajador,
      };
      if (empleadorActual == undefined || usuario == undefined) return;
      const data = await eliminarTrabajador(
        TrabajadorAEliminar,
        usuario?.rut,
        empleadorActual?.rutempleador,
        tabOperador,
        3,
      );

      if (data.ok) {
        refrescarComponente();

        return AlertaExito.fire({
          html: `Persona trabajadora ${trabajadores.RunTrabajador} fue eliminada con éxito`,
        });
      }
      AlertaError.fire({ html: 'Ha ocurrido un problema', icon: 'error' });
    };
    AlertaConfirmacion.fire({
      iconColor: 'white',
      iconHtml:
        '<p style="font-size:72px"><i class="bi bi-exclamation-triangle-fill text-danger animate__animated animate__flash animate__infinite animate__slower"></i></p>',
      title: 'Advertencia',
      html: `¿Desea eliminar a la persona trabajadora <b>${trabajadores.RunTrabajador}</b>?`,
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

  useEffect(() => {
    setbtnenable((getValues('run') ?? '').length > 0 ? true : false);
  }, [getValues('run')]);

  const handleDeleteAll = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const resp = await AlertaConfirmacion.fire({
      iconColor: 'white',
      iconHtml:
        '<p style="font-size:72px"><i class="bi bi-exclamation-triangle-fill text-danger animate__animated animate__flash animate__infinite animate__slower"></i></p>',
      title: 'Advertencia',
      html: `Si continua con esta acción, se eliminarán <b>TODAS</b> las personas trabajadoras de la unidad <b>${unidad}</b>,
      </br>
      ¿Desea continuar con la eliminación?`,
    });

    if (resp.isDenied) return;

    if (resp.isConfirmed) {
      const Trabajadores: Trabajadoresxrrhh = {
        acciontraxrrhh: 4,
        codigounidadrrhh: idunidad,
      };
      if (empleadorActual == undefined || usuario == undefined) return;

      try {
        const resp = await eliminarTrabajador(
          Trabajadores,
          usuario?.rut,
          empleadorActual?.rutempleador,
          tabOperador,
          4,
        );

        AlertaExito.fire({
          title: 'Éxito',
          html: 'Se han eliminado todas las personas trabajadoras de la unidad',
          didClose: () => {
            refrescarComponente();
            settrabajadores([]);
          },
        });
      } catch (error: any) {
        AlertaError.fire({
          html: 'Ha ocurrido un problema ' + error.message,
          icon: 'error',
        });
      }
    }
  };

  const {
    usuario,
    datosGuia: { guia, listaguia, AgregarGuia },
  } = useContext(AuthContext);

  const cargatrabajador = useRef(null);

  useEffect(() => {
    AgregarGuia([
      {
        indice: 0,
        nombre: 'Menu lateral',
        activo: true,
      },
      {
        indice: 1,
        nombre: 'Carga trabajador',
        activo: false,
      },
    ]);
  }, []);

  const router = useRouter();
  const handleAddTrabajador = (e: FormEvent) => {
    e.preventDefault();
    const runTrabajadorNuevo = getValues('run');
    if (!runTrabajadorNuevo) return;
    if (error.run) return;

    if (trabajadorExisteEnGrilla(runTrabajadorNuevo)) {
      return AlertaError.fire({
        title: 'Error',
        html: `Ya existe un trabajador con RUN <b>${runTrabajadorNuevo}</b> en esta unidad.`,
      });
    }

    const crearTrabajadorAux = async () => {
      const trabajador: Trabajadoresxrrhh = {
        acciontraxrrhh: 1,
        codigounidadrrhh: idunidad,
        runtrabajador: runTrabajadorNuevo,
      };

      if (empleadorActual == undefined || usuario == undefined) return;
      const data = await crearTrabajador(
        trabajador,
        usuario?.rut,
        empleadorActual?.rutempleador,
        tabOperador,
      );

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
          msgError = '<p>Código verificador inválido</p>';

        AlertaError.fire({
          html: 'Existe un problema al momento de grabar ' + (msgError ? msgError : data.text()),
        });
      }
    };

    crearTrabajadorAux();
  };

  const trabajadorExisteEnGrilla = (rut: string) => {
    return trabajadores.some((t) => t.RunTrabajador === rut);
  };

  const handleClickNomina = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!getValues('file') || getValues('file')?.length === 0) return;
    // if (csvData.length == 0 || csvData == undefined) return;
    if (error.file) return AlertaError.fire({ html: 'Debe cargar solo archivos de tipo "csv"' });

    /* El regex verifica que el RUT tenga el formato "<correlativo>-<DV>" o "<correlativo>-<DV>"
     * para descartar los que tienen separadores de miles. Despues `validateRut` hace su magia
     * y verifica que el rut sea valido. */
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

    let arregloRut: string[] = [];
    for (let index = 0; index < csvData.length; index++) {
      const rutTrabjadorCSV =
        csvData[index] && csvData[index].trim() !== ''
          ? formatRut(csvData[index], false)
          : csvData[index];

      if (rutTrabjadorCSV.trim() != '') {
        arregloRut = [...arregloRut, rutTrabjadorCSV];
      }
    }

    if (arregloRut.length > 500) {
      return AlertaError.fire({
        title: 'Error',
        html: 'No se pueden cargar más de 500 trabajadores a la vez',
      });
    }

    const payload: Trabajadoresxrrhh = {
      acciontraxrrhh: 1,
      codigounidadrrhh: idunidad,
      runtrabajador: arregloRut,
    };

    if (empleadorActual == undefined || usuario == undefined) return;

    try {
      await crearTrabajador(payload, usuario.rut, empleadorActual.rutempleador, tabOperador);
      AlertaExito.fire({
        html: 'Se han grabado las personas trabajadoras con éxito',
        didClose: () => {
          refrescarComponente();
        },
      });
    } catch (error: any) {
      AlertaError.fire(error.message);
    }
  };

  return (
    <>
      <div className="animate__animate animate__fadeIn">
        <div className="row">
          <Titulo url="">
            {empleadorActual?.razonsocial} / {unidad} / {tabOperador == 3 ? 'I-MED' : 'MEDIPASS'} /{' '}
            <b>Personas Trabajadoras</b>
          </Titulo>
        </div>

        {rolEnEmpleadorActual === 'administrador' && (
          <>
            <GuiaUsuario guia={listaguia[1]!?.activo && guia} target={cargatrabajador}>
              Formulario de carga de personas trabajadoras <br />
              en la unidad <b>{unidad}</b> <br />
              <div className="text-end mt-2">
                <button
                  className="btn btn-sm text-white"
                  onClick={() =>
                    AgregarGuia([
                      {
                        indice: 0,
                        nombre: 'Menu lateral',
                        activo: true,
                      },
                      {
                        indice: 1,
                        nombre: 'Carga trabajador',
                        activo: false,
                      },
                    ])
                  }
                  style={{
                    border: '1px solid white',
                  }}>
                  <i className="bi bi-arrow-left"></i>
                  &nbsp; Anterior
                </button>
                &nbsp;
                <button
                  className="btn btn-sm text-white"
                  onClick={() =>
                    AgregarGuia([
                      {
                        indice: 0,
                        nombre: 'Menu lateral',
                        activo: false,
                      },
                      {
                        indice: 1,
                        nombre: 'Carga trabajador',
                        activo: false,
                      },
                      {
                        indice: 2,
                        nombre: 'Carga nomina',
                        activo: true,
                      },
                    ])
                  }
                  style={{
                    border: '1px solid white',
                  }}>
                  Continuar &nbsp;
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </GuiaUsuario>
            <div className={`row mt-4`}>
              <div className="col-md-12 col-xs-12 col-lg-5">
                <form onSubmit={handleAddTrabajador}>
                  <div className="row mt-1">
                    <div
                      className={`col-md-8 position-relative ${
                        listaguia[1]!?.activo && guia && 'overlay-marco'
                      }`}
                      ref={cargatrabajador}>
                      <h5>Cargar Personas Trabajadoras</h5>
                      <sub style={{ color: 'blue' }}>Agregar RUN Persona Trabajadora</sub>
                      <br />
                      <br />
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
                        <div className="invalid-tooltip">Debe ingresar un RUN válido</div>
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
                        <button type="submit" className="btn btn-success" disabled={!btnenable}>
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
                <GuiaUsuario guia={listaguia[2]!?.activo && guia} target={cargaNomina}>
                  Formulario de carga masiva para pesonas trabajadoras <br />
                  en la unidad <b>{unidad}</b> utilizando archivo .CSV
                  <br />
                  <div className="text-end mt-2">
                    <button
                      className="btn btn-sm text-white"
                      onClick={() =>
                        AgregarGuia([
                          {
                            indice: 0,
                            nombre: 'Menu lateral',
                            activo: false,
                          },
                          {
                            indice: 1,
                            nombre: 'Carga trabajador',
                            activo: true,
                          },
                          {
                            indice: 2,
                            nombre: 'Carga nomina',
                            activo: false,
                          },
                        ])
                      }
                      style={{
                        border: '1px solid white',
                      }}>
                      <i className="bi bi-arrow-left"></i>
                      &nbsp; Anterior
                    </button>
                    &nbsp;
                    <button
                      className="btn btn-sm text-white"
                      onClick={() =>
                        AgregarGuia([
                          {
                            indice: 0,
                            nombre: 'Menu lateral',
                            activo: true,
                          },
                          {
                            indice: 1,
                            nombre: 'Carga trabajador',
                            activo: false,
                          },
                          {
                            indice: 2,
                            nombre: 'Carga nomina',
                            activo: false,
                          },
                        ])
                      }
                      style={{
                        border: '1px solid white',
                      }}>
                      Continuar &nbsp;
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </GuiaUsuario>
                <div
                  className={`${listaguia[2]!?.activo && guia && 'overlay-marco'}`}
                  ref={cargaNomina}>
                  <h5>Cargar Nómina</h5>
                  <sub className="d-inline d-sm-none d-xl-inline">
                    Para poder cargar las personas trabajadoras de la unidad <b>{unidad}</b>, solo
                    tiene que seleccionar un archivo (formato CSV) según el{' '}
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
                        <div className="invalid-tooltip">
                          Debe ingresar un archivo con formato .csv
                        </div>
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
                            getValues('file')?.length === 0 || getValues('file') === null
                              ? true
                              : false
                          }
                          className="btn btn-primary"
                          onClick={async () => {
                            if (!getValues('file')) return;
                            const resp = await AlertaConfirmacion.fire({
                              html: `¿Desea eliminar el fichero <b>${
                                getValues('file')![0].name
                              }</b>?`,
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
            </div>
          </>
        )}

        <div className="row mt-5">
          <div className="col-md-12">
            <div className="row">
              <h5 className="text-center">Personas Trabajadoras</h5>
              {rolEnEmpleadorActual === 'administrador' && (
                <span
                  className="text-end animate animate__fadeIn"
                  style={{
                    display: trabajadores.length > 1 ? 'block' : 'none',
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
                          trabajador.RunTrabajador.includes(e.target.value.toUpperCase()),
                        ) || [],
                      );
                    }}
                  />
                </div>
              </div>
              {trabajadores.length > 0 && !pendiente ? (
                <>
                  <TablaTrabajadores
                    unidad={unidad}
                    handleDeleteTrabajador={handleDeleteTrabajador}
                    idunidad={Number(idunidad)}
                    trabajadores={trabajadores}
                  />
                </>
              ) : (
                <div className="alert alert-warning text-center">
                  <b>
                    No se han encontrado personas trabajadoras en la unidad{' '}
                    <strong>{unidad}</strong>
                  </b>
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
            <button
              className="btn btn-danger"
              onClick={() =>
                router.push(
                  `/empleadores/${rutempleador}/unidad?operador=${
                    tabOperador == 3 ? 'imed' : 'medipass'
                  }`,
                )
              }>
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
                  unidadEmpleador!?.map(({ CodigoUnidadRRHH, GlosaUnidadRRHH }) => (
                    <option key={CodigoUnidadRRHH} value={CodigoUnidadRRHH}>
                      {GlosaUnidadRRHH}
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
