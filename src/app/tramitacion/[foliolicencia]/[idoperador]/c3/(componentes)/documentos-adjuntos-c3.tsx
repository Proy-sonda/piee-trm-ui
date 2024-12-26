'use client';

import {
  LicenciaTramitar,
  esLicenciaDiatDiep,
} from '@/app/tramitacion/(modelos)/licencia-tramitar';
import { ComboSimple, InputArchivo } from '@/components/form';
import { GuiaUsuario } from '@/components/guia-usuario';
import IfContainer from '@/components/if-container';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { AuthContext } from '@/contexts';
import { useFetch } from '@/hooks';
import { ENUM_CONFIGURACION } from '@/modelos/enum/configuracion';
import { BuscarConfiguracion } from '@/servicios/buscar-configuracion';
import { AlertaConfirmacion, AlertaError, AlertaExito, formatBytes } from '@/utilidades';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Col, Form, Row } from 'react-bootstrap';
import {
  FieldError,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  UseFieldArrayReturn,
  useForm,
} from 'react-hook-form';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { esDocumentoNuevoZ3, nombreDocumentoAdjunto } from '../(modelos)/documento-adjunto-z3';
import { FormularioC3 } from '../(modelos)/formulario-c3';
import { descargarDocumentoZ3 } from '../(servicios)/descargar-documento-z3';
import { eliminarDocumentoZ3 } from '../(servicios)/eliminar-documento-z3';
import { TipoDocumento, esDocumentoDiatDiep } from '../../(modelo)/tipo-documento';

interface FormularioAdjuntarDocumentoC3 {
  idTipoDocumento: number;
  documentos: FileList;
}

interface DocumentosAdjuntosC3Props {
  licencia?: LicenciaTramitar;
  tiposDocumentos?: TipoDocumento[];
  documentosAdjuntos: UseFieldArrayReturn<FormularioC3, 'documentosAdjuntos', 'id'>;
  errorDocumentosAdjuntos?: FieldError;
  onDocumentoEliminado: () => void | Promise<void>;
}

export const DocumentosAdjuntosC3: React.FC<DocumentosAdjuntosC3Props> = ({
  licencia,
  tiposDocumentos,
  documentosAdjuntos,
  errorDocumentosAdjuntos,
  onDocumentoEliminado,
}) => {
  const [, configuracion] = useFetch(BuscarConfiguracion());
  const extensionesPermitidas = ['.xls', '.xlsx', '.doc', '.docx', '.pdf']; // Nuevas extensions deben ir en minuscula
  const maximaCantidadDeArchivos = 15;
  const tamanoMinimoDocumentoBytes = 2_000;
  const [tamanoMaximoDocumentoBytes, settamanoMaximoDocumentoBytes] = useState(5_000_000);

  useEffect(() => {
    if (configuracion) {
      // validamos la fecha de la configuración si se encuentra vigente
      const fechaHoy = new Date();
      const fechaInicio = new Date(
        configuracion.find((c) => c.codigoparametro === ENUM_CONFIGURACION.PESO_ARCHIVO)
          ?.fechavigencia || '',
      );
      if (fechaHoy < fechaInicio)
        return settamanoMaximoDocumentoBytes(
          Number(
            configuracion.find((c) => c.codigoparametro === ENUM_CONFIGURACION.PESO_ARCHIVO)?.valor,
          ) * 1000000 || 5_000_000,
        );
    }
  }, [configuracion]);

  const MENSAJE_DOCUMENTO_OBLIGATORIO = 'Este campo es obligatorio';

  const formulario = useForm<FormularioAdjuntarDocumentoC3>({ mode: 'onBlur' });

  const [tiposDocumentosFiltrados, setTiposDocumentosFiltrados] = useState<TipoDocumento[]>([]);

  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const tipoDoc = useRef(null);
  const btnAdjuntarDoc = useRef(null);
  const {
    datosGuia: { guia, listaguia, AgregarGuia },
  } = useContext(AuthContext);

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
    const documento = documentos.item(0);
    if (!documento) {
      formulario.setError('documentos', { message: MENSAJE_DOCUMENTO_OBLIGATORIO });
      return;
    }

    if (documentosAdjuntos.fields.some((d) => nombreDocumentoAdjunto(d) === documento.name)) {
      return AlertaError.fire({
        title: 'Error',
        html: '<p>Ya existe un documento con el mismo nombre.</p>',
      });
    }

    documentosAdjuntos.prepend({ idtipoadjunto: idTipoDocumento, documento });
    formulario.reset();
  };

  const formularioInvalido: SubmitErrorHandler<FormularioAdjuntarDocumentoC3> = async () => {
    const documentos = formulario.getValues('documentos');
    if (!documentos.item(0)) {
      formulario.setError('documentos', { message: MENSAJE_DOCUMENTO_OBLIGATORIO });
    }
  };

  const eliminarDocumento = async (index: number) => {
    const item = documentosAdjuntos.fields.at(index);
    if (!item) {
      return;
    }

    const { isConfirmed } = await AlertaConfirmacion.fire({
      icon: 'warning',
      html: `<p>¿Está seguro que desea eliminar el archivo <b>${nombreDocumentoAdjunto(
        item,
      )}</b>?</p>`,
    });

    if (!isConfirmed) {
      return;
    }

    if (esDocumentoNuevoZ3(item)) {
      documentosAdjuntos.remove(index);

      AlertaExito.fire({
        html: `Documento <b>${nombreDocumentoAdjunto(item)}</b> fue eliminado con éxito.`,
      });
    } else {
      const { idadjunto } = item;

      try {
        setMostrarSpinner(true);

        await eliminarDocumentoZ3(idadjunto);

        documentosAdjuntos.remove(index);

        onDocumentoEliminado();

        AlertaExito.fire({
          html: `Documento <b>${nombreDocumentoAdjunto(item)}</b> fue eliminado con éxito.`,
        });
      } catch (error) {
        AlertaError.fire({
          title: 'Error',
          html: `<p>No se pudo eliminar el documento adjunto <b>${nombreDocumentoAdjunto(
            item,
          )}</b>. Por favor intente más tarde.</p>`,
        });
      } finally {
        setMostrarSpinner(false);
      }
    }
  };

  const descargarDocumento = async (index: number) => {
    const item = documentosAdjuntos.fields.at(index);
    if (!item) {
      return;
    }

    if (esDocumentoNuevoZ3(item)) {
      const { documento } = item;
      const urlArchivo = URL.createObjectURL(documento);
      const linkDescarga = document.createElement('a');
      linkDescarga.style.display = 'none';
      linkDescarga.href = urlArchivo;
      linkDescarga.download = documento.name;
      document.body.appendChild(linkDescarga);

      linkDescarga.click();

      document.body.removeChild(linkDescarga);
      URL.revokeObjectURL(urlArchivo);
    } else {
      const { idadjunto } = item;

      try {
        setMostrarSpinner(true);

        const { url } = await descargarDocumentoZ3(idadjunto);

        window.open(url, '_blank');
      } catch (error) {
        AlertaError.fire({
          title: 'Error',
          html: `<p>Falló la descarga del documento adjunto <b>${nombreDocumentoAdjunto(
            item,
          )}</b>. Por favor intente más tarde.</p>`,
        });
      } finally {
        setMostrarSpinner(false);
      }
    }
  };

  const limiteDeArchivosAlcanzado = () => {
    return documentosAdjuntos.fields.length >= maximaCantidadDeArchivos;
  };

  const nombreTipoDocumento = (idTipoDocumento: number) => {
    const tipoDocumento = tiposDocumentosFiltrados.find(
      (td) => td.idtipoadjunto === idTipoDocumento,
    );

    return tipoDocumento?.tipoadjunto ?? '-';
  };

  return (
    <>
      <IfContainer show={mostrarSpinner}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <Row className="mt-3">
        <h5>Documentos Adjuntos</h5>
        <p>
          Se recomienda adjuntar liquidaciones generadas por su sistema de remuneración (Excel,
          Word, PDF). El tamaño de cada archivo debe estar entre{' '}
          {formatBytes(tamanoMinimoDocumentoBytes)} y {formatBytes(tamanoMaximoDocumentoBytes)}.
        </p>

        <IfContainer show={errorDocumentosAdjuntos}>
          <Col>
            <Alert variant="danger" className="d-flex align-items-center fade show">
              <i className="bi bi-exclamation-triangle me-2"></i>
              <span>{errorDocumentosAdjuntos?.message}</span>
            </Alert>
          </Col>
        </IfContainer>

        <IfContainer show={limiteDeArchivosAlcanzado()}>
          <Col>
            <Alert variant="warning" className="d-flex align-items-center fade show">
              <i className="bi bi-exclamation-triangle me-2"></i>
              <span>Cantidad máxima de archivos alcanzada</span>
            </Alert>
          </Col>
        </IfContainer>

        <FormProvider {...formulario}>
          <Form
            id="adjuntarDocumentoC3"
            onSubmit={formulario.handleSubmit(adjuntarDocumento, formularioInvalido)}>
            <Row className="g-3 align-items-baseline">
              <GuiaUsuario guia={listaguia[4]!?.activo && guia} target={tipoDoc}>
                Seleccione el tipo de documento a adjuntar
                <br />
                <div className="text-end mt-3">
                  <button
                    className="btn btn-sm text-white"
                    onClick={() => {
                      AgregarGuia([
                        {
                          indice: 0,
                          nombre: 'stepper',
                          activo: false,
                        },
                        {
                          indice: 1,
                          nombre: 'nro dias',
                          activo: false,
                        },
                        {
                          indice: 2,
                          nombre: 'total remuneracion',
                          activo: false,
                        },

                        {
                          indice: 3,
                          nombre: 'btn desgloce',
                          activo: true,
                        },

                        {
                          indice: 4,
                          nombre: 'tipo doc',
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
                          nombre: 'stepper',
                          activo: false,
                        },
                        {
                          indice: 1,
                          nombre: 'nro dias',
                          activo: false,
                        },
                        {
                          indice: 2,
                          nombre: 'total remuneracion',
                          activo: false,
                        },

                        {
                          indice: 3,
                          nombre: 'btn desgloce',
                          activo: false,
                        },

                        {
                          indice: 4,
                          nombre: 'tipo doc',
                          activo: false,
                        },
                        {
                          indice: 5,
                          nombre: 'adjuntar doc btn',
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
              <div
                className={`col-12 col-sm-5 col-md-4 col-lg-4 col-xl-3 col-xxl-2 ${
                  listaguia[4]!?.activo && guia && 'overlay-marco'
                }`}
                ref={tipoDoc}>
                <ComboSimple
                  deshabilitado={limiteDeArchivosAlcanzado()}
                  label="Tipo de documento"
                  name="idTipoDocumento"
                  descripcion="tipoadjunto"
                  idElemento="idtipoadjunto"
                  // datos={tiposDocumentosFiltrados}
                  datos={tiposDocumentos}
                />
              </div>

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
                className={`col-12 col-sm-12 col-md-4 col-lg-3 col-xl-5 col-xxl-7 d-flex flex-column flex-sm-row`}
                style={{ alignSelf: 'end' }}>
                <GuiaUsuario guia={listaguia[5]!?.activo && guia} target={btnAdjuntarDoc}>
                  Botón para adjuntar el documento <br />
                  seleccionado
                  <br />
                  <div className="text-end mt-3">
                    <button
                      className="btn btn-sm text-white"
                      onClick={() => {
                        AgregarGuia([
                          {
                            indice: 0,
                            nombre: 'stepper',
                            activo: false,
                          },
                          {
                            indice: 1,
                            nombre: 'nro dias',
                            activo: false,
                          },
                          {
                            indice: 2,
                            nombre: 'total remuneracion',
                            activo: false,
                          },

                          {
                            indice: 3,
                            nombre: 'btn desgloce',
                            activo: false,
                          },

                          {
                            indice: 4,
                            nombre: 'tipo doc',
                            activo: true,
                          },
                          {
                            indice: 5,
                            nombre: 'adjuntar doc btn',
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
                            nombre: 'stepper',
                            activo: true,
                          },
                          {
                            indice: 1,
                            nombre: 'nro dias',
                            activo: false,
                          },
                          {
                            indice: 2,
                            nombre: 'total remuneracion',
                            activo: false,
                          },

                          {
                            indice: 3,
                            nombre: 'btn desgloce',
                            activo: false,
                          },

                          {
                            indice: 4,
                            nombre: 'tipo doc',
                            activo: false,
                          },
                          {
                            indice: 5,
                            nombre: 'adjuntar doc btn',
                            activo: false,
                          },
                        ]);
                        // subir el focus al inicio de la pagina
                        window.scrollTo(0, 0);
                      }}
                      style={{
                        border: '1px solid white',
                      }}>
                      Continuar &nbsp;
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </GuiaUsuario>
                <div
                  className={`${listaguia[5]!?.activo && guia && 'overlay-marco'}`}
                  ref={btnAdjuntarDoc}>
                  <button
                    type="submit"
                    form="adjuntarDocumentoC3"
                    className="btn btn-primary"
                    disabled={limiteDeArchivosAlcanzado()}>
                    Adjuntar Documento
                  </button>
                </div>
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
                  {documentosAdjuntos.fields.map((field, index) => (
                    <Tr key={field.id} className="align-middle">
                      <Td>{nombreTipoDocumento(field.idtipoadjunto)}</Td>
                      <Td>{nombreDocumentoAdjunto(field)}</Td>
                      <Td>
                        <div className="d-flex justify-content-center">
                          <button
                            type="button"
                            className="btn btn-primary"
                            title="Descargar documento"
                            onClick={() => descargarDocumento(index)}>
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
