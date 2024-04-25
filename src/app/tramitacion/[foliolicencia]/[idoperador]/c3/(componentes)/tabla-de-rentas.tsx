import { ComboSimple, InputMesAno } from '@/components/form';
import { GuiaUsuario } from '@/components/guia-usuario';
import IfContainer from '@/components/if-container';
import { AuthContext } from '@/contexts';
import { useFetch } from '@/hooks';
import { ENUM_CONFIGURACION } from '@/modelos/enum/configuracion';
import { BuscarConfiguracion } from '@/servicios/buscar-configuracion';
import { existe } from '@/utilidades';
import { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Col, Row } from 'react-bootstrap';
import { UseFieldArrayReturn, useFormContext } from 'react-hook-form';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Remuneracion } from '../(modelos)';
import { FormularioC3, TipoRemuneracion } from '../(modelos)/formulario-c3';
import { InputDias } from '../../(componentes)/input-dias';
import { Licenciac2 } from '../../c2/(modelos)';
import {
  EntidadPrevisional,
  crearIdEntidadPrevisional,
  entidadPrevisionalEsAFP,
  glosaCompletaEntidadPrevisional,
} from '../../c2/(modelos)/entidad-previsional';
import { InputDesgloseDeHaberes } from './input-desglose-de-haberes';
import { InputMonto } from './input-monto';
import { DatosModalDesgloseHaberes } from './modal-desglose-haberes';

interface TablaDeRentasProps {
  titulo: string;
  filasIncompletas: number[];
  tiposPrevisiones: EntidadPrevisional[];
  zona2: Licenciac2;
  fieldArray: TipoRemuneracion;
  remuneraciones: UseFieldArrayReturn<FormularioC3, TipoRemuneracion, 'id'>;
  onClickBotonDesglose: (datos: DatosModalDesgloseHaberes) => void | Promise<void>;
  rangoPeriodo?: {
    desde: string;
    hasta: string;
  };
}

export const TablaDeRentas: React.FC<TablaDeRentasProps> = ({
  titulo,
  zona2,
  fieldArray,
  filasIncompletas,
  tiposPrevisiones,
  remuneraciones,
  onClickBotonDesglose,
  rangoPeriodo,
}) => {
  const TIPO_MONTO_NAME = entidadPrevisionalEsAFP(zona2.entidadprevisional)
    ? 'totalRemuneracion'
    : 'montoImponible';

  const formulario = useFormContext<FormularioC3>();
  const [, configuracion] = useFetch(BuscarConfiguracion());
  const [desglosehaberesopcional, setdesglosehaberesopcional] = useState(true);

  useEffect(() => {
    if (configuracion) {
      // validamos la fecha de vigencia sea mayor a la fecha actual
      const fechaVigencia = new Date(
        configuracion?.find((x) => x.codigoparametro === ENUM_CONFIGURACION.VALIDA_INGRESO_HABERES)!
          ?.fechavigencia!,
      );
      const fechaActual = new Date();
      if (fechaVigencia < fechaActual) {
        setdesglosehaberesopcional(true);
      } else {
        setdesglosehaberesopcional(
          configuracion?.find(
            (c) => c.codigoparametro === ENUM_CONFIGURACION.VALIDA_INGRESO_HABERES,
          )!?.valor == '2'
            ? true
            : false,
        );
      }
    }
  }, [configuracion]);

  const limpiarFila = (fieldArray: TipoRemuneracion, index: number) => {
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

  const nrodias = useRef(null);
  const totalRemuneracion = useRef(null);
  const btnDesglose = useRef(null);
  const {
    datosGuia: { guia, listaguia, AgregarGuia },
  } = useContext(AuthContext);

  const autoCompletarColumna = (index: number, campo: keyof Remuneracion) => {
    return (value: any) => {
      if (!existe(value) || index !== 0) {
        return;
      }

      if (typeof value === 'number' && isNaN(value)) {
        return;
      }

      for (let index = 1; index < remuneraciones.fields.length; index++) {
        formulario.setValue(`${fieldArray}.${index}.${campo}`, value);
      }
    };
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
          <div className="table-responsive" style={{ overflow: 'visible' }}>
            <Table className="table table-bordered">
              <Thead>
                <Tr className="align-middle text-center">
                  <Th>Institución Previsional</Th>
                  <Th>Periodo Renta</Th>
                  <Th>
                    <span className="text-nowrap">N° Días</span>
                  </Th>
                  <Th>Imponible Desahucio</Th>
                  <Th> Total Remuneración </Th>
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
                        onBlur={autoCompletarColumna(index, 'prevision')}
                      />
                    </Td>
                    <Td>
                      <InputMesAno
                        opcional={fieldArray === 'remuneracionesMaternidad' || index !== 0}
                        name={`${fieldArray}.${index}.periodoRenta`}
                        minDate={rangoPeriodo?.desde}
                        maxDate={rangoPeriodo?.hasta}
                        unirConFieldArray={{
                          index,
                          campo: 'periodoRenta',
                          fieldArrayName: fieldArray,
                        }}
                      />
                    </Td>
                    <Td>
                      {index === 0 && (
                        <GuiaUsuario guia={listaguia[1]!?.activo && guia} target={nrodias}>
                          Cantidad de días trabajados en el periodo de renta
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
                                  {
                                    indice: 1,
                                    nombre: 'nro dias',
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
                                    nombre: 'nro dias',
                                    activo: false,
                                  },
                                  {
                                    indice: 2,
                                    nombre: 'total remuneración',
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
                      )}
                      <div
                        ref={index === 0 ? nrodias : undefined}
                        className={guia && listaguia[1]!?.activo ? 'overlay-marco' : ''}>
                        <InputDias
                          opcional={fieldArray === 'remuneracionesMaternidad' || index !== 0}
                          name={`${fieldArray}.${index}.dias`}
                          unirConFieldArray={{
                            index,
                            campo: 'dias',
                            fieldArrayName: fieldArray,
                          }}
                          onBlur={autoCompletarColumna(index, 'dias')}
                        />
                      </div>
                    </Td>
                    <Td>
                      <div
                        className={`${listaguia[2]!?.activo && guia && 'overlay-marco'}`}
                        ref={index === 0 ? totalRemuneracion : undefined}>
                        <InputMonto
                          opcional={
                            fieldArray === 'remuneracionesMaternidad' ||
                            index !== 0 ||
                            entidadPrevisionalEsAFP(zona2.entidadprevisional)
                          }
                          deshabilitado={entidadPrevisionalEsAFP(zona2.entidadprevisional)}
                          name={`${fieldArray}.${index}.montoImponible`}
                          unirConFieldArray={{
                            index,
                            campo: 'montoImponible',
                            fieldArrayName: fieldArray,
                          }}
                          onBlur={autoCompletarColumna(index, 'montoImponible')}
                        />
                      </div>
                    </Td>
                    <Td>
                      {index === 0 && (
                        <GuiaUsuario
                          guia={listaguia[2]!?.activo && guia}
                          target={totalRemuneracion}>
                          Total de la remuneración del periodo de renta
                          <br />
                          <div className="text-end mt-3">
                            <button
                              className="btn btn-sm text-white"
                              onClick={() => {
                                AgregarGuia([
                                  { indice: 0, nombre: 'stepper', activo: false },
                                  {
                                    indice: 1,
                                    nombre: 'nro dias',
                                    activo: true,
                                  },
                                  {
                                    indice: 2,
                                    nombre: 'total remuneración',
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
                                  { indice: 0, nombre: 'stepper', activo: false },
                                  {
                                    indice: 1,
                                    nombre: 'nro dias',
                                    activo: false,
                                  },
                                  {
                                    indice: 2,
                                    nombre: 'total remuneración',
                                    activo: false,
                                  },
                                  {
                                    indice: 3,
                                    nombre: 'desglose haberes',
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
                      )}
                      <div
                        className={`${listaguia[2]!?.activo && guia && 'overlay-marco'}`}
                        ref={index === 0 ? totalRemuneracion : undefined}>
                        <InputMonto
                          opcional={
                            fieldArray === 'remuneracionesMaternidad' ||
                            index !== 0 ||
                            !entidadPrevisionalEsAFP(zona2.entidadprevisional)
                          }
                          deshabilitado={!entidadPrevisionalEsAFP(zona2.entidadprevisional)}
                          name={`${fieldArray}.${index}.totalRemuneracion`}
                          unirConFieldArray={{
                            index,
                            campo: 'totalRemuneracion',
                            fieldArrayName: fieldArray,
                          }}
                          onBlur={autoCompletarColumna(index, 'totalRemuneracion')}
                        />
                      </div>
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
                        onBlur={autoCompletarColumna(index, 'montoIncapacidad')}
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
                        onBlur={autoCompletarColumna(index, 'diasIncapacidad')}
                      />
                    </Td>
                    <Td>
                      <div className="align-middle text-center">
                        {index === 0 && (
                          <GuiaUsuario guia={listaguia[3]!?.activo && guia} target={btnDesglose}>
                            Detallar la remuneración del periodo de renta
                            <br />
                            <div className="text-end mt-3">
                              <button
                                className="btn btn-sm text-white"
                                onClick={() => {
                                  AgregarGuia([
                                    { indice: 0, nombre: 'stepper', activo: false },
                                    {
                                      indice: 1,
                                      nombre: 'nro dias',
                                      activo: false,
                                    },
                                    {
                                      indice: 2,
                                      nombre: 'total remuneración',
                                      activo: true,
                                    },
                                    {
                                      indice: 3,
                                      nombre: 'desglose haberes',
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
                                    { indice: 0, nombre: 'stepper', activo: false },
                                    {
                                      indice: 1,
                                      nombre: 'nro dias',
                                      activo: false,
                                    },
                                    {
                                      indice: 2,
                                      nombre: 'total remuneración',
                                      activo: false,
                                    },
                                    {
                                      indice: 3,
                                      nombre: 'desglose haberes',
                                      activo: false,
                                    },
                                    {
                                      indice: 4,
                                      nombre: 'Tipo de documento',
                                      activo: true,
                                    },
                                  ]);
                                  // bajar focus de pantalla abajo
                                  window.scrollTo(0, document.body.scrollHeight);
                                }}
                                style={{
                                  border: '1px solid white',
                                }}>
                                Continuar &nbsp;
                                <i className="bi bi-arrow-right"></i>
                              </button>
                            </div>
                          </GuiaUsuario>
                        )}
                        <div
                          className={`${listaguia[3]!?.activo && guia && 'overlay-marco'}`}
                          ref={index === 0 ? btnDesglose : undefined}>
                          <button
                            type="button"
                            className={`btn btn-primary`}
                            onClick={() => {
                              onClickBotonDesglose({
                                zona2: zona2,
                                montoTotal: formulario.getValues(
                                  `${fieldArray}.${index}.${TIPO_MONTO_NAME}`,
                                ),
                                periodoRenta: formulario.getValues(
                                  `${fieldArray}.${index}.periodoRenta`,
                                ),
                                fieldArray: fieldArray,
                                indexInput: index,
                                show: true,
                                desgloseInicial: formulario.getValues(
                                  `${fieldArray}.${index}.desgloseHaberes`,
                                ),
                              });
                            }}>
                            <i className="bi bi-bounding-box-circles"></i>
                          </button>
                        </div>

                        <InputDesgloseDeHaberes
                          opcional={desglosehaberesopcional}
                          name={`${fieldArray}.${index}.desgloseHaberes`}
                          montoImponibleName={`${fieldArray}.${index}.${TIPO_MONTO_NAME}`}
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
