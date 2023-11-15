import { buscarEmpleadorRut } from '@/app/empleadores/[rutempleador]/unidad/[idunidad]/usuarios/(servicios)/buscar-empleador-rut';
import {
  LicenciaTramitar,
  esLicenciaMaternidad,
} from '@/app/tramitacion/(modelos)/licencia-tramitar';
import { buscarLicenciasParaTramitar } from '@/app/tramitacion/(servicios)/buscar-licencias-para-tramitar';
import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { emptyFetch, useFetch, useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { addDays, format } from 'date-fns';
import es from 'date-fns/locale/es';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FormEvent, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { buscarZona4 } from '../(servicios)/buscar-z4';
import { LicenciaC1 } from '../../c1/(modelos)';
import { buscarZona0, buscarZona1 } from '../../c1/(servicios)';
import {
  crearIdEntidadPrevisional,
  glosaCompletaEntidadPrevisional,
} from '../../c2/(modelos)/entidad-previsional';
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
}

const ModalImprimirPdf: React.FC<IModalImprimirPdfProps> = ({
  foliolicencia,
  idOperadorNumber,
  modalimprimir,
  setmodalimprimir,
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

  console.log(zonas);

  const [, entidadesPrevisionales] = useFetch(
    zonas?.zona2
      ? buscarEntidadPrevisional(zonas.zona2.entidadprevisional.codigoregimenprevisional)
      : emptyFetch(),
    [zonas?.zona2],
  );
  const obtenerEntidadPrevisional = (idEntidad: string) => {
    const entidad = (entidadesPrevisionales ?? []).find(
      (e) => crearIdEntidadPrevisional(e) === idEntidad,
    );

    return !entidad ? '' : glosaCompletaEntidadPrevisional(entidad);
  };
  const [, licenciasTramitar, cargando] = useFetch(buscarLicenciasParaTramitar());

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
    if (zona1 === undefined) return;
    const buscarEmpleador = async () => {
      const [resp, abort] = await buscarEmpleadorRut(zona1?.rutempleador);
      setrazonSocial((await resp()).razonsocial);
    };
    buscarEmpleador();
  }, [zona1]);

  const calcularFechaFin = () => {
    if (licencia?.fechainicioreposo === undefined) return new Date('01/01/1900');
    return addDays(new Date(licencia!?.fechainicioreposo), licencia!?.diasreposo) ?? '01/01/1900';
  };

  const handleClickImprimir = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setcargandoPDF(true);
    const contenido = document.getElementById('contenidoPDF');
    if (contenido === null) return;

    html2canvas(contenido).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps: any = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      setcargandoPDF(false);
      window.open(pdf.output('bloburl'), '_blank');
      setmodalimprimir(false);
    });
  };

  const consultaMaterna = (licencia: LicenciaTramitar | undefined) => {
    if (licencia == undefined) return false;
    return esLicenciaMaternidad(licencia);
  };

  return (
    <Modal show={modalimprimir} size="xl" fullscreen centered>
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

        <div className="row mb-2">
          <div className="d-grid gap-2 col-3 mx-auto">
            <button className="btn btn-primary" onClick={handleClickImprimir}>
              <i className="bi bi-printer"></i> &nbsp; IMPRIMIR PDF
            </button>
          </div>
        </div>

        <div id="contenidoPDF">
          <div className={`me-5 ms-5 ${styles['label-pdf']}`}>
            <div className={`row ${styles['header-pdf']}`}>
              <p>Licencia Tramitada - {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale })}</p>
            </div>
            <div className={styles['fondo-cabecera']}>
              <div className="row mt-2">
                <div className="col-md-6">
                  <label>
                    <b>RUT Entidad Empleadora: </b>
                    {zona1?.rutempleador}
                  </label>
                </div>
                <div className="col-md-6">
                  <label>
                    <b>Calidad de la Persona Trabajadora: </b>
                    {zonas?.zona2.calidadtrabajador.calidadtrabajador}
                  </label>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label>
                    <b>RUN: </b>
                    {zonas?.zona0.ruttrabajador}
                  </label>
                </div>
                <div className="col-md-6">
                  <b>Folio LME: </b>
                  {zona1?.foliolicencia}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label>
                    <b>Nombre: </b>
                    {zonas?.zona0.nombres +
                      ' ' +
                      zonas?.zona0.apellidopaterno +
                      ' ' +
                      zonas?.zona0.apellidomaterno}
                  </label>
                </div>
                <div className="col-md-6">
                  <label>
                    <b>Fecha Primera Afiliación: </b>{' '}
                    {format(new Date(zonas?.zona2.fechaafiliacion ?? '01/10/2022'), 'dd/MM/yyyy')}
                  </label>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label>
                    <b>Razón social Entidad Empleadora:</b> {razonSocial}
                  </label>
                </div>
                <div className="col-md-6">
                  <label>
                    <b>Institución Provisional:</b> {zonas?.zona2.entidadprevisional.glosa}
                  </label>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label>
                    <b>Dirección donde cumple funciones: </b>
                    {`${zona1?.tipocalle.tipocalle} ${zona1?.direccion} ${zona1?.numero} ${zona1?.depto}, ${zona1?.comuna.nombre}`}
                  </label>
                </div>
                <div className="col-md-6">
                  <label>
                    <b>Afiliado AFC: </b>
                    {zonas?.zona2.codigoseguroafc == 1 ? 'SÍ' : 'NO'}
                  </label>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label>
                    <b>Actividad Laboral: </b>
                    {zona1?.actividadlaboral.actividadlaboral}
                  </label>
                </div>
                <div className="col-md-6">
                  <label>
                    <b>Contrato Indefinido: </b>
                    {zonas?.zona2.codigocontratoindef == 1 ? 'SÍ' : 'NO'}
                  </label>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label>
                    <b>Ocupación: </b>
                    {zona1?.ocupacion.ocupacion}
                  </label>
                </div>
                <div className="col-md-6">
                  <label>
                    <b>Fecha Contrato: </b>
                    {format(new Date(zonas?.zona2.fechacontrato ?? '01/10/2023'), 'dd/MM/yyyy')}
                  </label>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label>
                    <b>Nombre Entidad Pagadora Subsidio: </b>
                    {zonas?.zona2.entidadpagadora.entidadpagadora}
                  </label>
                </div>
                <div className="col-md-6">
                  <label>
                    <b>{licencia?.tiporesposo.tiporeposo}</b> por <b>{licencia?.diasreposo}</b>{' '}
                    día/s desde el{' '}
                    <b>
                      {format(new Date(licencia?.fechainicioreposo ?? '01/10/2023'), 'dd/MM/yyyy')}
                    </b>{' '}
                    al <b>{format(calcularFechaFin(), 'dd/MM/yyyy')}</b>
                  </label>
                </div>
              </div>
            </div>
            <div className={`row ${styles['header-pdf']}`}>
              <label
                style={{
                  fontSize: '24px',
                }}>
                Rentas de meses anteriores a la incapacidad
              </label>
            </div>
            <div className={`${styles['fondo-cabecera']}`}>
              <div className={`row`}>
                <table className="table table-stripped text-center">
                  <thead>
                    <tr>
                      <th>Institución Previsional</th>
                      <th>Fecha</th>
                      <th>Total Remuneraciones</th>
                      <th>N° Días Subsidio Incapacidad Laboral</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zonas?.zona3?.rentas.map((renta) => (
                      <tr key={Math.random()}>
                        <td>{obtenerEntidadPrevisional(renta.idPrevision)}</td>
                        <td>{format(new Date(renta.periodo), "MMMM 'de' yyyy", { locale })}</td>
                        <td>${renta.montoImponible.toLocaleString()}</td>
                        <td>{renta.dias}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <IfContainer show={consultaMaterna(licencia)}>
              <div className={`row ${styles['header-pdf']}`}>
                <label
                  style={{
                    fontSize: '24px',
                  }}>
                  Rentas de maternidad
                </label>
              </div>
              <div className={`${styles['fondo-cabecera']}`}>
                <div className={`row`}>
                  <table className="table table-striped text-center">
                    <thead>
                      <tr>
                        <th>Institución Previsional</th>
                        <th>Fecha</th>
                        <th>Total Remuneraciones</th>
                        <th>N° Días Subsidio Incapacidad Laboral</th>
                      </tr>
                    </thead>
                    <tbody>
                      {zonas?.zona3?.rentasMaternidad.map((renta) => (
                        <tr key={Math.random()}>
                          <td>{obtenerEntidadPrevisional(renta.idPrevision)}</td>
                          <td>{format(new Date(renta.periodo), 'MMMM yyyy', { locale })}</td>
                          <td>${renta.montoImponible.toLocaleString()}</td>
                          <td>{renta.dias}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </IfContainer>
            <div className={`row ${styles['header-pdf']}`}>
              <label
                style={{
                  fontSize: '24px',
                }}>
                Documentos adjuntos
              </label>
            </div>
            <div className={`${styles['fondo-cabecera']}`}>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="text-center">TIPO DOCUMENTO</th>
                    <th className="text-center">NOMBRE DOCUMENTO</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  <tr>
                    <td>Comprobante Liquidacion Mensual</td>
                    <td>liquidacion_202301.pdf</td>
                  </tr>
                  <tr>
                    <td>Contrato de Trabajo Vigente a la fecha</td>
                    <td>ContratoTrabajo.pdf</td>
                  </tr>
                  <tr>
                    <td>Certificado de Pago Cotizaciones</td>
                    <td> </td>
                  </tr>
                  <tr>
                    <td>Comprobante Pago Cotizaciones operación Renta</td>
                    <td> </td>
                  </tr>
                  <tr>
                    <td>Certificado de Afiliación</td>
                    <td> </td>
                  </tr>
                  <tr>
                    <td>Denuncia Individual de Accidente del Trabajo (DIAT)</td>
                    <td> </td>
                  </tr>
                  <tr>
                    <td>Denuncia Individual de Enfermedad Profesional (DIEP)</td>
                    <td> </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={`row ${styles['header-pdf']}`}>
              <label
                style={{
                  fontSize: '24px',
                }}>
                Licencias Anteriores en los Últimos 6 meses
              </label>
            </div>
            <div className={`${styles['fondo-cabecera']}`}>
              <IfContainer show={zonas!?.zona4?.length === 0}>
                <p
                  style={{
                    fontSize: '18px',
                  }}
                  className="text-center">
                  <b>No se informaron licencias de los últimos 6 meses</b>
                </p>
              </IfContainer>
              <IfContainer show={zonas!?.zona4!?.length > 0}>
                <table className="table table-bordered">
                  <thead className="text-center">
                    <tr>
                      <th>Total días</th>
                      <th>Desde</th>
                      <th>Hasta</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {zonas &&
                      zonas!?.zona4!?.map(({ lmandias, lmafechadesde, lmafechahasta }, index) => (
                        <tr key={index}>
                          <td>{lmandias}</td>
                          <td>{format(new Date(lmafechadesde), 'dd/MM/yyyy')}</td>
                          <td>{format(new Date(lmafechahasta), 'dd/MM/yyyy')}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </IfContainer>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalImprimirPdf;
