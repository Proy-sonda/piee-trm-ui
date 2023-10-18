'use client';
import { LicenciaTramitar } from '@/app/tramitacion/(modelos)/licencia-tramitar';
import { InputFecha } from '@/components/form';
import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { useFetch } from '@/hooks/use-merge-fetch';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Alert, Col, Form, FormGroup, Row } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import Swal from 'sweetalert2';
import Cabecera from '../(componentes)/cabecera';
import { InputDias } from '../(componentes)/input-dias';
import {
  DatosModalConfirmarTramitacion,
  ModalConfirmarTramitacion,
} from './(componentes)/modal-confirmar-tramitacion';
import {
  FormularioC4,
  estaLicenciaAnteriorCompleta,
  licenciaAnteriorTieneCamposValidos,
} from './(modelos)/formulario-c4';
import { buscarZona4 } from './(servicios)/buscar-z4';
import { crearLicenciaZ4 } from './(servicios)/licencia-create-z4';
import { tramitarLicenciaMedica } from './(servicios)/tramitar-licencia';

interface PasoC4Props {
  params: {
    foliolicencia: string;
    idoperador: string;
  };
}

const C4Page: React.FC<PasoC4Props> = ({ params: { foliolicencia, idoperador } }) => {
  const idOperadorNumber = parseInt(idoperador);

  const step = [
    {
      label: 'Entidad Empleadora/Independiente',
      num: 1,
      active: false,
      url: `/tramitacion/${foliolicencia}/${idoperador}/c1`,
    },
    {
      label: 'Previsión persona trabajadora',
      num: 2,
      active: false,
      url: `/tramitacion/${foliolicencia}/${idoperador}/c2`,
    },
    {
      label: 'Renta y/o subsidios',
      num: 3,
      active: false,
      url: `/tramitacion/${foliolicencia}/${idoperador}/c3`,
    },
    { label: 'LME Anteriores', num: 4, active: true },
  ];

  const router = useRouter();

  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const formulario = useForm<FormularioC4>({
    mode: 'onBlur',
    defaultValues: {
      accion: 'guardar',
      linkNavegacion: '',
      informarLicencia: false,
      licenciasAnteriores: [],
    },
  });

  const licenciasAnteriores = useFieldArray({
    control: formulario.control,
    name: 'licenciasAnteriores',
  });

  const informarLicencias = formulario.watch('informarLicencia');

  const [datosModalConfirmarTramitacion, setDatosModalConfirmarTramitacion] = useState<
    Pick<DatosModalConfirmarTramitacion, 'show' | 'licenciasAnteriores'>
  >({
    show: false,
    licenciasAnteriores: [],
  });

  const [filasIncompletas, setFilasIncompletas] = useState<number[]>([]);

  const [licencia, setLicencia] = useState<LicenciaTramitar | undefined>();

  const [refresh, refrescarZona4] = useRefrescarPagina();

  const [errorZona4, zona4, cargandoZona4] = useFetch(
    buscarZona4(foliolicencia, idOperadorNumber),
    [refresh],
  );

  // Limpiar errores al no informar licencias
  useEffect(() => {
    if (!informarLicencias) {
      for (let index = 0; index < licenciasAnteriores.fields.length; index++) {
        formulario.setValue(`licenciasAnteriores.${index}.dias`, undefined as any);
        formulario.setValue(`licenciasAnteriores.${index}.desde`, undefined as any);
        formulario.setValue(`licenciasAnteriores.${index}.hasta`, undefined as any);
      }

      formulario.clearErrors();
    }
  }, [informarLicencias]);

  // Parchar cambios o crear filas de ser necesario
  useEffect(() => {
    const numeroLicenciasAnteriores = 6;

    // Crear si no existen
    if (!zona4 && licenciasAnteriores.fields.length === 0) {
      for (let index = 0; index < numeroLicenciasAnteriores; index++) {
        licenciasAnteriores.append({
          dias: undefined,
          desde: undefined,
          hasta: undefined,
        } as any);
      }
    }

    // Crear si hay zona 4
    if (zona4 && licenciasAnteriores.fields.length === 0) {
      for (const licenciaZ4 of zona4) {
        licenciasAnteriores.append({
          dias: licenciaZ4.lmandias,
          desde: licenciaZ4.lmafechadesde,
          hasta: licenciaZ4.lmafechahasta,
        } as any);
      }

      let filasRestantes = numeroLicenciasAnteriores - zona4.length;
      while (filasRestantes-- > 0) {
        licenciasAnteriores.append({
          dias: undefined,
          desde: undefined,
          hasta: undefined,
        } as any);
      }

      formulario.setValue('informarLicencia', zona4.length === 0);
    }

    // Parchar cuando las filas ya estan creadas
    if (zona4 && licenciasAnteriores.fields.length > 0) {
      let index = 0;
      for (index = 0; index < zona4.length; index++) {
        const licenciaZ4 = zona4[index];

        formulario.setValue(`licenciasAnteriores.${index}.dias`, licenciaZ4.lmandias);
        formulario.setValue(`licenciasAnteriores.${index}.desde`, licenciaZ4.lmafechadesde as any);
        formulario.setValue(`licenciasAnteriores.${index}.hasta`, licenciaZ4.lmafechahasta as any);
      }

      // Borrar el resto de filas
      while (index++ < numeroLicenciasAnteriores) {
        formulario.setValue(`licenciasAnteriores.${index}.dias`, undefined as any);
        formulario.setValue(`licenciasAnteriores.${index}.desde`, undefined as any);
        formulario.setValue(`licenciasAnteriores.${index}.hasta`, undefined as any);
      }

      formulario.setValue('informarLicencia', zona4.length !== 0);
    }
  }, [zona4]);

  const onSubmitForm: SubmitHandler<FormularioC4> = async (datos) => {
    /** Se puede filtrar por cualquiera de los campos de la fila que sea valida */
    const licenciasInformadas = obtenerLicenciasInformadas(datos);

    if (!(await formulario.trigger())) {
      Swal.fire({
        icon: 'error',
        title: 'Hay campos inválidos',
        text: 'Revise que todos los campos se hayan completado correctamente antes de continuar.',
        confirmButtonColor: 'var(--color-blue)',
      });
      return;
    }

    if (!validarQueFilasEstenCompletas(datos)) {
      Swal.fire({
        icon: 'error',
        title: 'Filas Incompletas',
        text: 'Revise que todas filas esten completas. Si no desea incluir una fila, debe asegurarse de que esta se encuentre en blanco.',
        confirmButtonColor: 'var(--color-blue)',
      });
      return;
    }

    const datosLimpios: FormularioC4 = {
      ...datos,
      licenciasAnteriores: licenciasInformadas,
    };

    switch (datosLimpios.accion) {
      case 'guardar':
        await guardarCambios(datosLimpios);
        break;
      case 'tramitar':
        await abrirModalParaConfirmarTramitacion(datosLimpios);
        break;
      case 'anterior':
        await guardarCambios(datosLimpios);
        router.push(`/tramitacion/${foliolicencia}/${idoperador}/c3`);
        break;
      case 'navegar':
        router.push(datosLimpios.linkNavegacion);
        break;
      default:
        throw new Error('Accion desconocida en Paso 3');
    }
  };

  const abrirModalParaConfirmarTramitacion = async (datos: FormularioC4) => {
    const guardadoExitoso = await llamarEndpointGuardarDeCambios(datos);
    if (!guardadoExitoso) {
      return;
    }

    setDatosModalConfirmarTramitacion({
      show: true,
      licenciasAnteriores: datos.licenciasAnteriores,
    });
  };

  const guardarCambios = async (datos: FormularioC4) => {
    const guardadoExitoso = await llamarEndpointGuardarDeCambios(datos);
    if (!guardadoExitoso) {
      return;
    }

    refrescarZona4();

    switch (datos.accion) {
      case 'guardar':
        Swal.fire({
          icon: 'success',
          html: 'Cambios guardados con éxito',
          showConfirmButton: false,
          timer: 2000,
        });
        break;

      default:
        break;
    }
  };

  const llamarEndpointGuardarDeCambios = async (datos: FormularioC4) => {
    try {
      setMostrarSpinner(true);

      await crearLicenciaZ4({
        ...datos,
        folioLicencia: foliolicencia,
        idOperador: idOperadorNumber,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron guardar los cambios',
        confirmButtonColor: 'var(--color-blue)',
      });

      return false;
    } finally {
      setMostrarSpinner(false);
    }

    return true;
  };

  const obtenerLicenciasInformadas = (datos: FormularioC4) => {
    return !datos.informarLicencia
      ? []
      : datos.licenciasAnteriores.filter(licenciaAnteriorTieneCamposValidos);
  };

  const validarQueFilasEstenCompletas = (datos: FormularioC4) => {
    const filasMalas: number[] = [];

    for (let index = 0; index < datos.licenciasAnteriores.length; index++) {
      const licencia = datos.licenciasAnteriores[index];

      if (!licenciaAnteriorTieneCamposValidos(licencia)) {
        continue;
      }

      if (licenciaAnteriorTieneCamposValidos(licencia) && !estaLicenciaAnteriorCompleta(licencia)) {
        filasMalas.push(index + 1);
      }
    }

    setFilasIncompletas(filasMalas);

    return filasMalas.length === 0;
  };

  const tramitarLaLicencia = async () => {
    cerrarModal();

    try {
      setMostrarSpinner(true);

      await tramitarLicenciaMedica(foliolicencia, idOperadorNumber);

      Swal.fire({
        icon: 'success',
        html: 'Licencia tramitada con éxito',
        showConfirmButton: false,
        timer: 2000,
      });

      router.push('/tramitacion');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo tramitar la licencia',
        confirmButtonColor: 'var(--color-blue)',
      });
    } finally {
      setMostrarSpinner(false);
    }
  };

  const cerrarModal = () => {
    setDatosModalConfirmarTramitacion({
      show: false,
      licenciasAnteriores: [],
    });
  };

  return (
    <>
      <ModalConfirmarTramitacion
        datos={{
          ...datosModalConfirmarTramitacion,
          licencia,
          folioLicencia: foliolicencia,
          idOperador: idOperadorNumber,
        }}
        onCerrar={cerrarModal}
        onTramitacionConfirmada={tramitarLaLicencia}
      />

      <IfContainer show={mostrarSpinner}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <div className="bgads">
        <div className="pb-3 px-3 px-lg-5">
          <Cabecera
            foliotramitacion={foliolicencia}
            idoperador={idOperadorNumber}
            step={step}
            title="Licencias Anteriores en los Últimos 6 Meses"
            onLicenciaCargada={setLicencia}
            onLinkClickeado={(link) => {
              formulario.setValue('linkNavegacion', link);
              formulario.setValue('accion', 'navegar');
              formulario.handleSubmit(onSubmitForm)();
            }}
          />

          <IfContainer show={cargandoZona4}>
            <LoadingSpinner titulo="Cargando información..." />
          </IfContainer>

          <IfContainer show={!cargandoZona4 && errorZona4}>
            <Row className="pt-5 pb-1">
              <Col xs={12}>
                <h1 className="fs-3 text-center">Error</h1>
                <p className="text-center">
                  Hubo un error al cargar los datos. Por favor intente más tarde.
                </p>
              </Col>
            </Row>
          </IfContainer>

          <IfContainer show={!cargandoZona4 && !errorZona4}>
            <Row className="mt-2 mb-3">
              <Col xs={12}>
                <FormGroup controlId="informarLicencias" className="ps-0">
                  <Form.Check
                    type="checkbox"
                    label="Informar Licencias Médicas Anteriores últimos 6 meses"
                    {...formulario.register('informarLicencia')}
                  />
                </FormGroup>
              </Col>
            </Row>

            <IfContainer show={informarLicencias && filasIncompletas.length !== 0}>
              <Row>
                <Col xs={12}>
                  <Alert variant="danger" className="d-flex align-items-center fade show">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    <span>
                      Las siguientes filas están incompletas:
                      {filasIncompletas.reduce(
                        (acc, fila, index) => `${acc}${index !== 0 ? ',' : ''} ${fila}`,
                        '',
                      )}
                    </span>
                  </Alert>
                </Col>
              </Row>
            </IfContainer>

            <FormProvider {...formulario}>
              <form onSubmit={formulario.handleSubmit(onSubmitForm)}>
                <Row>
                  <Col xs={12}>
                    <Table className="table table-bordered">
                      <Thead>
                        <Tr className="align-middle">
                          <Th>Total Días</Th>
                          <Th>Desde</Th>
                          <Th>Hasta</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {licenciasAnteriores.fields.map((field, index) => (
                          <Tr key={field.id}>
                            <Td>
                              <InputDias
                                opcional={!informarLicencias || (informarLicencias && index !== 0)}
                                maxDias={184}
                                deshabilitado={!informarLicencias}
                                name={`licenciasAnteriores.${index}.dias`}
                                coincideConRango={{
                                  desde: `licenciasAnteriores.${index}.desde`,
                                  hasta: `licenciasAnteriores.${index}.hasta`,
                                }}
                                unirConFieldArray={{
                                  index,
                                  campo: 'dias',
                                  fieldArrayName: 'licenciasAnteriores',
                                }}
                              />
                            </Td>
                            <Td>
                              <InputFecha
                                opcional={!informarLicencias || (informarLicencias && index !== 0)}
                                deshabilitado={!informarLicencias}
                                name={`licenciasAnteriores.${index}.desde`}
                                noPosteriorA={`licenciasAnteriores.${index}.hasta`}
                                unirConFieldArray={{
                                  index,
                                  campo: 'desde',
                                  fieldArrayName: 'licenciasAnteriores',
                                }}
                              />
                            </Td>
                            <Td>
                              <InputFecha
                                opcional={!informarLicencias || (informarLicencias && index !== 0)}
                                deshabilitado={!informarLicencias}
                                name={`licenciasAnteriores.${index}.hasta`}
                                noAnteriorA={`licenciasAnteriores.${index}.desde`}
                                unirConFieldArray={{
                                  index,
                                  campo: 'hasta',
                                  fieldArrayName: 'licenciasAnteriores',
                                }}
                              />
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Col>
                </Row>

                <div className="row">
                  <div className="d-none d-md-none col-lg-4 d-lg-inline"></div>
                  <div className="col-sm-3 col-md-3 d-grid col-lg-2 p-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      {...formulario.register('accion')}
                      onClick={() => formulario.setValue('accion', 'anterior')}>
                      Anterior
                    </button>
                  </div>
                  <div className="col-sm-3 col-md-3 d-grid col-lg-2 p-2">
                    <a className="btn btn-danger" href="/tramitacion">
                      Tramitación
                    </a>
                  </div>
                  <div className="col-sm-3 col-md-3 d-grid col-lg-2 p-2">
                    <button
                      type="submit"
                      className="btn btn-success"
                      {...formulario.register('accion')}
                      onClick={() => formulario.setValue('accion', 'guardar')}>
                      Guardar
                    </button>
                  </div>
                  <div className="col-sm-3 col-md-3 d-grid col-lg-2 p-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      {...formulario.register('accion')}
                      onClick={() => formulario.setValue('accion', 'tramitar')}>
                      Tramitar
                    </button>
                  </div>
                </div>
              </form>
            </FormProvider>
          </IfContainer>
        </div>
      </div>
    </>
  );
};

export default C4Page;
