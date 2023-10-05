import React from 'react';
import { Form, FormGroup, Modal, Table } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';

interface ModalDesgloseDeHaberesProps {
  show: boolean;
  onCerrar: () => void;
  onDesgloseGuardardo: () => void;
}

type FormularioDesgloseHaberes = any;

const ModalDesgloseDeHaberes: React.FC<ModalDesgloseDeHaberesProps> = ({
  show,
  onCerrar,
  onDesgloseGuardardo,
}) => {
  const formulario = useForm<FormularioDesgloseHaberes>({ mode: 'onBlur' });

  const guardarDesglose: SubmitHandler<FormularioDesgloseHaberes> = async () => {
    onDesgloseGuardardo();
  };

  return (
    <>
      <Modal show={show} centered backdrop="static">
        <Modal.Header closeButton onClick={onCerrar}>
          <Modal.Title className="fs-5">Desglose de Haberes Periodo Abril-2023</Modal.Title>
        </Modal.Header>

        <Form onSubmit={formulario.handleSubmit(guardarDesglose)}>
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
                    <FormGroup>
                      <Form.Control type="number" />
                    </FormGroup>
                  </td>
                </tr>
                <tr>
                  <td className="align-middle">Gratificación</td>
                  <td>
                    <FormGroup>
                      <Form.Control type="number" />
                    </FormGroup>
                  </td>
                </tr>
                <tr>
                  <td className="align-middle">Horas Extras</td>
                  <td>
                    <FormGroup>
                      <Form.Control type="number" />
                    </FormGroup>
                  </td>
                </tr>
                <tr>
                  <td className="align-middle">Aguinaldos</td>
                  <td>
                    <FormGroup>
                      <Form.Control type="number" />
                    </FormGroup>
                  </td>
                </tr>
                <tr>
                  <td className="align-middle">Bono 1</td>
                  <td>
                    <FormGroup>
                      <Form.Control type="number" />
                    </FormGroup>
                  </td>
                </tr>
                <tr>
                  <td className="align-middle">Bono 2</td>
                  <td>
                    <FormGroup>
                      <Form.Control type="number" />
                    </FormGroup>
                  </td>
                </tr>
                <tr>
                  <td className="align-middle">Bono 3</td>
                  <td>
                    <FormGroup>
                      <Form.Control type="number" />
                    </FormGroup>
                  </td>
                </tr>
                <tr>
                  <td className="align-middle">Bono 4</td>
                  <td>
                    <FormGroup>
                      <Form.Control type="number" />
                    </FormGroup>
                  </td>
                </tr>
                <tr>
                  <td className="align-middle">Bono 5</td>
                  <td>
                    <FormGroup>
                      <Form.Control type="number" />
                    </FormGroup>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Modal.Body>

          <Modal.Footer>
            <div className="w-100 d-flex flex-column flex-md-row flex-md-row-reverse">
              <button type="submit" className="btn btn-primary">
                Grabar
              </button>
              <button
                type="button"
                className="btn btn-danger   mt-2 mt-md-0 me-0 me-md-2"
                onClick={onCerrar}>
                Volver
              </button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ModalDesgloseDeHaberes;
