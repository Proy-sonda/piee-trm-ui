import IfContainer from '@/components/if-container';
import { capitalizar, esFechaInvalida } from '@/utilidades';
import { format } from 'date-fns';
import esLocale from 'date-fns/locale/es';
import React, { useEffect, useState } from 'react';
import { Alert, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { DesgloseDeHaberes, TipoRemuneracion, existeDesglose, totalDesglose } from '../(modelos)';
import { Licenciac2, entidadPrevisionalEsAFP } from '../../c2/(modelos)';
import { InputMonto } from './input-monto';

export interface DatosModalDesgloseHaberes {
  show: boolean;
  zona2?: Licenciac2;
  montoTotal: number;
  periodoRenta: Date;
  fieldArray: TipoRemuneracion;
  indexInput: number;
  desgloseInicial?: DesgloseDeHaberes | Record<string, never>;
}

interface ModalDesgloseDeHaberesProps {
  datos: DatosModalDesgloseHaberes;
  onCerrar: () => void;
  onGuardarDesglose: (
    fieldArray: TipoRemuneracion,
    indexInput: number,
    desglose: DesgloseDeHaberes,
  ) => void;
  onDescartarDesglose: (fieldArray: TipoRemuneracion, indexInput: number) => void;
}

type FormularioDesgloseHaberes = DesgloseDeHaberes;

export const ModalDesgloseDeHaberes: React.FC<ModalDesgloseDeHaberesProps> = ({
  datos,
  onCerrar,
  onGuardarDesglose,
  onDescartarDesglose,
}) => {
  const formulario = useForm<FormularioDesgloseHaberes>({ mode: 'onBlur' });

  const [mensajeErrorGlobal, setMensajeErrorGlobal] = useState<string>();

  useEffect(() => {
    if (!datos.desgloseInicial) {
      return;
    }

    formulario.setValue('sueldoBase', datos.desgloseInicial.sueldoBase);
    formulario.setValue('gratificacion', datos.desgloseInicial.gratificacion);
    formulario.setValue('horasExtras', datos.desgloseInicial.horasExtras);
    formulario.setValue('aguinaldos', datos.desgloseInicial.aguinaldos);
    formulario.setValue('bono1', datos.desgloseInicial.bono1);
    formulario.setValue('bono2', datos.desgloseInicial.bono2);
    formulario.setValue('bono3', datos.desgloseInicial.bono3);
    formulario.setValue('bono4', datos.desgloseInicial.bono4);
    formulario.setValue('bono5', datos.desgloseInicial.bono5);
  }, [datos.desgloseInicial, formulario]);

  const limpiarModal = () => {
    formulario.reset();
    setMensajeErrorGlobal(undefined);
  };

  const guardarDesglose: SubmitHandler<FormularioDesgloseHaberes> = async (desglose) => {
    if (!datos.zona2) {
      throw new Error('No existe la zona 2');
    }

    if (existeDesglose(desglose) && totalDesglose(desglose) !== datos.montoTotal) {
      const tipoMonto = entidadPrevisionalEsAFP(datos.zona2.entidadprevisional)
        ? 'total remuneración'
        : 'imponible desahucio';

      // prettier-ignore
      setMensajeErrorGlobal(
        `El total del desglose ($${totalDesglose(desglose).toLocaleString()}) no coincide con el ${tipoMonto} ($${datos.montoTotal.toLocaleString()})`,
      );

      formulario.setFocus('sueldoBase');
      return;
    }

    limpiarModal();
    onGuardarDesglose(datos.fieldArray, datos.indexInput, desglose);
  };

  const descartarCambios = () => {
    limpiarModal();
    onDescartarDesglose(datos.fieldArray, datos.indexInput);
  };

  const handleCerrarModal = () => {
    limpiarModal();
    onCerrar();
  };

  return (
    <>
      <Modal show={datos.show} centered backdrop="static">
        <Modal.Header closeButton onClick={handleCerrarModal}>
          <Modal.Title className="fs-5">
            Desglose de Haberes Periodo{' '}
            {esFechaInvalida(datos.periodoRenta)
              ? 'Sin Definir'
              : capitalizar(format(datos.periodoRenta, 'MMMM yyyy', { locale: esLocale }))}
          </Modal.Title>
        </Modal.Header>

        <FormProvider {...formulario}>
          <Form id="formularioDesgloseHaberes" onSubmit={formulario.handleSubmit(guardarDesglose)}>
            <Modal.Body className="p-2 p-sm-3">
              <IfContainer show={mensajeErrorGlobal}>
                <Row>
                  <Col xs={12}>
                    <Alert variant="danger" className="d-flex align-items-center fade show">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      <span>{mensajeErrorGlobal}</span>
                    </Alert>
                  </Col>
                </Row>
              </IfContainer>

              <Table bordered>
                <thead>
                  <tr>
                    <th colSpan={2} className="text-center py-2">
                      Haberes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="align-middle">Sueldo Base</td>
                    <td>
                      <InputMonto name="sueldoBase" />
                    </td>
                  </tr>
                  <tr>
                    <td className="align-middle">Gratificación</td>
                    <td>
                      <InputMonto name="gratificacion" />
                    </td>
                  </tr>
                  <tr>
                    <td className="align-middle">Horas Extras</td>
                    <td>
                      <InputMonto name="horasExtras" />
                    </td>
                  </tr>
                  <tr>
                    <td className="align-middle">Aguinaldos</td>
                    <td>
                      <InputMonto name="aguinaldos" />
                    </td>
                  </tr>
                  <tr>
                    <td className="align-middle">Bono 1</td>
                    <td>
                      <InputMonto name="bono1" />
                    </td>
                  </tr>
                  <tr>
                    <td className="align-middle">Bono 2</td>
                    <td>
                      <InputMonto name="bono2" />
                    </td>
                  </tr>
                  <tr>
                    <td className="align-middle">Bono 3</td>
                    <td>
                      <InputMonto name="bono3" />
                    </td>
                  </tr>
                  <tr>
                    <td className="align-middle">Bono 4</td>
                    <td>
                      <InputMonto name="bono4" />
                    </td>
                  </tr>
                  <tr>
                    <td className="align-middle">Bono 5</td>
                    <td>
                      <InputMonto name="bono5" />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Modal.Body>

            <Modal.Footer>
              <div className="w-100 d-flex flex-column flex-md-row flex-md-row-reverse">
                <button type="submit" form="formularioDesgloseHaberes" className="btn btn-primary">
                  Grabar
                </button>
                <button
                  type="button"
                  className="btn btn-success mt-2 mt-md-0 me-0 me-md-2"
                  onClick={descartarCambios}>
                  Descartar
                </button>
                <button
                  type="button"
                  className="btn btn-danger mt-2 mt-md-0 me-0 me-md-2"
                  onClick={handleCerrarModal}>
                  Volver
                </button>
              </div>
            </Modal.Footer>
          </Form>
        </FormProvider>
      </Modal>
    </>
  );
};
