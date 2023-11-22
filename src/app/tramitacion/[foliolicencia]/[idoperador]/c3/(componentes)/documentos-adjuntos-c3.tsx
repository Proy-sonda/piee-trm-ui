'use client';

import {
  LicenciaTramitar,
  esLicenciaDiatDiep,
} from '@/app/tramitacion/(modelos)/licencia-tramitar';
import { ComboSimple, InputArchivo } from '@/components/form';
import IfContainer from '@/components/if-container';
import { AlertaConfirmacion, formatBytes } from '@/utilidades';
import React, { useEffect, useState } from 'react';
import { Alert, Col, Form, Row } from 'react-bootstrap';
import { FormProvider, SubmitHandler, UseFieldArrayReturn, useForm } from 'react-hook-form';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { FormularioC3 } from '../(modelos)/formulario-c3';
import { TipoDocumento, esDocumentoDiatDiep } from '../../(modelo)/tipo-documento';

interface FormularioAdjuntarDocumentoC3 {
  idTipoDocumento: number;
  documentos: FileList;
}

interface DocumentosAdjuntosC3Props {
  licencia?: LicenciaTramitar;
  tiposDocumentos?: TipoDocumento[];
  documentosAdjuntos: UseFieldArrayReturn<FormularioC3, 'documentosAdjuntos', 'id'>;
}

const DocumentosAdjuntosC3: React.FC<DocumentosAdjuntosC3Props> = ({
  licencia,
  tiposDocumentos,
  documentosAdjuntos,
}) => {
  const extensionesPermitidas = ['.xls', '.xlsx', '.doc', '.docx', '.pdf']; // Nuevas extensions deben ir en minuscula
  const maximaCantidadDeArchivos = 15;
  const tamanoMinimoDocumentoBytes = 2_000;
  const tamanoMaximoDocumentoBytes = 5_000_000;

  const formulario = useForm<FormularioAdjuntarDocumentoC3>({ mode: 'onBlur' });

  const [tiposDocumentosFiltrados, setTiposDocumentosFiltrados] = useState<TipoDocumento[]>([]);

  // Filtrar documentos
  useEffect(() => {
    if (!tiposDocumentos || !licencia) {
      setTiposDocumentosFiltrados([]);
    } else if (!esLicenciaDiatDiep(licencia)) {
      setTiposDocumentosFiltrados(tiposDocumentos.filter((t) => !esDocumentoDiatDiep(t)));
    } else {
      setTiposDocumentosFiltrados(tiposDocumentos);
    }
  }, [tiposDocumentos, licencia]);

  const adjuntarDocumento: SubmitHandler<FormularioAdjuntarDocumentoC3> = async ({
    idTipoDocumento,
    documentos,
  }) => {
    const tipoDocumento = tiposDocumentosFiltrados.find(
      (td) => td.idtipoadjunto === idTipoDocumento,
    )!;

    // LIMPIAR FORMULARIO
    // Si se mueve documentos.item(0) directamente a setDocumentosAdjuntados tira un error
    const documento = documentos.item(0)!;
    documentosAdjuntos.prepend({ tipoDocumento, documento });
    formulario.reset();
  };

  const eliminarDocumento = async (indexDocumentoEliminar: number) => {
    const item = documentosAdjuntos.fields.at(indexDocumentoEliminar);
    if (!item) {
      return;
    }

    const { isConfirmed } = await AlertaConfirmacion.fire({
      icon: 'warning',
      html: `<p>¿Está seguro que desea eliminar el archivo <b>${item.documento.name}</b>?</p>`,
    });

    if (!isConfirmed) {
      return;
    }

    documentosAdjuntos.remove(indexDocumentoEliminar);
  };

  const descargarDocumento = async (documento: File) => {
    const urlArchivo = URL.createObjectURL(documento);

    const linkDescarga = document.createElement('a');
    linkDescarga.style.display = 'none';
    linkDescarga.href = urlArchivo;
    linkDescarga.download = documento.name;
    document.body.appendChild(linkDescarga);

    linkDescarga.click();

    document.body.removeChild(linkDescarga);
    URL.revokeObjectURL(urlArchivo);
  };

  const limiteDeArchivosAlcanzado = () => {
    return documentosAdjuntos.fields.length >= maximaCantidadDeArchivos;
  };

  return (
    <>
      <Row className="mt-3">
        <h5>Documentos Adjuntos</h5>
        <p>
          Se recomienda adjuntar liquidaciones generadas por su sistema de remuneración (Excel,
          Word, PDF, etc.). El tamaño de cada archivo debe estar entre{' '}
          {formatBytes(tamanoMinimoDocumentoBytes)} y {formatBytes(tamanoMaximoDocumentoBytes)}.
        </p>

        <IfContainer show={limiteDeArchivosAlcanzado()}>
          <Alert variant="warning" className="d-flex align-items-center fade show">
            <i className="bi bi-exclamation-triangle me-2"></i>
            <span>Cantidad máxima de archivos alcanzada</span>
          </Alert>
        </IfContainer>

        <FormProvider {...formulario}>
          <Form id="adjuntarDocumentoC3" onSubmit={formulario.handleSubmit(adjuntarDocumento)}>
            <Row className="g-3 align-items-baseline">
              <ComboSimple
                deshabilitado={limiteDeArchivosAlcanzado()}
                label="Tipo de documento"
                name="idTipoDocumento"
                descripcion="tipoadjunto"
                idElemento="idtipoadjunto"
                datos={tiposDocumentosFiltrados}
                className="col-12 col-sm-5 col-md-4 col-lg-4 col-xl-3 col-xxl-2"
              />

              <InputArchivo
                name="documentos"
                label="Documento"
                deshabilitado={limiteDeArchivosAlcanzado()}
                accept={extensionesPermitidas.join(',')}
                extensionesPermitidas={extensionesPermitidas}
                tamanoMinimo={tamanoMinimoDocumentoBytes}
                tamanoMaximo={tamanoMaximoDocumentoBytes}
                className="col-12 col-sm-7 col-md-4 col-lg-5 col-xl-4 col-xxl-3"
              />

              <div
                className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-5 col-xxl-7 d-flex flex-column flex-sm-row "
                style={{ alignSelf: 'end' }}>
                <button
                  type="submit"
                  form="adjuntarDocumentoC3"
                  className="btn btn-primary"
                  disabled={limiteDeArchivosAlcanzado()}>
                  Adjuntar Documento
                </button>
              </div>
            </Row>
          </Form>
        </FormProvider>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <IfContainer show={documentosAdjuntos.fields.length === 0}>
            <h3 className="mt-3 mb-5 fs-5 text-center">No se han adjuntados documentos</h3>
          </IfContainer>

          <IfContainer show={documentosAdjuntos.fields.length > 0}>
            <div className="table-responsive">
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
                  {documentosAdjuntos.fields.map(({ tipoDocumento, documento }, index) => (
                    <Tr key={index} className="align-middle">
                      <Td>{tipoDocumento.tipoadjunto}</Td>
                      <Td>{documento.name}</Td>
                      <Td>
                        <div className="d-flex justify-content-center">
                          <button
                            type="button"
                            className="btn btn-primary"
                            title="Descargar documento"
                            onClick={() => descargarDocumento(documento)}>
                            <i className="bi bi-download"></i>
                          </button>
                          <button
                            type="button"
                            className="ms-2 btn btn-danger"
                            title="Eliminar documento"
                            onClick={() => eliminarDocumento(index)}>
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </div>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          </IfContainer>
        </Col>
      </Row>
    </>
  );
};

export default DocumentosAdjuntosC3;
