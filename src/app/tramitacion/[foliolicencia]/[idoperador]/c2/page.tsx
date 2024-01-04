'use client';
import { ComboSimple, InputFecha, InputRadioButtons } from '@/components/form';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { AlertaError, AlertaExito } from '@/utilidades/alertas';
import 'animate.css';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { buscarRegimen } from '../(servicios)/buscar-regimen';
import { LicenciaC1 } from '../c1/(modelos)';
import { buscarZona0, buscarZona1 } from '../c1/(servicios)';
import { InputOtroMotivoDeRechazo } from '../no-tramitar/(componentes)/input-otro-motivo-rechazo';

import { buscarCajasDeCompensacion } from '@/app/empleadores/(servicios)';
import { buscarLicenciasParaTramitar } from '@/app/tramitacion/(servicios)/buscar-licencias-para-tramitar';
import { GuiaUsuario } from '@/components/guia-usuario';
import { AuthContext } from '@/contexts';
import { useRefrescarPagina } from '@/hooks';
import dynamic from 'next/dynamic';
import { BotonesNavegacion, Cabecera } from '../(componentes)';
import { buscarCalidadTrabajador } from '../(servicios)';
import { EntidadPagadora, EntidadPrevisional, Licenciac2 } from './(modelos)';
import {
  ErrorCrearLicenciaC2,
  buscarEntidadPagadora,
  buscarEntidadPrevisional,
  buscarZona2,
  crearLicenciaZ2,
} from './(servicios)/';
import { ErrorGuardarCCAF, GuardarCCAF } from './(servicios)/actualiza-ccaf';
import { BuscarIDCCAFPropuesto } from './(servicios)/obtener-idccaf-propuesta';

const IfContainer = dynamic(() => import('@/components/if-container'));
const SpinnerPantallaCompleta = dynamic(() => import('@/components/spinner-pantalla-completa'));
const LoadingSpinner = dynamic(() => import('@/components/loading-spinner'));

interface myprops {
  params: {
    foliolicencia: string;
    idoperador: number;
  };
}
interface formularioApp {
  accion: 'siguiente' | 'guardar' | 'anterior' | 'navegar';
  linkNavegacion: string;
  regimen: number;
  previsional: string;
  calidad: string;
  perteneceAFC: '1' | '0';
  contratoIndefinido: '1' | '0';
  fechaafilacionprevisional: string;
  fechacontratotrabajo: string;
  entidadremuneradora: string;
  nombreentidadpagadorasubsidio: string;
  ccaflm: number;
}

const C2Page: React.FC<myprops> = ({ params: { foliolicencia, idoperador } }) => {
  const [esAFC, setesAFC] = useState(false);
  const [entePagador, setentePagador] = useState<EntidadPagadora[]>([]);
  const [LMECABECERA, setLMECABECERA] = useState<LicenciaC1>();
  const [fadeinOut, setfadeinOut] = useState('');
  const [spinner, setspinner] = useState(false);
  const [entidadPrevisional, setentidadPrevisional] = useState<EntidadPrevisional[]>([]);
  const router = useRouter();
  const [refresh, setrefresh] = useRefrescarPagina();
  const [erroresCargarCombos, combos, cargandoCombos] = useMergeFetchObject(
    {
      REGIMEN: buscarRegimen(),
      CALIDADTRABAJADOR: buscarCalidadTrabajador(),
      ENTIDADPAGADORA: buscarEntidadPagadora(),
      ZONA0: buscarZona0(foliolicencia, Number(idoperador)),
      LMEEXISTEZONA2: buscarZona2(foliolicencia, Number(idoperador)),
      LMETRM: buscarLicenciasParaTramitar(),
      CCAF: buscarCajasDeCompensacion(),
    },
    [refresh],
  );

  const regimenPrev = useRef(null);
  const institucionPrev = useRef(null);
  const calidadTrabajador = useRef(null);
  const perteneceAFC = useRef(null);

  const {
    datosGuia: { AgregarGuia, guia, listaguia },
  } = useContext(AuthContext);

  useEffect(() => {
    AgregarGuia([
      { indice: 0, nombre: 'stepper', activo: true },
      { indice: 1, nombre: 'Régimen Previsional', activo: false },
    ]);
  }, []);

  useEffect(() => {
    const BuscarZonaC1 = async () => {
      const data = await buscarZona1(foliolicencia, Number(idoperador));
      if (data !== undefined) setLMECABECERA(data);
    };

    BuscarZonaC1();
  }, [foliolicencia, idoperador]);

  const step = [
    {
      label: 'Entidad Empleadora/Independiente',
      num: 1,
      active: false,
      url: `/tramitacion/${foliolicencia}/${idoperador}/c1`,
    },
    { label: 'Previsión persona trabajadora', num: 2, active: true },
    {
      label: 'Renta y/o subsidios',
      num: 3,
      active: false,
      url: `/tramitacion/${foliolicencia}/${idoperador}/c3`,
    },
    {
      label: 'LME Anteriores',
      num: 4,
      active: false,
      url: `/tramitacion/${foliolicencia}/${idoperador}/c4`,
    },
  ];

  const formulario = useForm<formularioApp>({
    mode: 'onSubmit',
    defaultValues: {
      accion: 'siguiente',
      linkNavegacion: '',
    },
  });

  const [ccafvisible, setccafvisible] = useState(false);
  const [idccaf, setidccaf] = useState<number | undefined>(0);

  useEffect(() => {
    if (combos?.ZONA0) {
      if (combos?.ZONA0?.ccaf !== null) {
        formulario.setValue('ccaflm', combos!?.ZONA0!?.ccaf!?.idccaf);
      } else {
        // en caso de que el tipo de licencia sea 5 o 6, se debe cargar el idccaf de la entidad de salud
        if (
          combos?.ZONA0.tipolicencia.idtipolicencia == 5 ||
          combos?.ZONA0.tipolicencia.idtipolicencia == 6
        ) {
          setccafvisible(false);
          return setidccaf(combos?.ZONA0.entidadsalud.identidadsalud);
        }
        // si es distinto distinto a 5 o 6, y la entidad de salud es distinta a 1, se debe cargar el idccaf 10100(isapres)
        if (combos?.ZONA0.entidadsalud.identidadsalud !== 1) {
          return setidccaf(10100);
        }

        // aqui cargamos el idccaf propuesto en caso de que el valor sea null
        const busquedaPropuesta = async () => {
          const [resp] = await BuscarIDCCAFPropuesto(Number(idoperador), foliolicencia);
          await resp().then((data) => formulario.setValue('ccaflm', data.codigoccafpropuesta));
        };

        busquedaPropuesta();
      }
    }
  }, [combos?.ZONA0]);

  const EntidadPagadora = formulario.watch('entidadremuneradora');

  useEffect(() => {
    if (EntidadPagadora) {
      if (EntidadPagadora === 'C' && combos?.ZONA0.entidadsalud.identidadsalud === 1) {
        setccafvisible(true);
        setidccaf(undefined);
      } else {
        setccafvisible(false);
        if (EntidadPagadora === 'A' && combos?.ZONA0.entidadsalud.identidadsalud === 1) {
          setidccaf(10100);
        }
      }
    }
  }, [EntidadPagadora]);

  const onHandleSubmit: SubmitHandler<formularioApp> = async (data) => {
    await GuardarZ2();
    await GuardarIDCCAF();
  };

  const GuardarIDCCAF = async () => {
    if (idccaf) {
      try {
        await GuardarCCAF(Number(idoperador), idccaf.toString(), foliolicencia);
      } catch (error) {
        if (error instanceof ErrorGuardarCCAF) {
          AlertaError.fire({
            html: `Ha ocurrido un problema: ${ErrorGuardarCCAF}`,
          });
        }
      }
    } else {
      try {
        await GuardarCCAF(
          Number(idoperador),
          formulario.getValues('ccaflm').toString(),
          foliolicencia,
        );
      } catch (error) {
        if (error instanceof ErrorGuardarCCAF) {
          AlertaError.fire({
            html: `Ha ocurrido un problema: ${ErrorGuardarCCAF}`,
          });
        }
      }
    }
  };

  const GuardarZ2 = async () => {
    let licenciac2: Licenciac2 = {
      codigocontratoindef: Number(formulario.getValues('contratoIndefinido')),
      calidadtrabajador: {
        idcalidadtrabajador: Number(formulario.getValues('calidad')),
        calidadtrabajador: '',
      },
      foliolicencia,
      operador: {
        idoperador: Number(idoperador),
        operador: '',
      },
      fechacontrato: format(new Date(formulario.getValues('fechacontratotrabajo')), 'yyyy-MM-dd'),
      fechaafiliacion:
        formulario.getValues('fechaafilacionprevisional') != 'Invalid Date'
          ? format(new Date(formulario.getValues('fechaafilacionprevisional')), 'yyyy-MM-dd')
          : '',
      entidadpagadora: {
        identidadpagadora: formulario.getValues('entidadremuneradora'),
        entidadpagadora: '',
      },
      fecharecepcionccaf: '1900-01-01',
      nombrepagador: formulario.getValues('nombreentidadpagadorasubsidio'),
      entidadprevisional: {
        codigoentidadprevisional: Number(
          formulario.getValues('regimen') == 2
            ? formulario.getValues('previsional').toString()
            : formulario.getValues('previsional').length > 2
            ? formulario.getValues('previsional').toString().substring(0, 2)
            : formulario.getValues('previsional').toString().substring(0, 1),
        ),
        codigoregimenprevisional: Number(formulario.getValues('regimen')),
        letraentidadprevisional:
          formulario.getValues('regimen') == 2
            ? '-'
            : formulario.getValues('previsional').length > 2
            ? formulario.getValues('previsional').toString().substring(2, 3)
            : formulario.getValues('previsional').substring(1, 2),
      },
      codigoseguroafc: Number(formulario.getValues('perteneceAFC')),
    };

    try {
      await crearLicenciaZ2(licenciac2);
      switch (formulario.getValues('accion')) {
        case 'siguiente':
          setspinner(true);
          router.push(`/tramitacion/${foliolicencia}/${idoperador}/c3`);
          break;
        case 'anterior':
          router.push(`/tramitacion/${foliolicencia}/${idoperador}/c1`);
          break;
        case 'guardar':
          AlertaExito.fire({
            html: 'Se ha guardado con éxito',
          });

          break;
        case 'navegar':
          router.push(formulario.getValues('linkNavegacion'));
          break;
        default:
          throw new Error('Accion desconocida en Paso 3');
      }
    } catch (error) {
      if (error instanceof ErrorCrearLicenciaC2)
        AlertaError.fire({
          html: `Ha ocurrido un problema: ${ErrorCrearLicenciaC2}`,
        });
    }
  };

  const calidadtrabajador = formulario.watch('calidad');
  const regimenPrevisional = formulario.watch('regimen');

  useEffect(() => {
    if (!Number.isNaN(regimenPrevisional) && regimenPrevisional !== undefined) {
      const buscarInstitucion = async () => {
        const [data] = await buscarEntidadPrevisional(regimenPrevisional);
        setentidadPrevisional(await data());
      };
      buscarInstitucion();
    } else {
      setentidadPrevisional([]);
    }
  }, [regimenPrevisional]);

  useEffect(() => {
    if (calidadtrabajador == '3') setesAFC(true);
    else {
      setesAFC(false);
      formulario.setValue('perteneceAFC', '0');
    }

    if (
      combos?.LMETRM.find((value) => value.foliolicencia == foliolicencia)?.entidadsalud
        .identidadsalud !== 1
    ) {
      return setentePagador(
        combos!?.ENTIDADPAGADORA.filter((value) => value.identidadpagadora == 'B'),
      );
    }

    if (
      combos?.LMETRM.find((value) => value.foliolicencia == foliolicencia)?.tipolicencia
        .idtipolicencia == 5 ||
      combos?.LMETRM.find((value) => value.foliolicencia == foliolicencia)?.tipolicencia
        .idtipolicencia == 6
    ) {
      setentePagador(
        combos!?.ENTIDADPAGADORA.filter(
          (value) => value.identidadpagadora == 'F' || value.identidadpagadora == 'H',
        ),
      );
      return;
    }

    setentePagador(
      combos!?.ENTIDADPAGADORA.filter((value) => {
        switch (Number(calidadtrabajador)) {
          case 1:
            if (
              value.identidadpagadora == 'A' ||
              value.identidadpagadora == 'B' ||
              value.identidadpagadora == 'C' ||
              value.identidadpagadora == 'E' ||
              value.identidadpagadora == 'F' ||
              value.identidadpagadora == 'G' ||
              value.identidadpagadora == 'H'
            ) {
            } else {
              return value;
            }

            break;
          case 2:
            if (
              value.identidadpagadora !== 'B' &&
              value.identidadpagadora !== 'E' &&
              value.identidadpagadora !== 'F' &&
              value.identidadpagadora !== 'G' &&
              value.identidadpagadora !== 'H'
            ) {
              return value;
            }
            break;
          case 3:
            if (
              value.identidadpagadora === 'B' ||
              value.identidadpagadora === 'D' ||
              value.identidadpagadora == 'E' ||
              value.identidadpagadora == 'F' ||
              value.identidadpagadora == 'G' ||
              value.identidadpagadora == 'H'
            ) {
            } else {
              return value;
            }
            break;
          case 4:
            if (
              value.identidadpagadora == 'B' ||
              value.identidadpagadora == 'C' ||
              value.identidadpagadora == 'D' ||
              value.identidadpagadora == 'E' ||
              value.identidadpagadora == 'F' ||
              value.identidadpagadora == 'G' ||
              value.identidadpagadora == 'H'
            ) {
            } else {
              return value;
            }
            break;
        }
      }),
    );
  }, [calidadtrabajador, combos, foliolicencia, formulario]);

  useEffect(() => {
    setspinner(true);
    if (combos?.LMEEXISTEZONA2 !== undefined) {
      formulario.setValue(
        'regimen',
        combos.LMEEXISTEZONA2.entidadprevisional.codigoregimenprevisional,
      );

      formulario.setValue(
        'calidad',
        combos!?.LMEEXISTEZONA2.calidadtrabajador.idcalidadtrabajador.toString(),
      );

      formulario.setValue(
        'contratoIndefinido',
        combos!?.LMEEXISTEZONA2.codigocontratoindef == 1 ? '1' : '0',
      );

      formulario.setValue('perteneceAFC', combos!?.LMEEXISTEZONA2.codigoseguroafc == 1 ? '1' : '0');

      formulario.setValue(
        'fechaafilacionprevisional',
        format(new Date(combos!?.LMEEXISTEZONA2.fechaafiliacion), 'yyyy-MM-dd'),
      );

      formulario.setValue(
        'fechacontratotrabajo',
        format(new Date(combos!?.LMEEXISTEZONA2.fechacontrato), 'yyyy-MM-dd'),
      );

      setTimeout(() => {
        formulario.setValue(
          'entidadremuneradora',
          combos!?.LMEEXISTEZONA2.entidadpagadora.identidadpagadora,
        );
        formulario.setValue(
          'previsional',
          formulario.getValues('regimen') == 1
            ? combos!?.LMEEXISTEZONA2.entidadprevisional.codigoentidadprevisional +
                combos!?.LMEEXISTEZONA2.entidadprevisional.letraentidadprevisional
            : combos!?.LMEEXISTEZONA2.entidadprevisional.codigoentidadprevisional.toString(),
        );
        setspinner(false);
      }, 2000);

      formulario.setValue('nombreentidadpagadorasubsidio', combos!?.LMEEXISTEZONA2.nombrepagador);
    }

    setTimeout(() => {
      setspinner(false);
    }, 2000);
  }, [combos, formulario]);

  return (
    <>
      <IfContainer show={spinner}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <Cabecera
        foliotramitacion={foliolicencia}
        idoperador={idoperador}
        step={step}
        title="Identificación del Régimen Previsional de la Persona Trabajadora y Entidad Pagadora del subsidio"
        onLinkClickeado={(link) => {
          formulario.setValue('linkNavegacion', link);
          formulario.setValue('accion', 'navegar');
          formulario.handleSubmit(onHandleSubmit)();
        }}
      />

      <IfContainer show={cargandoCombos}>
        <div className={fadeinOut}>
          <LoadingSpinner titulo="Cargando datos..." />
        </div>
      </IfContainer>

      <div
        className="row"
        style={{
          display: cargandoCombos || !erroresCargarCombos ? 'none' : 'inline',
        }}>
        <FormProvider {...formulario}>
          <form
            id="tramitacionC2"
            className="animate__animated animate__fadeIn"
            onSubmit={formulario.handleSubmit(onHandleSubmit)}>
            <div className="row align-items-baseline g-3">
              <GuiaUsuario guia={listaguia[1]!?.activo && guia} target={regimenPrev}>
                Régimen previsional de la persona trabajadora
                <br />
                <div className="text-end mt-3">
                  <button
                    className="btn btn-sm text-white"
                    onClick={() => {
                      AgregarGuia([
                        {
                          indice: 0,
                          nombre: 'Stepper',
                          activo: true,
                        },
                      ]);
                    }}
                    style={{
                      border: '1px solid white',
                    }}>
                    <i className="bi bi-arrow-left"></i>
                    &nbsp; Anterior
                  </button>
                  &nbsp;
                  <button
                    className="btn btn-sm text-white"
                    onClick={() => {
                      AgregarGuia([
                        {
                          indice: 0,
                          nombre: 'Stepper',
                          activo: false,
                        },

                        {
                          indice: 1,
                          nombre: 'regimen previsional',
                          activo: false,
                        },
                        {
                          indice: 2,
                          nombre: 'Institución previsional',
                          activo: true,
                        },
                      ]);
                    }}
                    style={{
                      border: '1px solid white',
                    }}>
                    Continuar &nbsp;
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </GuiaUsuario>
              <div
                className={`col-12 col-sm-6 col-lg-4 col-xl-3 ${
                  listaguia[1]!?.activo && guia && 'overlay-marco'
                }`}
                ref={regimenPrev}>
                <ComboSimple
                  label="Régimen Previsional"
                  descripcion="regimenprevisional"
                  idElemento="codigoregimenprevisional"
                  name="regimen"
                  datos={combos?.REGIMEN}
                />
              </div>
              <GuiaUsuario guia={listaguia[2]!?.activo && guia} target={institucionPrev}>
                Institución previsional de la persona trabajadora
                <br />
                <div className="text-end mt-3">
                  <button
                    className="btn btn-sm text-white"
                    onClick={() => {
                      AgregarGuia([
                        {
                          indice: 0,
                          nombre: 'Stepper',
                          activo: false,
                        },
                        {
                          indice: 1,
                          nombre: 'regimen previsional',
                          activo: true,
                        },
                        {
                          indice: 2,
                          nombre: 'Institución previsional',
                          activo: false,
                        },
                      ]);
                    }}
                    style={{
                      border: '1px solid white',
                    }}>
                    <i className="bi bi-arrow-left"></i>
                    &nbsp; Anterior
                  </button>
                  &nbsp;
                  <button
                    className="btn btn-sm text-white"
                    onClick={() => {
                      AgregarGuia([
                        {
                          indice: 0,
                          nombre: 'Stepper',
                          activo: false,
                        },
                        {
                          indice: 1,
                          nombre: 'regimen previsional',
                          activo: false,
                        },
                        {
                          indice: 2,
                          nombre: 'Institución previsional',
                          activo: false,
                        },
                        {
                          indice: 3,
                          nombre: 'Calidad persona trabajadora',
                          activo: true,
                        },
                      ]);
                    }}
                    style={{
                      border: '1px solid white',
                    }}>
                    Continuar &nbsp;
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </GuiaUsuario>
              <div
                className={`col-12 col-sm-6 col-lg-4 col-xl-3 position-relative ${
                  listaguia[2]!?.activo && guia && 'overlay-marco'
                }`}
                ref={institucionPrev}>
                <label className="mb-2">Institución Previsional (*)</label>
                <select
                  {...formulario.register('previsional', {
                    validate: {
                      comboObligatorio: (valor: number | string) => {
                        if (Number.isNaN(valor)) {
                          return 'Este campo es obligatorio';
                        }

                        if (typeof valor === 'string' && valor === '') {
                          return 'Este campo es obligatorio';
                        }
                      },
                    },
                  })}
                  className={`form-select ${
                    formulario.formState.errors.previsional && 'is-invalid'
                  }`}
                  onChange={(e) => {
                    if (e.target.value == '')
                      return formulario.setError('previsional', {
                        message: 'Este campo es obligatorio',
                        type: 'onBlur',
                      });
                    else formulario.clearErrors('previsional');

                    formulario.setValue('previsional', e.target.value);
                  }}>
                  <option value={''}>Seleccionar</option>
                  {entidadPrevisional.length > 0 ? (
                    entidadPrevisional.map(
                      ({
                        codigoentidadprevisional,
                        glosa,
                        letraentidadprevisional,
                        codigoregimenprevisional,
                      }) =>
                        codigoregimenprevisional == 1 ? (
                          letraentidadprevisional == '-' ? (
                            <option
                              value={codigoentidadprevisional + letraentidadprevisional}
                              key={codigoentidadprevisional + letraentidadprevisional}>
                              {glosa.toLowerCase().charAt(0).toUpperCase() +
                                glosa.slice(1).toLowerCase()}
                            </option>
                          ) : (
                            <option
                              value={codigoentidadprevisional + letraentidadprevisional}
                              key={codigoentidadprevisional + letraentidadprevisional}>
                              [{letraentidadprevisional}]{' '}
                              {glosa.toLowerCase().charAt(0).toUpperCase() +
                                glosa.slice(1).toLowerCase()}
                            </option>
                          )
                        ) : (
                          <option
                            key={codigoentidadprevisional + letraentidadprevisional}
                            value={codigoentidadprevisional}>
                            {glosa}
                          </option>
                        ),
                    )
                  ) : (
                    <></>
                  )}
                </select>
                <IfContainer show={formulario.formState.errors.previsional}>
                  <div className="invalid-tooltip">Este campo es obligatorio</div>
                </IfContainer>
              </div>

              <GuiaUsuario guia={listaguia[3]!?.activo && guia} target={calidadTrabajador}>
                Sector al que pertenece la persona trabajadora
                <br />
                <div className="text-end mt-3">
                  <button
                    className="btn btn-sm text-white"
                    onClick={() => {
                      AgregarGuia([
                        {
                          indice: 0,
                          nombre: 'Stepper',
                          activo: false,
                        },
                        {
                          indice: 1,
                          nombre: 'regimen previsional',
                          activo: false,
                        },
                        {
                          indice: 2,
                          nombre: 'Institución previsional',
                          activo: true,
                        },
                        {
                          indice: 3,
                          nombre: 'Calidad persona trabajadora',
                          activo: false,
                        },
                      ]);
                    }}
                    style={{
                      border: '1px solid white',
                    }}>
                    <i className="bi bi-arrow-left"></i>
                    &nbsp; Anterior
                  </button>
                  &nbsp;
                  <button
                    className="btn btn-sm text-white"
                    onClick={() => {
                      esAFC
                        ? AgregarGuia([
                            {
                              indice: 0,
                              nombre: 'Stepper',
                              activo: false,
                            },
                            {
                              indice: 1,
                              nombre: 'regimen previsional',
                              activo: false,
                            },
                            {
                              indice: 2,
                              nombre: 'Institución previsional',
                              activo: false,
                            },
                            {
                              indice: 3,
                              nombre: 'Calidad persona trabajadora',
                              activo: false,
                            },
                            {
                              indice: 4,
                              nombre: 'AFC',
                              activo: true,
                            },
                          ])
                        : AgregarGuia([
                            {
                              indice: 0,
                              nombre: 'Stepper',
                              activo: true,
                            },
                            {
                              indice: 1,
                              nombre: 'regimen previsional',
                              activo: false,
                            },
                            {
                              indice: 2,
                              nombre: 'Institución previsional',
                              activo: false,
                            },
                            {
                              indice: 3,
                              nombre: 'Calidad persona trabajadora',
                              activo: false,
                            },
                          ]);
                    }}
                    style={{
                      border: '1px solid white',
                    }}>
                    Continuar &nbsp;
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </GuiaUsuario>
              <div
                className={`col-12 col-sm-6 col-lg-4 col-xl-3 ${
                  listaguia[3]!?.activo && guia && 'overlay-marco'
                }`}
                ref={calidadTrabajador}>
                <ComboSimple
                  label="Calidad Persona Trabajadora"
                  descripcion="calidadtrabajador"
                  idElemento="idcalidadtrabajador"
                  name="calidad"
                  datos={combos?.CALIDADTRABAJADOR}
                />
              </div>

              <GuiaUsuario guia={listaguia[4]!?.activo && guia && esAFC} target={perteneceAFC}>
                Persona trabajadora con seguro cesantia <br />
                debe tener calidad de trabajador privado dependiente
                <br />
                <div className="text-end mt-3">
                  <button
                    className="btn btn-sm text-white"
                    onClick={() => {
                      AgregarGuia([
                        {
                          indice: 0,
                          nombre: 'Stepper',
                          activo: false,
                        },
                        {
                          indice: 1,
                          nombre: 'regimen previsional',
                          activo: false,
                        },
                        {
                          indice: 2,
                          nombre: 'Institución previsional',
                          activo: false,
                        },
                        {
                          indice: 3,
                          nombre: 'Calidad persona trabajadora',
                          activo: true,
                        },
                        {
                          indice: 4,
                          nombre: 'AFC',
                          activo: false,
                        },
                      ]);
                    }}
                    style={{
                      border: '1px solid white',
                    }}>
                    <i className="bi bi-arrow-left"></i>
                    &nbsp; Anterior
                  </button>
                  &nbsp;
                  <button
                    className="btn btn-sm text-white"
                    onClick={() => {
                      AgregarGuia([
                        {
                          indice: 0,
                          nombre: 'Stepper',
                          activo: true,
                        },
                        {
                          indice: 1,
                          nombre: 'regimen previsional',
                          activo: false,
                        },
                        {
                          indice: 2,
                          nombre: 'Institución previsional',
                          activo: false,
                        },
                        {
                          indice: 3,
                          nombre: 'Calidad persona trabajadora',
                          activo: false,
                        },
                        {
                          indice: 4,
                          nombre: 'AFC',
                          activo: false,
                        },
                      ]);
                    }}
                    style={{
                      border: '1px solid white',
                    }}>
                    Continuar &nbsp;
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </GuiaUsuario>
              <div
                className={`col-12 col-sm-6 col-lg-4 col-xl-3 ${
                  listaguia[4]!?.activo && guia && esAFC && 'overlay-marco'
                }`}
                ref={perteneceAFC}>
                <label className="mb-2 animate__animated animate__fadeIn">
                  Persona Pertenece a AFC{' '}
                  {esAFC && LMECABECERA?.ocupacion.idocupacion != 18 && '(*)'}
                </label>
                <IfContainer show={esAFC && LMECABECERA?.ocupacion.idocupacion != 18}>
                  <InputRadioButtons
                    className="animate__animated animate__fadeIn"
                    name="perteneceAFC"
                    direccion="horizontal"
                    opcional={!esAFC}
                    opciones={[
                      {
                        value: '1',
                        label: 'Sí',
                      },
                      {
                        value: '0',
                        label: 'No',
                      },
                    ]}
                  />
                </IfContainer>
                <IfContainer show={!esAFC || LMECABECERA!?.ocupacion.idocupacion == 18}>
                  <p>
                    <sub className="animate__animated animate__fadeIn">
                      <IfContainer show={LMECABECERA?.ocupacion.idocupacion == 18}>
                        <i>
                          Persona trabajadora con ocupacion 18 (Trabajador de casa particular) No
                          puede tener seguro cesantia
                        </i>
                      </IfContainer>
                      <IfContainer show={LMECABECERA?.ocupacion.idocupacion !== 18}>
                        <i>
                          Persona trabajadora con seguro de cesantía debe tener calidad de
                          trabajador privado dependiente
                        </i>
                      </IfContainer>
                    </sub>
                  </p>
                </IfContainer>
              </div>
              <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <label className="mb-2">Contrato de duración indefinida</label>
                <InputRadioButtons
                  direccion="horizontal"
                  name="contratoIndefinido"
                  opciones={[
                    {
                      value: '1',
                      label: 'Sí',
                    },
                    {
                      value: '0',
                      label: 'No',
                    },
                  ]}
                />
              </div>

              <InputFecha
                name="fechaafilacionprevisional"
                label="Fecha Afiliación Entidad Previsional"
                opcional
                className="col-12 col-sm-6 col-lg-4 col-xl-3"
              />

              <InputFecha
                name="fechacontratotrabajo"
                label="Fecha Contrato de trabajo"
                className="col-12 col-sm-6 col-lg-4 col-xl-3"
              />

              <ComboSimple
                idElemento="identidadpagadora"
                descripcion="entidadpagadora"
                label="Entidad Pagadora Subsidio o Mantener remuneración"
                datos={entePagador}
                name="entidadremuneradora"
                tipoValor="string"
                className="col-12 col-sm-6 col-lg-4 col-xl-3"
              />

              {ccafvisible ? (
                <ComboSimple
                  idElemento="idccaf"
                  descripcion="nombre"
                  label="Caja de Compensación"
                  datos={combos!?.CCAF}
                  opcional={!ccafvisible}
                  className="col-12 col-sm-6 col-lg-4 col-xl-3"
                  name="ccaflm"
                  tipoValor="number"
                />
              ) : (
                <InputOtroMotivoDeRechazo
                  name="nombreentidadpagadorasubsidio"
                  opcional
                  label="Nombre Entidad Pagadora Subsidio"
                  className="col-12 col-sm-6 col-lg-4 col-xl-3"
                />
              )}
            </div>

            <div className="mt-4">
              <BotonesNavegacion formId="tramitacionC2" formulario={formulario} anterior />
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default C2Page;
