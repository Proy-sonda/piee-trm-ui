'use client';
import { InputFecha } from '@/components/form';
import { esFechaInvalida } from '@/utilidades';
import { useState } from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import Cabecera from '../(componentes)/cabecera';
import { InputDias } from '../(componentes)/input-dias';
import {
  DatosModalConfirmarTramitacion,
  ModalConfirmarTramitacion,
} from './(componentes)/modal-confirmar-tramitacion';
import { FormularioC4 } from './(modelos)/formulario-c4';
interface PasoC4Props {
  params: {
    foliotramitacion: string;
  };
}

const C4Page: React.FC<PasoC4Props> = ({ params: { foliotramitacion } }) => {
  const step = [
    { label: 'Entidad Empleadora/Independiente', num: 1, active: false, url: '/adscripcion' },
    { label: 'Previsión persona trabajadora', num: 2, active: false, url: '/adscripcion/pasodos' },
    { label: 'Renta y/o subsidios', num: 3, active: false, url: '/adscripcion/pasodos' },
    { label: 'LME Anteriores', num: 4, active: true, url: '/adscripcion/pasodos' },
  ];

  const formulario = useForm<FormularioC4>({
    mode: 'onBlur',
    defaultValues: {
      informarLicencia: false,
      licenciasAnteriores: [{}, {}, {}, {}, {}, {}],
    },
  });

  const licenciasAnteriores = useFieldArray({
    control: formulario.control,
    name: 'licenciasAnteriores',
  });

  const informarLicencias = formulario.watch('informarLicencia');

  const [datosModalConfirmarTramitacion, setDatosModalConfirmarTramitacion] =
    useState<DatosModalConfirmarTramitacion>({
      show: false,
      licenciasAnteriores: [],
    });

  const confirmarTramitacionDeLicencia: SubmitHandler<FormularioC4> = async (data) => {
    /** Se puede filtrar por cualquiera de los campos de la fila que sea valida */
    const licenciasInformadas = data.licenciasAnteriores.filter(
      (licencia) => !esFechaInvalida(licencia.hasta),
    );

    setDatosModalConfirmarTramitacion({
      show: true,
      licenciasAnteriores: licenciasInformadas,
    });
  };

  const tramitarLaLicencia = () => {
    console.log('TRAMITANDO LICENCIA:', formulario.getValues());
    cerrarModal();
  };

  const cerrarModal = () => {
    setDatosModalConfirmarTramitacion({
      show: false,
      licenciasAnteriores: [],
    });
  };

  const estaLafilaVacia = (index: number) => {
    const { dias, desde, hasta } = formulario.getValues(`licenciasAnteriores.${index}`);

    /** Si el campo es invalido se considera como que no se ingreso. Cada elemento va a ser `true`
     * solo si no se ingreso */
    const camposSinIngresar = [
      dias === undefined || isNaN(dias),
      esFechaInvalida(desde),
      esFechaInvalida(hasta),
    ];

    /* El filter solo toma los campos sin ingresar, y si luego del filter el arreglo no cambia de
     * tamaño, es porque esta toda la fila vacía. */
    return camposSinIngresar.filter((x) => x).length === camposSinIngresar.length;
  };

  return (
    <>
      <ModalConfirmarTramitacion
        datos={datosModalConfirmarTramitacion}
        onCerrar={cerrarModal}
        onTramitacionConfirmada={tramitarLaLicencia}
      />

      <div className="bgads">
        <div className="ms-5 me-5">
          <Cabecera
            foliotramitacion={foliotramitacion}
            step={step}
            title="Licencias Anteriores en los Últimos 6 Meses"
          />

          <div className="row mt-2">
            <FormGroup controlId="informarLicencias" className="ps-0">
              <Form.Check
                type="checkbox"
                label="Informar Licencias Médicas Anteriores últimos 6 meses"
                {...formulario.register('informarLicencia')}
              />
            </FormGroup>
          </div>

          <FormProvider {...formulario}>
            <form onSubmit={formulario.handleSubmit(confirmarTramitacionDeLicencia)}>
              <div className="row mt-2">
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
                            opcional={estaLafilaVacia(index)}
                            maxDias={184}
                            deshabilitado={!informarLicencias}
                            name={`licenciasAnteriores.${index}.dias`}
                            unirConFieldArray={{
                              index,
                              campo: 'dias',
                              fieldArrayName: 'licenciasAnteriores',
                            }}
                          />
                        </Td>
                        <Td>
                          <InputFecha
                            opcional={estaLafilaVacia(index)}
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
                            opcional={estaLafilaVacia(index)}
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
              </div>

              <div className="row">
                <div className="d-none d-md-none col-lg-6 d-lg-inline"></div>
                <div className="col-sm-4 col-md-4 d-grid col-lg-2 p-2">
                  <a className="btn btn-danger" href="/tramitacion">
                    Tramitación
                  </a>
                </div>
                <div className="col-sm-4 col-md-4 d-grid col-lg-2 p-2">
                  <button type="button" className="btn btn-success">
                    Guardar
                  </button>
                </div>
                <div className="col-sm-4 col-md-4 d-grid col-lg-2 p-2">
                  <button className="btn btn-primary" type="submit">
                    Tramitar
                  </button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default C4Page;
