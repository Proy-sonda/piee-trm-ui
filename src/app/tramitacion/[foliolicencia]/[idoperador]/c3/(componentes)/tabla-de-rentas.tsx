import { ComboSimple, InputMesAno } from '@/components/form';
import IfContainer from '@/components/if-container';
import { Alert, Col, Row } from 'react-bootstrap';
import { UseFieldArrayReturn, useFormContext } from 'react-hook-form';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { FormularioC3 } from '../(modelos)/formulario-c3';
import { InputDias } from '../../(componentes)/input-dias';
import {
  EntidadPrevisional,
  crearIdEntidadPrevisional,
  glosaCompletaEntidadPrevisional,
} from '../../c2/(modelos)/entidad-previsional';
import { InputDesgloseDeHaberes } from './input-desglose-de-haberes';
import { InputMonto } from './input-monto';
import { DatosModalDesgloseHaberes } from './modal-desglose-haberes';

interface TablaDeRentasProps<
  T extends keyof Pick<FormularioC3, 'remuneraciones' | 'remuneracionesMaternidad'>,
> {
  titulo: string;
  filasIncompletas: number[];
  tiposPrevisiones: EntidadPrevisional[];
  fieldArray: T;
  remuneraciones: UseFieldArrayReturn<FormularioC3, T, 'id'>;
  onClickBotonDesglose: (datos: DatosModalDesgloseHaberes) => void | Promise<void>;
}

export const TablaDeRentas = <
  T extends keyof Pick<FormularioC3, 'remuneraciones' | 'remuneracionesMaternidad'>,
>({
  titulo,
  fieldArray,
  filasIncompletas,
  tiposPrevisiones,
  remuneraciones,
  onClickBotonDesglose,
}: TablaDeRentasProps<T>) => {
  const formulario = useFormContext<FormularioC3>();

  const limpiarFila = (
    fieldArray: keyof Pick<FormularioC3, 'remuneraciones' | 'remuneracionesMaternidad'>,
    index: number,
  ) => {
    formulario.setValue(`${fieldArray}.${index}`, {
      prevision: '',
      periodoRenta: null,
      desgloseHaberes: {},
      dias: undefined,
      diasIncapacidad: undefined,
      montoImponible: undefined,
      montoIncapacidad: undefined,
      totalRemuneracion: undefined,
    } as any);
  };

  return (
    <>
      <Row className="my-3">
        <Col xs={12}>
          <h6 className="text-center">{titulo}</h6>
        </Col>
      </Row>

      <IfContainer show={filasIncompletas.length !== 0}>
        <Row>
          <Col xs={12}>
            <Alert variant="danger" className="d-flex align-items-center fade show">
              <i className="bi bi-exclamation-triangle me-2"></i>
              <span>
                Las siguientes filas están incompletas:{' '}
                {filasIncompletas.map((x) => x.toString()).join(', ')}
              </span>
            </Alert>
          </Col>
        </Row>
      </IfContainer>

      <Row>
        <Col xs={12}>
          <div className="table-responsive">
            <Table className="table table-bordered">
              <Thead>
                <Tr className="align-middle text-center">
                  <Th>Institución Previsional</Th>
                  <Th>Periodo Renta</Th>
                  <Th>
                    <span className="text-nowrap">N° Días</span>
                  </Th>
                  <Th>Monto Imponible</Th>
                  <Th>Total Remuneración</Th>
                  <Th>Monto Incapacidad</Th>
                  <Th>Días Incapacidad</Th>
                  <Th>Registrar Desglose de haberes</Th>
                  <Th> </Th>
                </Tr>
              </Thead>
              <Tbody>
                {remuneraciones.fields.map((field, index) => (
                  <Tr key={field.id}>
                    <Td>
                      <ComboSimple
                        opcional={fieldArray === 'remuneracionesMaternidad' || index !== 0}
                        name={`${fieldArray}.${index}.prevision`}
                        datos={tiposPrevisiones}
                        idElemento={crearIdEntidadPrevisional}
                        descripcion={glosaCompletaEntidadPrevisional}
                        tipoValor="string"
                        unirConFieldArray={{
                          index,
                          campo: 'prevision',
                          fieldArrayName: fieldArray,
                        }}
                      />
                    </Td>
                    <Td>
                      <InputMesAno
                        opcional={fieldArray === 'remuneracionesMaternidad' || index !== 0}
                        name={`${fieldArray}.${index}.periodoRenta`}
                        unirConFieldArray={{
                          index,
                          campo: 'periodoRenta',
                          fieldArrayName: fieldArray,
                        }}
                      />
                    </Td>
                    <Td>
                      <InputDias
                        opcional={fieldArray === 'remuneracionesMaternidad' || index !== 0}
                        name={`${fieldArray}.${index}.dias`}
                        unirConFieldArray={{
                          index,
                          campo: 'dias',
                          fieldArrayName: fieldArray,
                        }}
                      />
                    </Td>
                    <Td>
                      <InputMonto
                        opcional={fieldArray === 'remuneracionesMaternidad' || index !== 0}
                        name={`${fieldArray}.${index}.montoImponible`}
                        unirConFieldArray={{
                          index,
                          campo: 'montoImponible',
                          fieldArrayName: fieldArray,
                        }}
                      />
                    </Td>
                    <Td>
                      <InputMonto
                        opcional
                        name={`${fieldArray}.${index}.totalRemuneracion`}
                        unirConFieldArray={{
                          index,
                          campo: 'totalRemuneracion',
                          fieldArrayName: fieldArray,
                        }}
                      />
                    </Td>
                    <Td>
                      <InputMonto
                        opcional
                        name={`${fieldArray}.${index}.montoIncapacidad`}
                        unirConFieldArray={{
                          index,
                          campo: 'montoIncapacidad',
                          fieldArrayName: fieldArray,
                        }}
                      />
                    </Td>
                    <Td>
                      <InputDias
                        opcional
                        name={`${fieldArray}.${index}.diasIncapacidad`}
                        unirConFieldArray={{
                          index,
                          campo: 'diasIncapacidad',
                          fieldArrayName: fieldArray,
                        }}
                      />
                    </Td>
                    <Td>
                      <div className="align-middle text-center">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            onClickBotonDesglose({
                              // prettier-ignore
                              periodoRenta: formulario.getValues(`${fieldArray}.${index}.periodoRenta`),
                              fieldArray: fieldArray,
                              indexInput: index,
                              show: true,
                              // prettier-ignore
                              desgloseInicial: formulario.getValues(`${fieldArray}.${index}.desgloseHaberes`),
                            });
                          }}>
                          <i className="bi bi-bounding-box-circles"></i>
                        </button>

                        <InputDesgloseDeHaberes
                          opcional
                          name={`${fieldArray}.${index}.desgloseHaberes`}
                          montoImponibleName={`${fieldArray}.${index}.montoImponible`}
                          unirConFieldArray={{
                            index,
                            campo: 'desgloseHaberes',
                            fieldArrayName: fieldArray,
                          }}
                        />
                      </div>
                    </Td>
                    <Td>
                      <div className="text-center align-middle">
                        <button
                          type="button"
                          className="btn text-danger"
                          title="Descartar fila"
                          onClick={() => limpiarFila(fieldArray, index)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </>
  );
};
