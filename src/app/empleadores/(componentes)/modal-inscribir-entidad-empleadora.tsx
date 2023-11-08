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
import IfContainer from '@/components/if-container';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { AuthContext } from '@/contexts';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { AlertaError, AlertaExito } from '@/utilidades/alertas';
import React, { useContext, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { FormularioInscribirEntidadEmpleadora } from '../(modelos)/formulario-inscribir-entidad-empleadora';
import { buscarActividadesLaborales } from '../(servicios)/buscar-actividades-laborales';
import { buscarCajasDeCompensacion } from '../(servicios)/buscar-cajas-de-compensacion';
import { buscarComunas } from '../(servicios)/buscar-comunas';
import { buscarRegiones } from '../(servicios)/buscar-regiones';
import { buscarSistemasDeRemuneracion } from '../(servicios)/buscar-sistemas-de-remuneracion';
import { buscarTamanosEmpresa } from '../(servicios)/buscar-tamanos-empresa';
import { buscarTiposDeEmpleadores } from '../(servicios)/buscar-tipo-de-empleadores';
import { EmpleadorYaExisteError, inscribirEmpleador } from '../(servicios)/inscribir-empleador';

interface ModalInscribirEntidadEmpleadoraProps {
  onEntidadEmpleadoraCreada: () => void;
}

const ModalInscribirEntidadEmpleadora: React.FC<ModalInscribirEntidadEmpleadoraProps> = ({
  onEntidadEmpleadoraCreada,
}) => {
  const [mostrarSpinner, setMostrarSpinner] = useState(false);
  const { usuario } = useContext(AuthContext);

  const [erroresCargarCombos, combos, cargandoCombos] = useMergeFetchObject({
    tipoEmpleadores: buscarTiposDeEmpleadores(),
    comunas: buscarComunas(),
    cajasDeCompensacion: buscarCajasDeCompensacion(),
    regiones: buscarRegiones(),
    actividadesLaborales: buscarActividadesLaborales(),
    sistemasDeRemuneracion: buscarSistemasDeRemuneracion(),
    tamanosEmpresas: buscarTamanosEmpresa(),
  });

  const formulario = useForm<FormularioInscribirEntidadEmpleadora>({
    mode: 'onBlur',
  });

  const regionSeleccionada = formulario.watch('regionId');

  const onCerrarModal = () => {
    resetearFormulario();
  };

  const resetearFormulario = () => {
    formulario.reset();
  };

  const crearNuevaEntidad: SubmitHandler<FormularioInscribirEntidadEmpleadora> = async (data) => {
    try {
      setMostrarSpinner(true);
      if (usuario == undefined) return;
      await inscribirEmpleador(data, usuario?.rut);

      resetearFormulario();

      AlertaExito.fire({
        html: 'La nueva entidad empleadora fue inscrita con éxito',
      });

      onEntidadEmpleadoraCreada();
    } catch (error) {
      if (error instanceof EmpleadorYaExisteError) {
        return AlertaError.fire({
          html: 'RUT del empleador ya existe',
        });
      }
      return AlertaError.fire({
        html: 'Error al inscribir empleador',
      });
    } finally {
      setMostrarSpinner(false);
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id="Addsempresa"
        tabIndex={-1}
        aria-labelledby="AddsempresaLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="AddsempresaLabel">
                Inscribir Entidad Empleadora
              </h1>
              <button
                type="button"
                className="btn-close"
                onClick={onCerrarModal}
                data-bs-dismiss="modal"
                aria-label="Close"></button>
            </div>
            <FormProvider {...formulario}>
              <form onSubmit={formulario.handleSubmit(crearNuevaEntidad)}>
                <IfContainer show={mostrarSpinner || cargandoCombos}>
                  <SpinnerPantallaCompleta></SpinnerPantallaCompleta>
                </IfContainer>

                <IfContainer show={erroresCargarCombos.length > 0}>
                  <div className="modal-body">
                    <h4 className="my-5 text-center">Error al cargar combos</h4>
                  </div>
                </IfContainer>

                <IfContainer show={erroresCargarCombos.length === 0}>
                  <div className="modal-body mx-lg-4 mb-lg-4">
                    <div className="row">
                      <div className="col-12 d-flex justify-content-end">
                        <div style={{ color: 'blueviolet' }}>
                          <span>
                            <small>(*) Son campos obligatorios.</small>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="row mt-2 mt-lg-0 g-3 align-items-baseline">
                      <InputRut
                        name="rut"
                        className="col-12 col-lg-6 col-xl-3"
                        label="RUT Entidad Empleadora /Persona Trabajadora Independiente"
                      />
                      <InputRazonSocial
                        name="razonSocial"
                        className="col-12 col-lg-6 col-xl-3"
                        label="Razón Social / Nombre"
                      />

                      <ComboSimple
                        name="tipoEntidadEmpleadoraId"
                        datos={combos!?.tipoEmpleadores}
                        idElemento={'idtipoempleador'}
                        descripcion={'tipoempleador'}
                        label="Tipo de Entidad Empleadora"
                        className="col-12 col-lg-6 col-xl-3"
                      />

                      <ComboSimple
                        name="cajaCompensacionId"
                        datos={combos!?.cajasDeCompensacion}
                        descripcion={'nombre'}
                        idElemento={'idccaf'}
                        className="col-12 col-lg-6 col-xl-3"
                        label="Seleccione CCAF a la cual está afiliada"
                      />

                      <ComboSimple
                        name="actividadLaboralId"
                        className="col-12 col-lg-6 col-xl-3"
                        datos={combos!?.actividadesLaborales}
                        descripcion={'actividadlaboral'}
                        idElemento={'idactividadlaboral'}
                        label="Actividad Laboral Entidad Empleadora"
                      />

                      <ComboSimple
                        name="regionId"
                        className="col-12 col-lg-6 col-xl-3"
                        datos={combos!?.regiones}
                        idElemento={'idregion'}
                        descripcion={'nombre'}
                        label="Región"
                        tipoValor="string"
                      />

                      <ComboComuna
                        name="comunaId"
                        label="Comuna"
                        comunas={combos!?.comunas}
                        regionSeleccionada={regionSeleccionada}
                        className="col-12 col-lg-6 col-xl-3"
                      />

                      <InputCalle name="calle" className="col-12 col-lg-6 col-xl-3" label="Calle" />

                      <InputNumero
                        name="numero"
                        className="col-12 col-lg-6 col-xl-3"
                        label="Número"
                      />

                      <InputBlockDepartamento
                        name="departamento"
                        className="col-12 col-lg-6 col-xl-3"
                        label="Block / Departamento"
                      />

                      <InputTelefono
                        label="Teléfono"
                        name="telefono1"
                        className="col-12 col-lg-6 col-xl-3"
                      />

                      <InputTelefono
                        label="Teléfono 2"
                        className="col-12 col-lg-6 col-xl-3"
                        name="telefono2"
                        opcional
                      />

                      <InputEmail
                        label="Correo electrónico empleador"
                        className="col-12 col-lg-6 col-xl-3"
                        name="email"
                        debeCoincidirCon="emailConfirma"
                      />

                      <InputEmail
                        label="Repetir correo electrónico"
                        name="emailConfirma"
                        className="col-12 col-lg-6 col-xl-3"
                        debeCoincidirCon="email"
                      />

                      <ComboSimple
                        name="tamanoEmpresaId"
                        descripcion={'descripcion'}
                        idElemento={'idtamanoempresa'}
                        datos={combos!?.tamanosEmpresas}
                        className="col-12 col-lg-6 col-xl-3"
                        label="Tamaño Entidad Empleadora"
                      />

                      <ComboSimple
                        name="sistemaRemuneracionId"
                        className="col-12 col-lg-6 col-xl-3"
                        datos={combos!?.sistemasDeRemuneracion}
                        label="Sistema de Remuneración"
                        descripcion={'descripcion'}
                        idElemento={'idsistemaremuneracion'}
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <div className="w-100 d-flex flex-column flex-md-row-reverse">
                      <button type="submit" className="btn btn-primary">
                        Grabar
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger mt-2 mt-md-0 me-md-2"
                        data-bs-dismiss="modal"
                        onClick={onCerrarModal}>
                        Volver
                      </button>
                    </div>
                  </div>
                </IfContainer>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalInscribirEntidadEmpleadora;
