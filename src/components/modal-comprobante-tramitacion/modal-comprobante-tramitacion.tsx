import { useFetch } from '@/hooks/use-merge-fetch';
import { addDays, format, parse } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { BuscarComprobante } from './(servicios)/buscar-comprobante';
import styles from './modal-comprobante-tramitacion.module.css';
import { numeroALetras } from './numero-a-letra';

interface ModalComprobanteTramitacionProps {
  foliolicencia: string;
  idOperadorNumber: number;
  onComprobanteGenerado: () => void | Promise<void>;

  modalimprimir?: boolean;
  setmodalimprimir?: (modal: boolean) => void;
  refrescarZona4?: () => void;
  refresh?: boolean;
  setCargaPDF?: (carga: boolean) => void;
  actualizaTramitacion?: boolean;
  onBlobComprobante: (blob: Blob) => void;
}

export const ModalComprobanteTramitacion: React.FC<ModalComprobanteTramitacionProps> = ({
  foliolicencia,
  idOperadorNumber,
  onComprobanteGenerado,
  onBlobComprobante,
}) => {
  const [modalimprimir, setmodalimprimir] = useState(false);

  const [error, comprobante, pendiente] = useFetch(
    BuscarComprobante(foliolicencia, idOperadorNumber),
    [foliolicencia, idOperadorNumber],
  );

  useEffect(() => {
    if (!comprobante || !comprobante?.empleador) {
      return;
    }

    setmodalimprimir(true);
  }, [comprobante, comprobante?.empleador]);

  useEffect(() => {
    if (!modalimprimir) {
      return;
    }

    const contenido = document.getElementById('contenidoPDF');
    if (contenido === null) {
      return;
    }

    setmodalimprimir(false);
    html2canvas(contenido, { windowWidth: 860 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps: any = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      onBlobComprobante(pdf.output('blob'));
      setmodalimprimir(false);
      onComprobanteGenerado();
    });
  }, [modalimprimir]);

  const ConvertirFecha = (fecha_tramitacion: string) => {
    if (fecha_tramitacion === 'Invalid date') return format(new Date('01/01/1900'), 'dd/MM/yyyy');
    const fechaParseada = parse(fecha_tramitacion, 'yyyy-MM-dd', new Date());
    return format(fechaParseada, 'dd/MM/yyyy');
  };

  const calcularFechaFin = () => {
    if (!comprobante || !comprobante.fechainicioreposo) {
      return new Date(1900, 0, 1);
    }

    return addDays(new Date(comprobante.fechainicioreposo), comprobante.ndias);
  };

  return (
    <Modal show={modalimprimir} size="xl" fullscreen centered scrollable>
      <Modal.Header closeButton onClick={() => setmodalimprimir(!modalimprimir)}>
        <Modal.Title>PDF</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div id="contenidoPDF" className={styles.watermark}>
          <br />
          <div className={`me-5 ms-5 ${styles['label-pdf']}`}>
            <div className={`row ${styles['header-pdf']}`}>
              <div
                className="col-md-5"
                style={{
                  position: 'absolute',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}></div>
              <p>COMPROBANTE DE TRAMITACIÓN</p>
            </div>

            <div className={styles['fondo-cabecera']}>
              <div className="row text-center mt-2">
                <p>
                  La COMPIN, la Unidad de Licencias &nbsp;Médicas &nbsp;o la Isapre, en su caso,
                  podrán &nbsp;rechazar &nbsp;o aprobar &nbsp;las licencias{' '}
                </p>
                <p>
                  médicas, reducir &nbsp;o ampliar &nbsp;el período solicitado &nbsp;o cambiarlo
                  &nbsp;de total &nbsp;a parcial &nbsp;y viceversa. Art. 16 D.S. Nº 3/1984
                </p>
              </div>
              <div className={`row ${styles['row-titulo']}`}>
                <label>
                  <b>IDENTIFICACIÓN DE LA PERSONA TRABAJADORA</b>
                </label>
              </div>
              <div className="row mt-2">
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <b>RUN: </b>
                  {comprobante?.ruttrabajador}
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <b>FOLIO LICENCIA: </b>
                  {comprobante?.zc1.foliolicencia}
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <b>NOMBRE: </b>
                  {`${comprobante?.nombres} ${comprobante?.apellidopaterno} ${comprobante?.apellidomaterno}`}
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <b>ESTADO: </b> {comprobante?.estadolicencia.estadolicencia}
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <b>FECHA EMISIÓN:</b>{' '}
                  {format(new Date(comprobante?.fechaemision ?? '01/01/1990'), 'dd/MM/yyyy')}
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <b>FECHA ESTADO: </b>
                  {format(new Date(comprobante?.fechaestado ?? '01/01/1990'), 'dd/MM/yyyy')}
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <b>FECHA INICIO REPOSO:</b>{' '}
                  {format(new Date(comprobante?.fechainicioreposo ?? '01/01/1990'), 'dd/MM/yyyy')}
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <b>N° DE DÍAS:</b> {comprobante?.ndias}
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <b>FECHA TERMINO REPOSO: </b>
                  {format(calcularFechaFin(), 'dd/MM/yyyy')}
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <b>N° DE DÍAS EN PALABRAS:</b> {numeroALetras(comprobante?.ndias ?? 0)}
                </div>
              </div>

              <hr />
              <div className={`row ${styles['row-titulo']}`}>
                <label>
                  <b>IDENTIFICACIÓN DE LA ENTIDAD EMPLEADORA</b>
                </label>
              </div>
              <div className="row mt-4">
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <b>RUT: </b>
                  {comprobante?.zc1?.rutempleador.replaceAll('-', '')}
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <b>TELÉFONO: </b> {comprobante?.empleador?.telefonohabitual}
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <b>NOMBRE ENTIDAD EMPLEADORA: </b>
                  {comprobante?.empleador?.razonsocial}
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <b>FECHA TRAMITACIÓN: </b>
                  {ConvertirFecha(comprobante?.fechatramitacion ?? '1900-01-01')}
                </div>

                <div className="col-md-6 col-xs-6 col-sm-6">
                  <b>OCUPACIÓN: </b>
                  {comprobante?.zc1.ocupacion.ocupacion}
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <b>USUARIO TRAMITADOR: </b>
                  {comprobante?.ruttramitacion}
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <b>ACTIVIDAD LABORAL PERSONA TRABAJADORA: </b>
                  {comprobante?.zc1?.actividadlaboral.actividadlaboral}
                </div>

                <div className="col-md-6 col-xs-6 col-sm-6">
                  <b>DIRECCIÓN DONDE CUMPLE FUNCIONES: </b>
                  {`${comprobante?.zc1?.tipocalle.tipocalle} ${comprobante?.zc1?.direccion} ${comprobante?.zc1?.numero} ${comprobante?.zc1?.depto}, ${comprobante?.zc1?.comuna.nombre}`}
                </div>
              </div>
              <hr />
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
