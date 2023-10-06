import React from 'react';
import { Form, FormGroup, Modal, Table } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { DesgloseDeHaberes } from '../(modelos)/desglose-de-haberes';
import { InputMonto } from './input-monto';

interface ModalDesgloseDeHaberesProps {
  show: boolean;
  periodoRenta: string;
  onCerrar: () => void;
  onDesgloseGuardardo: (desglose: DesgloseDeHaberes) => void;
}

type FormularioDesgloseHaberes = DesgloseDeHaberes;

const ModalDesgloseDeHaberes: React.FC<ModalDesgloseDeHaberesProps> = ({
  show,
  periodoRenta,
  onCerrar,
  onDesgloseGuardardo,
}) => {
  const formulario = useForm<FormularioDesgloseHaberes>({ mode: 'onBlur' });

  const guardarDesglose: SubmitHandler<FormularioDesgloseHaberes> = async (desglose) => {
    onDesgloseGuardardo(desglose);
  };

  return (
    <>
      <Modal show={show} centered backdrop="static">
        <Modal.Header closeButton onClick={onCerrar}>
          <Modal.Title className="fs-5">Desglose de Haberes Periodo {periodoRenta}</Modal.Title>
        </Modal.Header>

        <FormProvider {...formulario}>
          <Form id="formularioDesgloseHaberes" onSubmit={formulario.handleSubmit(guardarDesglose)}>
            <Modal.Body className="p-2 p-sm-3">
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
                      <InputMonto name="gratificacion" montoMinimo={0} />
                    </td>
                  </tr>
                  <tr>
                    <td className="align-middle">Horas Extras</td>
                    <td>
                      <FormGroup controlId={'horasExtras'} className="position-relative">
                        <Form.Control
                          type="number"
                          inputMode="numeric"
                          isInvalid={!!formulario.formState.errors.horasExtras}
                          {...formulario.register('horasExtras', {
                            valueAsNumber: true,
                            required: {
                              value: true,
                              message: 'Este campo es obligatorio',
                            },
                            min: {
                              value: 0,
                              message: 'No puede ser menor a 0',
                            },
                            max: {
                              value: 6, // TODO: Definir bien el máximo aca
                              message: `No puede ser mayor a 6`,
                            },
                            onChange: (event: any) => {
                              const regex = /[^0-9]/g; // solo números postivos
                              let montoImponible = event.target.value as string;

                              if (regex.test(montoImponible)) {
                                montoImponible = montoImponible.replaceAll(regex, '');
                                formulario.setValue('horasExtras', parseInt(montoImponible), {
                                  shouldValidate: true,
                                });
                              }
                            },
                          })}
                        />

                        <Form.Control.Feedback type="invalid" tooltip>
                          {formulario.formState.errors.horasExtras?.message}
                        </Form.Control.Feedback>
                      </FormGroup>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-middle">Aguinaldos</td>
                    <td>
                      <InputMonto name="aguinaldos" montoMinimo={0} />
                    </td>
                  </tr>
                  <tr>
                    <td className="align-middle">Bono 1</td>
                    <td>
                      <InputMonto name="bono1" montoMinimo={0} />
                    </td>
                  </tr>
                  <tr>
                    <td className="align-middle">Bono 2</td>
                    <td>
                      <InputMonto name="bono2" montoMinimo={0} />
                    </td>
                  </tr>
                  <tr>
                    <td className="align-middle">Bono 3</td>
                    <td>
                      <InputMonto name="bono3" montoMinimo={0} />
                    </td>
                  </tr>
                  <tr>
                    <td className="align-middle">Bono 4</td>
                    <td>
                      <InputMonto name="bono4" montoMinimo={0} />
                    </td>
                  </tr>
                  <tr>
                    <td className="align-middle">Bono 5</td>
                    <td>
                      <InputMonto name="bono5" montoMinimo={0} />
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
                  className="btn btn-danger mt-2 mt-md-0 me-0 me-md-2"
                  onClick={onCerrar}>
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

export default ModalDesgloseDeHaberes;
