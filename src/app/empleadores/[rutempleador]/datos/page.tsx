'use client';

import {
  ComboComuna,
  ComboSimple,
  InputBlockDepartamento,
  InputCalle,
  InputEmail,
  InputNumero,
  InputRazonSocial,
  InputRut,
  InputTelefono,
} from '@/components/form';

import { AuthContext } from '@/contexts';
import { useMergeFetchArray } from '@/hooks/use-merge-fetch';
import { AlertaError, AlertaExito } from '@/utilidades/alertas';
import Link from 'next/link';
import { useContext, useEffect, useRef, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useEmpleadorActual } from '../../(contexts)/empleador-actual-context';

import { Titulo } from '@/components';
import { GuiaUsuario } from '@/components/guia-usuario';
import dynamic from 'next/dynamic';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
  buscarActividadesLaborales,
  buscarCajasDeCompensacion,
  buscarComunas,
  buscarRegiones,
  buscarSistemasDeRemuneracion,
  buscarTamanosEmpresa,
  buscarTiposCalle,
  buscarTiposDeEmpleadores,
} from '../../(servicios)';
import { CamposFormularioEmpleador } from './(modelos)';
import { actualizarEmpleador } from './(servicios)/actualizar-empleador';

const IfContainer = dynamic(() => import('@/components/if-container'));
const SpinnerPantallaCompleta = dynamic(() => import('@/components/spinner-pantalla-completa'));

interface DatosEmpleadoresPageProps {}

const DatosEmpleadoresPage: React.FC<DatosEmpleadoresPageProps> = ({}) => {
  const { cargandoEmpleador, empleadorActual, errorCargarEmpleador, refrescarEmpleador } =
    useEmpleadorActual();

  const [spinnerCargar, setSpinnerCargar] = useState(false);

  const {
    usuario,
    datosGuia: { listaguia, guia, AgregarGuia },
  } = useContext(AuthContext);

  const [
    errorCombos,
    [
      CCTIPOEMP,
      CCAF,
      CCACTLAB,
      CCREGION,
      CCCOMUNA,
      comboRemuneracion,
      comboTamanoEmpresa,
      tiposCalle,
    ],
    cargandoCombos,
  ] = useMergeFetchArray([
    buscarTiposDeEmpleadores(),
    buscarCajasDeCompensacion(),
    buscarActividadesLaborales(),
    buscarRegiones(),
    buscarComunas(),
    buscarSistemasDeRemuneracion(),
    buscarTamanosEmpresa(),
    buscarTiposCalle(),
  ]);

  const datos = useRef(null);

  const formulario = useForm<CamposFormularioEmpleador>({ mode: 'onBlur' });

  const regionSeleccionada = formulario.watch('regionId');

  const { rolEnEmpleadorActual } = useEmpleadorActual();

  // Parchar fomulario
  useEffect(() => {
    if (cargandoCombos || cargandoEmpleador || !empleadorActual || errorCombos.length > 0) {
      return;
    }

    setSpinnerCargar(true);
    formulario.setValue('rut', empleadorActual.rutempleador);
    formulario.setValue('razonSocial', empleadorActual.razonsocial);
    formulario.setValue('nombreFantasia', empleadorActual.nombrefantasia);
    formulario.setValue('tipoEntidadEmpleadoraId', empleadorActual.tipoempleador.idtipoempleador);
    formulario.setValue('cajaCompensacionId', empleadorActual.ccaf.idccaf);
    formulario.setValue('actividadLaboralId', empleadorActual.actividadlaboral.idactividadlaboral);
    formulario.setValue('regionId', empleadorActual.direccionempleador.comuna.region.idregion);
    formulario.setValue('tipoCalleId', empleadorActual.direccionempleador.tipocalle.idtipocalle);
    formulario.setValue('calle', empleadorActual.direccionempleador.calle);
    formulario.setValue('numero', empleadorActual.direccionempleador.numero);
    formulario.setValue('departamento', empleadorActual.direccionempleador.depto);

    formulario.setValue('telefono1', empleadorActual.telefonohabitual);
    formulario.setValue('telefono2', empleadorActual.telefonomovil);
    formulario.setValue('email', empleadorActual.email);
    formulario.setValue('emailConfirma', empleadorActual.email);
    formulario.setValue('holding', empleadorActual.holding);
    formulario.setValue('tamanoEmpresaId', empleadorActual.tamanoempresa.idtamanoempresa);
    formulario.setValue(
      'sistemaRemuneracionId',
      empleadorActual.sistemaremuneracion.idsistemaremuneracion,
    );

    /* NOTA: Hay que darle un timeout antes de parchar la comuna. Puede ser porque react necesita
     * un tiempo para actualizar el combo de comunas al parchar la region. */
    setTimeout(() => {
      formulario.setValue('comunaId', empleadorActual.direccionempleador.comuna.idcomuna);
      setSpinnerCargar(false);
    }, 1000);
  }, [cargandoCombos, cargandoEmpleador, empleadorActual, errorCombos, formulario]);

  const onGuardarCambios: SubmitHandler<CamposFormularioEmpleador> = async (datos) => {
    try {
      if (!empleadorActual) {
        throw new Error('No se ha cargado el empleador aun');
      }

      if (!usuario) {
        throw new Error('No existe el usuario');
      }

      setSpinnerCargar(true);

      await actualizarEmpleador({
        ...datos,
        idEmpleador: empleadorActual.idempleador,
        runUsuario: usuario.rut,
      });

      setSpinnerCargar(false);

      await AlertaExito.fire({
        html: 'Entidad empleadora fue actualizada con éxito',
      });

      refrescarEmpleador();
    } catch (error) {
      setSpinnerCargar(false);

      AlertaError.fire({
        html: 'Error al actualizar la entidad empleadora',
      });
    }
  };

  return (
    <>
      <IfContainer show={cargandoCombos || cargandoEmpleador || spinnerCargar}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <IfContainer show={errorCombos.length > 0 || errorCargarEmpleador}>
        <h4 className="text-center py-5">Error al cargar los datos de la entidad empleadora</h4>
      </IfContainer>

      <IfContainer show={errorCombos.length === 0 && !errorCargarEmpleador}>
        <Titulo url="">
          Entidad Empleadora - <b>{empleadorActual?.razonsocial ?? 'Cargando...'}</b> / Datos
          Entidad Empleadora
        </Titulo>
        <GuiaUsuario guia={listaguia[1]!?.activo && guia} target={datos} placement="top-start">
          Datos registrados de la entidad empleadora <br />
          <div className="text-end mt-2">
            <button
              className="btn btn-sm text-white"
              onClick={() =>
                AgregarGuia([
                  {
                    indice: 0,
                    nombre: 'Menu lateral',
                    activo: true,
                  },
                  {
                    indice: 1,
                    nombre: 'Datos página',
                    activo: false,
                  },
                ])
              }
              style={{
                border: '1px solid white',
              }}>
              <i className="bi bi-arrow-left"></i>
              &nbsp; Anterior
            </button>
            &nbsp;
          </div>
        </GuiaUsuario>

        <FormProvider {...formulario}>
          <form
            onSubmit={formulario.handleSubmit(onGuardarCambios)}
            ref={datos}
            className={listaguia[1]!?.activo && guia ? 'overlay-marco' : ''}>
            <div className="row mt-3 g-3 align-items-baseline">
              <InputRut
                ocultarTooltip
                deshabilitado
                name="rut"
                label="RUT Entidad Empleadora"
                className="col-12 col-md-6 col-lg-4"
              />

              <InputRazonSocial
                name="razonSocial"
                label="Razón Social / Nombre particular"
                className="col-12 col-md-6 col-lg-4"
              />

              <ComboSimple
                name="tipoEntidadEmpleadoraId"
                label="Tipo de Entidad Empleadora"
                datos={CCTIPOEMP}
                idElemento="idtipoempleador"
                descripcion="tipoempleador"
                className="col-12 col-md-6 col-lg-4"
              />

              <div className={`col-12 col-md-6 col-lg-4`}>
                <label className="form-label">CCAF a la cual está afiliada (*)</label>
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 250, hide: 400 }}
                  overlay={(props) => (
                    <Tooltip id="button-tooltip" {...props}>
                      {'Caja de Compensación de Asignación Familiar (CCAF)'}
                    </Tooltip>
                  )}>
                  <i
                    className="ms-2 text-primary bi bi-info-circle"
                    style={{ fontSize: '16px' }}></i>
                </OverlayTrigger>

                <ComboSimple
                  name="cajaCompensacionId"
                  datos={CCAF}
                  idElemento="idccaf"
                  descripcion="nombre"
                />
              </div>

              <ComboSimple
                name="actividadLaboralId"
                label="Actividad Laboral Entidad Empleadora"
                datos={CCACTLAB}
                idElemento="idactividadlaboral"
                descripcion="actividadlaboral"
                className="col-12 col-md-6 col-lg-4"
              />

              <div className={`col-12 col-md-6 col-lg-4`}>
                <label className="form-label">N° de trabajadores (*)</label>
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 250, hide: 400 }}
                  overlay={(props) => (
                    <Tooltip id="button-tooltip" {...props}>
                      {'Cantidad de personas trabajadoras en la entidad empleadora'}
                    </Tooltip>
                  )}>
                  <i
                    className="ms-2 text-primary bi bi-info-circle"
                    style={{ fontSize: '16px' }}></i>
                </OverlayTrigger>
                <ComboSimple
                  name="tamanoEmpresaId"
                  datos={comboTamanoEmpresa}
                  idElemento="idtamanoempresa"
                  descripcion="descripcion"
                />
              </div>

              <ComboSimple
                name="sistemaRemuneracionId"
                label="Sistema de Remuneración"
                datos={comboRemuneracion}
                idElemento="idsistemaremuneracion"
                descripcion="descripcion"
                className="col-12 col-md-6 col-lg-4"
              />

              <ComboSimple
                name="regionId"
                label="Región"
                datos={CCREGION}
                idElemento="idregion"
                descripcion="nombre"
                className="col-12 col-md-6 col-lg-4"
                tipoValor="string"
              />

              <ComboComuna
                name="comunaId"
                label="Comuna"
                regionSeleccionada={regionSeleccionada}
                comunas={CCCOMUNA}
                className="col-12 col-md-6 col-lg-4"
              />

              <ComboSimple
                name="tipoCalleId"
                label="Tipo de Calle"
                datos={tiposCalle}
                idElemento={'idtipocalle'}
                descripcion={'tipocalle'}
                className="col-12 col-md-6 col-lg-4"
              />

              <InputCalle name="calle" label="Calle" className="col-12 col-md-6 col-lg-4" />

              <InputNumero name="numero" label="Número" className="col-12 col-md-6 col-lg-4" />

              <InputBlockDepartamento
                opcional
                name="departamento"
                label="Block / Departamento"
                className="col-12 col-md-6 col-lg-4"
              />

              <InputTelefono
                name="telefono1"
                label="Teléfono 1"
                className="col-12 col-md-6 col-lg-4"
              />

              <InputTelefono
                opcional
                name="telefono2"
                label="Teléfono 2"
                className="col-12 col-md-6 col-lg-4"
              />

              <InputEmail
                name="email"
                label="Correo electrónico empleador"
                className="col-12 col-md-6 col-lg-4"
              />

              <InputEmail
                name="emailConfirma"
                debeCoincidirCon="email"
                label="Repetir correo electrónico"
                className="col-12 col-md-6 col-lg-4"
              />
            </div>

            <div className="row mt-5">
              <div className="d-flex flex-column flex-sm-row flex-sm-row-reverse">
                <IfContainer show={rolEnEmpleadorActual === 'administrador'}>
                  <button type="submit" className="btn btn-primary">
                    Grabar
                  </button>
                </IfContainer>

                <Link className="btn btn-danger mt-2 mt-sm-0 me-0 me-sm-2" href={'/empleadores'}>
                  Volver
                </Link>
              </div>
            </div>
          </form>
        </FormProvider>
      </IfContainer>
    </>
  );
};

export default DatosEmpleadoresPage;
