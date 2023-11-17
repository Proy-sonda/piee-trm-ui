import { ComboSimple, InputArchivo } from '@/components/form';
import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { TipoDocumento } from '../../(modelo)/documento';

interface FormularioAdjuntarDocumentoC3 {
  tipoDocumento: number;
  documentosAdjuntos: FileList;
}

interface DocumentosAdjuntosC3Props {
  tiposDocumentos?: TipoDocumento[];
}

const DocumentosAdjuntosC3: React.FC<DocumentosAdjuntosC3Props> = ({
  tiposDocumentos: tiposDocumentos,
}) => {
  const formulario = useForm<FormularioAdjuntarDocumentoC3>({ mode: 'onBlur' });

  const tamanoMaximoDocumentoBytes = 5_000_000;

  const adjuntarDocumento: SubmitHandler<FormularioAdjuntarDocumentoC3> = async (datos) => {
    console.log('Adjuntando documento...');
    console.table(datos);
  };

  return (
    <>
      <Row className="mt-3">
        <h5>Documentos Adjuntos</h5>
        <p>
          Se recomienda adjuntar liquidaciones generadas por su sistema de remuneración (Excel,
          Word, PDF, etc.). El tamaño máximo permitido por archivo es de{' '}
          {tamanoMaximoDocumentoBytes / 1_000_000} MB.
        </p>

        <FormProvider {...formulario}>
          <Form id="adjuntarDocumentoC3" onSubmit={formulario.handleSubmit(adjuntarDocumento)}>
            <Row className="g-3 align-items-baseline">
              <ComboSimple
                label="Tipo de documento"
                name="tipoDocumento"
                descripcion="tipoadjunto"
                idElemento="idtipoadjunto"
                datos={tiposDocumentos}
                className="col-12 col-sm-5 col-md-4 col-lg-4 col-xl-3 col-xxl-2"
              />

              <InputArchivo
                name="documentosAdjuntos"
                label="Documento"
                tamanoMaximo={tamanoMaximoDocumentoBytes}
                className="col-12 col-sm-7 col-md-4 col-lg-5 col-xl-4 col-xxl-3"
              />

              <div
                className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-5 col-xxl-7 d-flex flex-column flex-sm-row "
                style={{ alignSelf: 'end' }}>
                <button type="submit" form="adjuntarDocumentoC3" className="btn btn-primary ">
                  Adjuntar Documento
                </button>
              </div>
            </Row>
          </Form>
        </FormProvider>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <Table className="table table-bordered">
            <Thead>
              <Tr className="align-middle">
                <Th>Tipo Documento</Th>
                <Th>Nombre Documento</Th>
                <Th>
                  <div className="text-center">Acciones</div>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr className="align-middle">
                <Td>Comprobante Liquidacion Mensual</Td>
                <Td>a</Td>
                <Td>
                  <div className="d-flex justify-content-center">
                    <button type="button" className="btn btn-primary">
                      <i className="bi bi-download"></i>
                    </button>
                    <button type="button" className="ms-2 btn btn-danger">
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
};

export default DocumentosAdjuntosC3;
