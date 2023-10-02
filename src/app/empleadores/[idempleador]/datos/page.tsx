'use client';

import {
  ComboComuna,
  ComboSimple,
  InputBlockDepartamento,
  InputCalle,
  InputEmail,
  InputNumero,
  InputRut,
  InputTelefono,
} from '@/components/form';
import InputRazonSocial from '@/components/form/input-razon-social';
import IfContainer from '@/components/if-container';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import Position from '@/components/stage/position';
import Titulo from '@/components/titulo/titulo';
import { useMergeFetchArray } from '@/hooks/use-merge-fetch';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import NavegacionEntidadEmpleadora from '../../(componentes)/navegacion-entidad-empleadora';
import { buscarActividadesLaborales } from '../../(servicios)/buscar-actividades-laborales';
import { buscarCajasDeCompensacion } from '../../(servicios)/buscar-cajas-de-compensacion';
import { buscarComunas } from '../../(servicios)/buscar-comunas';
import { buscarRegiones } from '../../(servicios)/buscar-regiones';
import { buscarSistemasDeRemuneracion } from '../../(servicios)/buscar-sistemas-de-remuneracion';
import { buscarTamanosEmpresa } from '../../(servicios)/buscar-tamanos-empresa';
import { buscarTiposDeEmpleadores } from '../../(servicios)/buscar-tipo-de-empleadores';
import InputHolding from './(componentes)/input-holding';
import InputNombreFantasia from './(componentes)/input-nombre-fantasia';
import { CamposFormularioEmpleador } from './(modelos)/campos-formulario-empleador';
import { actualizarEmpleador } from './(servicios)/actualizar-empleador';
import { buscarEmpleadorPorId } from './(servicios)/buscar-empleador-por-id';

interface DatosEmpleadoresPageProps {
  params: {
    idempleador: {
      id: number;
    };
  };
}

const DatosEmpleadoresPage: React.FC<DatosEmpleadoresPageProps> = ({ params }) => {
  const id = Number(params.idempleador);

  const [refresh, refrescarPagina] = useRefrescarPagina();

  const [spinnerCargar, setSpinnerCargar] = useState(false);

  const [
    errorCombos,
    [CCTIPOEMP, CCAF, CCACTLAB, CCREGION, CCCOMUNA, comboRemuneracion, comboTamanoEmpresa],
    cargandoCombos,
  ] = useMergeFetchArray([
    buscarTiposDeEmpleadores(),
    buscarCajasDeCompensacion(),
    buscarActividadesLaborales(),
    buscarRegiones(),
    buscarComunas(),
    buscarSistemasDeRemuneracion(),
    buscarTamanosEmpresa(),
  ]);

  const [errorEmpleador, [empleador], cargandoEmpleador] = useMergeFetchArray(
    [buscarEmpleadorPorId(id)],
    [refresh],
  );

  const formulario = useForm<CamposFormularioEmpleador>({ mode: 'onBlur' });

  const regionSeleccionada = formulario.watch('regionId');

  // Parchar fomulario
  useEffect(() => {
    if (cargandoCombos || cargandoEmpleador || !empleador || errorCombos.length > 0) {
      return;
    }

    setSpinnerCargar(true);
    formulario.setValue('rut', empleador.rutempleador);
    formulario.setValue('razonSocial', empleador.razonsocial);
    formulario.setValue('nombreFantasia', empleador.nombrefantasia);
    formulario.setValue('tipoEntidadEmpleadoraId', empleador.tipoempleador.idtipoempleador);
    formulario.setValue('cajaCompensacionId', empleador.ccaf.idccaf);
    formulario.setValue('actividadLaboralId', empleador.actividadlaboral.idactividadlaboral);
    formulario.setValue('regionId', empleador.direccionempleador.comuna.region.idregion);
    formulario.setValue('calle', empleador.direccionempleador.calle);
    formulario.setValue('numero', empleador.direccionempleador.numero);
    formulario.setValue('departamento', empleador.direccionempleador.depto);

    formulario.setValue('telefono1', empleador.telefonohabitual);
    formulario.setValue('telefono2', empleador.telefonomovil);
    formulario.setValue('email', empleador.email);
    formulario.setValue('emailConfirma', empleador.email);
    formulario.setValue('holding', empleador.holding);
    formulario.setValue('tamanoEmpresaId', empleador.tamanoempresa.idtamanoempresa);
    formulario.setValue(
      'sistemaRemuneracionId',
      empleador.sistemaremuneracion.idsistemaremuneracion,
    );

    /* NOTA: Hay que darle un timeout antes de parchar la comuna. Puede ser porque react necesita
     * un tiempo para actualizar el combo de comunas al parchar la region. */
    setTimeout(() => {
      formulario.setValue('comunaId', empleador.direccionempleador.comuna.idcomuna);
      setSpinnerCargar(false);
    }, 1000);
  }, [cargandoCombos, cargandoEmpleador]);

  const onGuardarCambios: SubmitHandler<CamposFormularioEmpleador> = async (data) => {
    if (!empleador) {
      throw new Error('No se ha cargado el empleador aun');
    }

    try {
      setSpinnerCargar(true);

      await actualizarEmpleador({
        idEmpleador: empleador.idempleador,
        rutEmpleador: data.rut,
        razonSocial: data.razonSocial,
        nombreFantasia: data.nombreFantasia,
        email: data.email,
        emailconfirma: data.emailConfirma,
        holding: data.holding,
        telefono1: data.telefono1,
        telefono2: data.telefono2,
        calle: data.calle,
        depto: data.departamento,
        numero: data.numero,
        comunaId: data.comunaId,
        sistemaRemuneracionId: data.sistemaRemuneracionId,
        tamanoEmpresaId: data.tamanoEmpresaId,
        tipoEmpleadorId: data.tipoEntidadEmpleadoraId,
        actividadLaboralId: data.actividadLaboralId,
        cajaCompensacionId: data.cajaCompensacionId,
      });

      setSpinnerCargar(false);

      await Swal.fire({
        icon: 'success',
        title: 'Entidad empleadora fue actualizada con éxito',
        showConfirmButton: true,
        confirmButtonColor: 'var(--color-blue)',
      });

      refrescarPagina();
    } catch (error) {
      setSpinnerCargar(false);

      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar la entidad empleadora',
        showConfirmButton: true,
        confirmButtonColor: 'var(--color-blue)',
      });
    }
  };

  return (
    <>
      <div className="bgads">
        <Position />

        <div className="pb-3 px-3 px-lg-5">
          <div className="row">
            <NavegacionEntidadEmpleadora id={id} />
          </div>

          <IfContainer show={cargandoCombos || cargandoEmpleador || spinnerCargar}>
            <SpinnerPantallaCompleta />
          </IfContainer>

          <IfContainer show={errorCombos.length > 0 || errorEmpleador.length > 0}>
            <h4 className="text-center py-5">Error al cargar los datos de la entidad empleadora</h4>
          </IfContainer>

          <IfContainer show={errorCombos.length === 0 && errorEmpleador.length === 0}>
            <Titulo url="">
              Entidad Empleadora - <b>{empleador?.razonsocial ?? 'Cargando...'}</b> / Datos Entidad
              Empleadora
            </Titulo>

            <FormProvider {...formulario}>
              <form onSubmit={formulario.handleSubmit(onGuardarCambios)}>
                <div className="row mt-3 g-3 align-items-baseline">
                  <InputRut
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

                  <InputNombreFantasia
                    name="nombreFantasia"
                    label="Nombre Fantasía"
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

                  <ComboSimple
                    name="cajaCompensacionId"
                    label="Seleccione CCAF a la cual está afiliada"
                    datos={CCAF}
                    idElemento="idccaf"
                    descripcion="nombre"
                    className="col-12 col-md-6 col-lg-4"
                  />

                  <ComboSimple
                    name="actividadLaboralId"
                    label="Actividad Laboral Entidad Empleadora"
                    datos={CCACTLAB}
                    idElemento="idactividadlaboral"
                    descripcion="actividadlaboral"
                    className="col-12 col-md-6 col-lg-4"
                  />

                  <InputHolding
                    name="holding"
                    label="Holding"
                    className="col-12 col-md-6 col-lg-4"
                  />

                  <ComboSimple
                    name="tamanoEmpresaId"
                    label="N° de trabajadores"
                    datos={comboTamanoEmpresa}
                    idElemento="idtamanoempresa"
                    descripcion="descripcion"
                    className="col-12 col-md-6 col-lg-4"
                  />

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
                  />

                  <ComboComuna
                    name="comunaId"
                    label="Comuna"
                    regionSeleccionada={regionSeleccionada}
                    comunas={CCCOMUNA}
                    className="col-12 col-md-6 col-lg-4"
                  />

                  <InputCalle name="calle" label="Calle" className="col-12 col-md-6 col-lg-4" />

                  <InputNumero name="numero" label="Número" className="col-12 col-md-6 col-lg-4" />

                  <InputBlockDepartamento
                    name="departamento"
                    label="Block / Departamento"
                    className="col-12 col-md-6 col-lg-4"
                  />

                  {/* Para mover filas a la siguiente linea */}
                  <div className="d-none d-lg-block col-lg-4"></div>

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
                </div>
                <div className="row">
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
                    <button type="submit" className="btn btn-primary">
                      Grabar
                    </button>
                    <Link
                      className="btn btn-danger mt-2 mt-sm-0 me-0 me-sm-2"
                      href={'/empleadores'}>
                      Volver
                    </Link>
                  </div>
                </div>
              </form>
            </FormProvider>
          </IfContainer>
        </div>
      </div>
    </>
  );
};

export default DatosEmpleadoresPage;
