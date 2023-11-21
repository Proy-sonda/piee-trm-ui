import { buscarEmpleadorRut } from '@/app/empleadores/(servicios)/buscar-empleador-rut';
import { LicenciaTramitar } from '@/app/tramitacion/(modelos)/licencia-tramitar';
import { buscarLicenciasParaTramitar } from '@/app/tramitacion/(servicios)/buscar-licencias-para-tramitar';
import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { emptyFetch, useFetch, useMergeFetchObject } from '@/hooks/use-merge-fetch';
import imgfonasa from '@/img/logo-fonasa.png';
import { addDays, format } from 'date-fns';
import es from 'date-fns/locale/es';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { buscarZona4 } from '../(servicios)/buscar-z4';
import { numeroALetras } from '../(util)/numero-a-letra';
import { LicenciaC1 } from '../../c1/(modelos)';
import { buscarZona0, buscarZona1 } from '../../c1/(servicios)';
import { buscarEntidadPrevisional } from '../../c2/(servicios)/buscar-entidad-previsional';
import { buscarZona2 } from '../../c2/(servicios)/buscar-z2';
import { buscarZona3 } from '../../c3/(servicios)/buscar-z3';
import styles from './modal-imprimir-pdf.module.css';

const locale = es;
interface IModalImprimirPdfProps {
  foliolicencia: string;
  idOperadorNumber: number;
  modalimprimir: boolean;
  setmodalimprimir: (modal: boolean) => void;
  refrescarZona4: () => void;
  refresh: boolean;
  setCargaPDF: (carga: boolean) => void;
}

const ModalImprimirPdf: React.FC<IModalImprimirPdfProps> = ({
  foliolicencia,
  idOperadorNumber,
  modalimprimir,
  setmodalimprimir,
  setCargaPDF,
  refrescarZona4,
  refresh,
}) => {
  const [zona1, setzona1] = useState<LicenciaC1 | undefined>();
  const [razonSocial, setrazonSocial] = useState<string>('');
  const [cargandoPDF, setcargandoPDF] = useState(false);

  const [errorCargaZona, zonas, cargandoZonas] = useMergeFetchObject(
    {
      zona0: buscarZona0(foliolicencia, idOperadorNumber),
      zona2: buscarZona2(foliolicencia, idOperadorNumber),
      zona3: buscarZona3(foliolicencia, idOperadorNumber),
      zona4: buscarZona4(foliolicencia, idOperadorNumber),
    },
    [refresh],
  );

  const [, entidadesPrevisionales] = useFetch(
    zonas?.zona2
      ? buscarEntidadPrevisional(zonas.zona2.entidadprevisional.codigoregimenprevisional)
      : emptyFetch(),
    [zonas?.zona2],
  );

  const [, licenciasTramitar, cargando] = useFetch(buscarLicenciasParaTramitar());

  const [telefono, settelefono] = useState('');

  const [licencia, setLicencia] = useState<LicenciaTramitar | undefined>();

  useEffect(() => {
    const x = (licenciasTramitar ?? []).find((lic) => lic.foliolicencia === foliolicencia);
    setLicencia(x);
  }, [licenciasTramitar]);
  useEffect(() => {
    const BusquedaZona1 = async () => {
      const data = await buscarZona1(foliolicencia, idOperadorNumber);
      if (data !== undefined) setzona1(data);
    };
    BusquedaZona1();
    refrescarZona4();
  }, []);

  useEffect(() => {
    if (modalimprimir === false) return;
    if (zonas === undefined) return;
    const contenido = document.getElementById('contenidoPDF');
    if (contenido === null) return;
    setcargandoPDF(true);
    setCargaPDF(true);
    setmodalimprimir(false);

    html2canvas(contenido, { windowWidth: 860 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps: any = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      setcargandoPDF(false);
      window.open(pdf.output('bloburl'), '_blank');
      setCargaPDF(false);
      setmodalimprimir(false);
    });
  }, [modalimprimir]);

  useEffect(() => {
    if (zona1 === undefined) return;
    const buscarEmpleador = async () => {
      const [resp, abort] = await buscarEmpleadorRut(zona1?.rutempleador);
      setrazonSocial((await resp()).razonsocial);
      settelefono((await resp()).telefonohabitual);
    };
    buscarEmpleador();
  }, [zona1]);

  const calcularFechaFin = () => {
    if (licencia?.fechainicioreposo === undefined) return new Date('01/01/1900');
    return addDays(new Date(licencia!?.fechainicioreposo), licencia!?.diasreposo) ?? '01/01/1900';
  };

  return (
    <Modal show={modalimprimir} size="xl" fullscreen centered scrollable>
      <Modal.Header closeButton onClick={() => setmodalimprimir(!modalimprimir)}>
        <Modal.Title>PDF</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <IfContainer show={cargandoPDF}>
          <SpinnerPantallaCompleta />
        </IfContainer>
        <IfContainer show={cargandoZonas || cargando}>
          <LoadingSpinner titulo="Cargando información..." />
        </IfContainer>

        <div id="contenidoPDF" className={styles.watermark}>
          <div className={`me-5 ms-5 ${styles['label-pdf']}`}>
            <div className={`row ${styles['header-pdf']}`}>
              <div
                className="col-md-5"
                style={{
                  position: 'absolute',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <Image src={imgfonasa.src} alt="Fonasa header" width={80} height={40} />
              </div>
              <p>Comprobante de Tramitación</p>
            </div>

            <div className={styles['fondo-cabecera']}>
              <div className="row text-center">
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
              <div className="row mt-4">
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <label>
                    <b>RUN: </b>
                    {zonas?.zona0.ruttrabajador}
                  </label>
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <b>FOLIO LICENCIA: </b>
                  {zona1?.foliolicencia}
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <label>
                    <b>NOMBRE: </b>
                    {zonas?.zona0.nombres +
                      ' ' +
                      zonas?.zona0.apellidopaterno +
                      ' ' +
                      zonas?.zona0.apellidomaterno}
                  </label>
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <label>
                    <b>ESTADO: </b> {zonas?.zona0.estadolicencia.estadolicencia} -{' '}
                    <b>FECHA ESTADO: </b>
                    {format(new Date(zonas?.zona0.fechaestado ?? '01/01/1990'), 'dd/MM/yyyy')}
                  </label>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <label>
                    <b>FECHA EMISIÓN:</b>{' '}
                    {format(new Date(zonas?.zona0.fechaemision ?? '01/01/1990'), 'dd/MM/yyyy')}
                  </label>
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <label>
                    <b>N° DE DÍAS:</b> {zonas?.zona0.ndias}
                  </label>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <label>
                    <b>FECHA INICIO REPOSO:</b>{' '}
                    {format(new Date(zonas?.zona0.fechainicioreposo ?? '01/01/1990'), 'dd/MM/yyyy')}
                  </label>
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <label>
                    <b>N° DE DÍAS EN PALABRAS:</b> {numeroALetras(zonas?.zona0.ndias ?? 0)}
                  </label>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <label>
                    <b>FECHA TERMINO REPOSO: </b>
                    {format(calcularFechaFin(), 'dd/MM/yyyy')}
                  </label>
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
                  <label>
                    <b>RUT: </b>
                    {zona1?.rutempleador.replaceAll('-', '')}
                  </label>
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <label>
                    <b>TELÉFONO: </b> {telefono}
                  </label>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <label>
                    <b>NOMBRE ENTIDAD EMPLEADORA: </b>
                    {razonSocial}
                  </label>
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <label>
                    <b>FECHA: </b>
                    {format(new Date(), 'dd/MM/yyyy')}
                  </label>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <label>
                    <b>ACTIVIDAD LABORAL PERSONA TRABAJADORA: </b>
                    {zona1?.actividadlaboral.actividadlaboral}
                  </label>
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6">
                  <label>
                    <b>OCUPACIÓN: </b>
                    {zona1?.ocupacion.ocupacion}
                  </label>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-8 col-xs-8 col-sm-8">
                  <label>
                    <b>DIRECCIÓN DONDE CUMPLE FUNCIONES: </b>
                    {`${zona1?.tipocalle.tipocalle} ${zona1?.direccion} ${zona1?.numero} ${zona1?.depto}, ${zona1?.comuna.nombre}`}
                  </label>
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

export default ModalImprimirPdf;
