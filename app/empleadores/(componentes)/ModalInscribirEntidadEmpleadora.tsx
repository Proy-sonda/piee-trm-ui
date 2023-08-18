import { CCCOMUNACB } from '@/app/contexts/interfaces/types';
import { useMergeFetchResponse } from '@/app/hooks/useFetch';
import { useForm } from '@/app/hooks/useForm';
import { FormEvent, useState } from 'react';
import { DatosNuevaEntidadEmpleadora } from '../(modelos)/datosNuevaEntidadEmpleadora';
import {
  useBuscarActividadesLaborales,
  useBuscarCajasDeCompensacion,
  useBuscarComunas,
  useBuscarRegiones,
  useBuscarSistemasDeRemuneracion,
  useBuscarTamanosEmpresa,
  useBuscarTiposDeEmpleadores,
} from '../(servicios)/buscarCombos';

interface ModalInscribirEntidadEmpleadoraProps {
  onCrearNuevaEntidadEmpleadora: (nuevaEntidad: DatosNuevaEntidadEmpleadora) => void;
}

const ModalInscribirEntidadEmpleadora = ({
  onCrearNuevaEntidadEmpleadora,
}: ModalInscribirEntidadEmpleadoraProps) => {
  const [_, combos] = useMergeFetchResponse({
    tipoEmpleadores: useBuscarTiposDeEmpleadores(),
    comunas: useBuscarComunas(),
    cajasDeCompensacion: useBuscarCajasDeCompensacion(),
    regiones: useBuscarRegiones(),
    actividadesLaborales: useBuscarActividadesLaborales(),
    sistemasDeRemuneracion: useBuscarSistemasDeRemuneracion(),
    tamanosEmpresas: useBuscarTamanosEmpresa(),
  });

  const [region, setregion] = useState('');
  const [comunas, setcomuna] = useState([
    {
      idcomuna: 0,
      nombre: '',
      region: {
        idregion: 0,
        nombre: '',
      },
    },
  ] as CCCOMUNACB[]);

  const {
    inscribeRun,
    razonsocial,
    templeador,
    ccaf,
    alaboralemp,
    ccomuna,
    sremun,
    npersonas,
    calle,
    numero,
    bdep,
    tf1,
    tf2,
    onInputValidRut,
    cemple,
    recemple,
    onInputChange,
    onInputChangeOnlyNum,
  } = useForm({
    inscribeRun: '',
    razonsocial: '',
    templeador: '',
    ccaf: '',
    alaboralemp: '',
    ccomuna: '',
    npersonas: '',
    calle: '',
    numero: '',
    bdep: '',
    tf1: '',
    tf2: '',
    cemple: '',
    recemple: '',
  });

  const onChangeRegion = (event: any) => {
    setregion(event.target.value);
    const comunas = combos!.comunas.filter(
      ({ region: { idregion } }) => idregion == event.target.value,
    );
    setcomuna(comunas);
  };

  const onConfirmarAdscripcionInterno = (event: FormEvent) => {
    event.preventDefault();

    onCrearNuevaEntidadEmpleadora({
      inscribeRun,
      razonsocial,
      templeador,
      ccaf,
      alaboralemp,
      ccomuna,
      sremun,
      npersonas,
      calle,
      numero,
      bdep,
      tf1,
      tf2,
      cemple,
      recemple,
    });
  };

  return (
    <>
      <div
        className="modal fade"
        id="Addsempresa"
        tabIndex={-1}
        aria-labelledby="AddsempresaLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="AddsempresaLabel">
                Inscribir Entidad Empleadora
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"></button>
            </div>
            <form onSubmit={onConfirmarAdscripcionInterno}>
              <div className="modal-body">
                <div className="ms-3 me-3">
                  <div
                    style={{
                      marginLeft: '15px',
                      marginRight: '15px',
                    }}></div>

                  <br />
                  <div className="row">
                    <div
                      className="float-end text-end"
                      style={{
                        marginRight: '3%',
                        paddingRight: '3%',
                        color: 'blueviolet',
                      }}>
                      <label>(*) Son campos obligatorios.</label>
                    </div>
                  </div>

                  <div className="ms-5 me-5">
                    <div className="row mt-2">
                      <div className="col-md-4">
                        <label htmlFor="exampleInputEmail1">
                          RUN Entidad Empleadora/ Persona Trabajadora Independiente (*)
                        </label>
                        <input
                          type="text"
                          name="inscribeRun"
                          maxLength={11}
                          value={inscribeRun}
                          onChange={onInputValidRut}
                          autoComplete="new-custom-value"
                          className="form-control"
                          aria-describedby="rutHelp"
                        />
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">Razón Social/ Nombre (*)</label>
                          <input
                            type="text"
                            name="razonsocial"
                            value={razonsocial}
                            onInput={onInputChange}
                            minLength={4}
                            maxLength={120}
                            autoComplete="new-custom-value"
                            className="form-control"
                            aria-describedby="razonHelp"
                            placeholder=""
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="templeador">Tipo de Entidad Empleadora (*)</label>
                        <select
                          className="form-select"
                          id="templeador"
                          name="templeador"
                          value={templeador}
                          onChange={onInputChange}
                          required>
                          <option value={''}>Seleccionar</option>
                          {/* {CCTIPOEMP && CCTIPOEMP.map(({ idtipoempleador, tipoempleador }) => ( */}
                          {combos &&
                            combos.tipoEmpleadores.map(({ idtipoempleador, tipoempleador }) => (
                              <option key={idtipoempleador} value={idtipoempleador}>
                                {tipoempleador}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-md-4">
                        <label htmlFor="ccaf">Seleccione CCAF a la cual está afiliada (*)</label>
                        <select
                          className="form-select"
                          id="ccaf"
                          name="ccaf"
                          value={ccaf}
                          onChange={onInputChange}>
                          <option value={''}>Seleccionar</option>
                          {/* {CCAF && CCAF.map(({ idccaf, nombre }) => ( */}
                          {combos &&
                            combos.cajasDeCompensacion.map(({ idccaf, nombre }) => (
                              <option key={idccaf} value={idccaf}>
                                {nombre}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="alaboralemp">
                          Actividad Laboral Entidad Empleadora (*)
                        </label>
                        <select
                          className="form-select"
                          id="alaboralemp"
                          name="alaboralemp"
                          value={alaboralemp}
                          onChange={onInputChange}>
                          <option value={''}>Seleccionar</option>
                          {combos &&
                            combos.actividadesLaborales.map(
                              ({ idactividadlaboral, actividadlaboral }) => (
                                <option key={idactividadlaboral} value={idactividadlaboral}>
                                  {actividadlaboral}
                                </option>
                              ),
                            )}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="region">Región (*)</label>
                        <select
                          className="form-select"
                          id="region"
                          name="region"
                          value={region}
                          onChange={onChangeRegion}
                          required>
                          <option value={''}>Seleccionar</option>
                          {combos &&
                            combos.regiones.map(({ idregion, nombre }) => (
                              <option key={idregion} value={idregion}>
                                {nombre}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-md-4">
                        <label htmlFor="comuna">Comuna (*)</label>
                        <select
                          className="form-select"
                          name="ccomuna"
                          value={ccomuna}
                          onChange={onInputChange}
                          required>
                          <option value={''}>Seleccionar</option>
                          {comunas.map(({ idcomuna, nombre }) => (
                            <option key={idcomuna} value={idcomuna}>
                              {nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="exampleInputEmail1">Calle (*)</label>
                        <input
                          type="text"
                          name="calle"
                          value={calle}
                          autoComplete="new-custom-value"
                          minLength={2}
                          maxLength={80}
                          onChange={onInputChange}
                          className="form-control"
                          aria-describedby="calleHelp"
                          placeholder=""
                        />
                        <small id="calleHelp" className="form-text text-muted"></small>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="exampleInputEmail1">Número (*)</label>
                        <input
                          type="text"
                          name="numero"
                          value={numero}
                          autoComplete="new-custom-value"
                          minLength={1}
                          maxLength={20}
                          onChange={onInputChangeOnlyNum}
                          className="form-control"
                          aria-describedby="numHelp"
                          placeholder=""
                        />
                        <small id="numHelp" className="form-text text-muted"></small>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-md-4">
                        <label htmlFor="exampleInputEmail1">Block / Departamento</label>
                        <input
                          type="text"
                          name="bdep"
                          value={bdep}
                          autoComplete="new-custom-value"
                          minLength={1}
                          maxLength={20}
                          onChange={onInputChange}
                          className="form-control"
                          aria-describedby="bdepHelp"
                          placeholder=""
                        />
                        <small id="bdepHelp" className="form-text text-muted"></small>
                      </div>
                      <div className="col-md-4">
                        <label className="sr-only" htmlFor="tel1">
                          Teléfono 1 (*)
                        </label>
                        <div className="input-group mb-2">
                          <div className="input-group-prepend">
                            <div className="input-group-text">+56</div>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            id="tel1"
                            name="tf1"
                            maxLength={9}
                            minLength={9}
                            autoComplete="new-custom-value"
                            value={tf1}
                            onChange={onInputChangeOnlyNum}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <label className="sr-only" htmlFor="tel2">
                          Teléfono 2 (*)
                        </label>
                        <div className="input-group mb-2">
                          <div className="input-group-prepend">
                            <div className="input-group-text">+56</div>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            id="tel2"
                            name="tf2"
                            maxLength={9}
                            minLength={9}
                            autoComplete="new-custom-value"
                            value={tf2}
                            onChange={onInputChangeOnlyNum}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-md-4">
                        <label htmlFor="exampleInputEmail1">
                          Correo electrónico entidad empleadora (*)
                        </label>
                        <input
                          type="mail"
                          name="cemple"
                          value={cemple}
                          onChange={onInputChange}
                          onPaste={(e) => e.preventDefault()}
                          onCopy={(e) => e.preventDefault()}
                          minLength={3}
                          maxLength={250}
                          autoComplete="new-custom-value"
                          className="form-control"
                          aria-describedby="cempleHelp"
                          placeholder=""
                        />
                        <small id="cempleHelp" className="form-text text-muted">
                          ejemplo@ejemplo.cl
                        </small>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="exampleInputEmail1">
                          Repetir correo electrónico entidad empleadora (*)
                        </label>
                        <input
                          type="mail"
                          name="recemple"
                          value={recemple}
                          onChange={onInputChange}
                          minLength={3}
                          maxLength={350}
                          onPaste={(e) => e.preventDefault()}
                          onCopy={(e) => e.preventDefault()}
                          autoComplete="new-custom-value"
                          className="form-control"
                          aria-describedby="recempleHelp"
                          placeholder=""
                        />
                        <small id="recempleHelp" className="form-text text-muted"></small>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="qtrabajadores">N° de personas trabajadoras (*)</label>

                          <select
                            className="form-select"
                            id="qtrabajadores"
                            name="npersonas"
                            value={npersonas}
                            onChange={onInputChange}
                            required>
                            <option value={''}>Seleccionar</option>
                            {combos &&
                              combos.tamanosEmpresas.map(({ idtamanoempresa, descripcion }) => (
                                <option key={idtamanoempresa} value={idtamanoempresa}>
                                  {descripcion}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="sremuneraciones">Sistema de Remuneración</label>
                        <select
                          className="form-select"
                          id="sremuneraciones"
                          name="sremun"
                          value={sremun}
                          onChange={onInputChange}
                          required>
                          <option value={''}>Seleccionar</option>
                          {combos &&
                            combos.sistemasDeRemuneracion.map(
                              ({ idsistemaremuneracion, descripcion }) => (
                                <option key={idsistemaremuneracion} value={idsistemaremuneracion}>
                                  {' '}
                                  {descripcion}{' '}
                                </option>
                              ),
                            )}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  Confirmar Adscripción
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalInscribirEntidadEmpleadora;
