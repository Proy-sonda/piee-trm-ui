'use client';
import { InputFecha } from '@/components/form';
import { Form, FormGroup } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import Cabecera from '../(componentes)/cabecera';
import { InputDias } from '../(componentes)/input-dias';
import { FormularioC4 } from './(modelos)/formulario-c4';
interface myprops {
  params: {
    foliotramitacion: string;
  };
}
const C4Page: React.FC<myprops> = ({ params: { foliotramitacion } }) => {
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

  const tramitarLicencia: SubmitHandler<FormularioC4> = async (data) => {
    console.log('TRAMITANDO LICENCIA:', data);
  };

  return (
    <>
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
            <form onSubmit={formulario.handleSubmit(tramitarLicencia)}>
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
                            opcional
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
                            opcional
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
                            opcional
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
