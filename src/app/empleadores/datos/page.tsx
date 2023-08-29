'use client';
import Position from '@/components/stage/Position';
import Stage from '@/components/stage/Stage';
import { EmpleadorContext } from '@/contexts/EmpleadorContext';
import {
  CCACTLABCB,
  CCAFCB,
  CCCOMUNACB,
  CCREGIONCB,
  CCREMUNERACION,
  CCTAMANOCB,
  CCTIPOEM,
} from '@/contexts/interfaces/types';
import { actualizaEmpleador } from '@/helpers/tramitacion/empleadores';
import useCombo from '@/hooks/use-combo';
import { useForm } from '@/hooks/use-form';
import { ActualizaEmpleador } from '@/modelos/tramitacion';
import { estaLogueado } from '@/servicios/auth';
import { useRouter } from 'next/navigation';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import NavegacionEntidadEmpleadora from '../(componentes)/NavegacionEntidadEmpleadora';

interface DatosEmpleadoresProps {
  searchParams: {
    rut: string;
    razon: string;
    id: string;
  };
}
const initialComuna: CCCOMUNACB[] = [
  {
    idcomuna: 0,
    nombre: '',
    region: {
      idregion: 0,
      nombre: '',
    },
  },
];

const DatosEmpleadoresPage = ({ searchParams }: DatosEmpleadoresProps) => {
  const router = useRouter();

  let CCTIPOEMP: CCTIPOEM[] = useCombo('/tipoempleador/all');
  let CCAF: CCAFCB[] = useCombo('/ccaf/all');
  let CCACTLAB: CCACTLABCB[] = useCombo('/actividadlaboral/all');
  let CCREGION: CCREGIONCB[] = useCombo('/Region/all');
  let CCCOMUNA: CCCOMUNACB[] = useCombo('/comuna/all/region');
  let CCREMUNERACION: CCREMUNERACION[] = useCombo('/sistemaremuneracion/all');
  let CCTAMANOCB: CCTAMANOCB[] = useCombo('/tamanoempresa/all');

  const { empleador } = useContext(EmpleadorContext);
  const { rut, id } = searchParams;

  let [loading, setLoading] = useState(false);
  const [region, setregion] = useState<any>();
  const [comunas, setcomuna] = useState(initialComuna);

  let {
    razon,
    templador,
    ccaf,
    alaboralemp,
    calle,
    numero,
    bdep,
    ccomuna,
    tf1,
    tf2,
    cemple,
    recemple,
    qtrabajadores,
    sremuneraciones,
    fantasia,
    onInputChange,
    onInputChangeOnlyNum,
  } = useForm({
    razon: empleador.find((v) => v.rutempleador == rut)?.razonsocial,
    templador: empleador.find((v) => v.rutempleador == rut)?.tipoempleador.idtipoempleador,
    ccaf: empleador.find((v) => v.rutempleador == rut)?.ccaf.idccaf,
    alaboralemp: empleador.find((v) => v.rutempleador == rut)?.actividadlaboral.idactividadlaboral,
    calle: empleador.find((v) => v.rutempleador == rut)?.direccionempleador.calle,
    numero: empleador.find((v) => v.rutempleador == rut)?.direccionempleador.numero,
    bdep: empleador.find((v) => v.rutempleador == rut)?.direccionempleador.depto,
    ccomuna: empleador
      .find((v) => v.rutempleador == rut)
      ?.direccionempleador.comuna.idcomuna.toString(),
    tf1: empleador.find((v) => v.rutempleador == rut)?.telefonohabitual,
    tf2: empleador.find((v) => v.rutempleador == rut)?.telefonomovil,
    cemple: empleador.find((v) => v.rutempleador == rut)?.email,
    recemple: empleador.find((v) => v.rutempleador == rut)?.email,
    qtrabajadores: empleador.find((v) => v.rutempleador == rut)?.tamanoempresa.idtamanoempresa,
    sremuneraciones: empleador.find((v) => v.rutempleador == rut)?.sistemaremuneracion
      .idsistemaremuneracion,
    fantasia: empleador.find((v) => v.rutempleador == rut)?.nombrefantasia,
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      if (empleador.find((v) => v.rutempleador == rut)?.rutempleador) {
        setregion(
          empleador
            .find((v) => v.rutempleador == rut)
            ?.direccionempleador.comuna.idcomuna.substring(0, 2),
        );
        CCCOMUNA = CCCOMUNA.filter(
          ({ region: { idregion } }) =>
            idregion ==
            Number(
              empleador
                .find((v) => v.rutempleador == rut)
                ?.direccionempleador.comuna.idcomuna.substring(0, 2),
            ),
        );
        setcomuna(CCCOMUNA);
      }
      setLoading(false);
    }, 1800);
  }, [CCCOMUNA]);

  const onChangeRegion = (event: any) => {
    setregion(event.target.value);
    CCCOMUNA = CCCOMUNA.filter(({ region: { idregion } }) => idregion == event.target.value);
    setcomuna(CCCOMUNA);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const Empleador: ActualizaEmpleador = {
      rutempleador: rut,
      email: cemple,
      emailconfirma: recemple,
      nombrefantasia: fantasia,
      telefonomovil: tf2,
      telefonohabitual: tf1,
      razonsocial: razon,
      tamanoempresa: {
        idtamanoempresa: qtrabajadores,
        descripcion: qtrabajadores.toString(),
        nrotrabajadores: qtrabajadores,
      },
      tipoempleador: {
        idtipoempleador: Number(templador),
        tipoempleador: templador.toString(),
      },
      actividadlaboral: {
        idactividadlaboral: alaboralemp,
        actividadlaboral: alaboralemp.toString(),
      },
      ccaf: {
        idccaf: ccaf,
        nombre: ccaf.toString(),
      },
      direccionempleador: {
        calle: calle,
        depto: bdep,
        numero: numero,
        comuna: {
          idcomuna: ccomuna,
          nombre: ccomuna,
        },
      },
      idempleador: Number(empleador.find((v) => v.rutempleador == rut)?.idempleador) || 0,
      sistemaremuneracion: {
        idsistemaremuneracion: sremuneraciones,
        descripcion: sremuneraciones.toString(),
      },
    };

    const ActEmpleador = async () => {
      const resp = await actualizaEmpleador(Empleador);
      if (resp.ok)
        return Swal.fire({
          html: 'Entidad empleadora fue actualizado con exito',
          timer: 2000,
          showConfirmButton: false,
          icon: 'success',
        });
      const datos = await resp.json();
      Swal.fire({ icon: 'error', html: datos.message, timer: 2000, showConfirmButton: false });
    };

    ActEmpleador();
  };

  if (!estaLogueado()) {
    router.push('/login');
    return null;
  }

  return (
    <>
      <div
        className={'spinner'}
        style={{
          display: loading ? '' : 'none',
        }}>
        <ClipLoader
          color={'var(--color-blue)'}
          loading={loading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>

      <div className="bgads">
        <Position position={4} />

        <div className="container">
          <div className="row">
            <NavegacionEntidadEmpleadora rut={rut} razon={razon} id={id} />
          </div>

          <div className="row mt-2">
            <div className="col-md-8">
              <Stage manual="" url="#">
                Datos Entidad Empleadora -{' '}
                {empleador.find((v) => v.rutempleador == rut)?.razonsocial}
              </Stage>
            </div>

            <div className="col-md-4">
              <label style={{ cursor: 'pointer', color: 'blue' }}>Manual</label>
              <br />
            </div>
          </div>

          <form>
            <div className="row mt-3">
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">RUT Entidad Empleadora (*)</label>
                  <input
                    type="text"
                    name="rut"
                    className="form-control"
                    aria-describedby="rutHelp"
                    placeholder=""
                    value={empleador.find((v) => v.rutempleador == rut)?.rutempleador}
                    onChange={(e) => e.preventDefault()}
                    disabled
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Razón Social / Nombre particular</label>
                  <input
                    type="text"
                    name="razon"
                    className="form-control"
                    autoComplete="new-custom-value"
                    value={razon}
                    onInput={onInputChange}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Nombre Fantasía (*)</label>
                  <input
                    type="text"
                    name="fantasia"
                    value={fantasia}
                    onChange={onInputChange}
                    className="form-control"
                    autoComplete="new-custom-value"
                  />
                </div>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-4">
                <label htmlFor="templeador">Tipo de Entidad Empleadora</label>
                <select
                  className="form-select"
                  name="templador"
                  onChange={onInputChange}
                  value={templador}
                  required>
                  <option value={''}>Seleccionar</option>
                  {CCTIPOEMP.length > 0 ? (
                    CCTIPOEMP.map((tipo) => (
                      <option key={tipo.idtipoempleador} value={tipo.idtipoempleador}>
                        {tipo.tipoempleador}
                      </option>
                    ))
                  ) : (
                    <></>
                  )}
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="ccaf">Seleccione CCAF a la cual está afiliada</label>
                <select
                  className="form-select"
                  name="ccaf"
                  value={ccaf}
                  onChange={onInputChange}
                  required>
                  <option value={''}>Seleccionar</option>

                  {CCAF.length > 0 ? (
                    CCAF.map((ccaf) => (
                      <option key={ccaf.idccaf} value={ccaf.idccaf}>
                        {' '}
                        {ccaf.nombre}
                      </option>
                    ))
                  ) : (
                    <></>
                  )}
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="alaboralemp">Actividad Laboral Entidad Empleadora (*)</label>
                <select
                  className="form-select"
                  id="alaboralemp"
                  name="alaboralemp"
                  value={alaboralemp}
                  onChange={onInputChange}
                  required>
                  <option value={''}>Seleccionar</option>
                  {CCACTLAB.length > 0 ? (
                    CCACTLAB.map(({ idactividadlaboral, actividadlaboral }) => (
                      <option key={idactividadlaboral} value={idactividadlaboral}>
                        {actividadlaboral}
                      </option>
                    ))
                  ) : (
                    <></>
                  )}
                </select>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-4">
                <label htmlFor="region">Región</label>
                <select
                  className="form-select"
                  id="region"
                  value={region}
                  onChange={onChangeRegion}
                  required>
                  <option value={''}>Seleccionar</option>
                  {CCREGION.length > 0 ? (
                    CCREGION.map(({ idregion, nombre }) => (
                      <option key={idregion} value={idregion}>
                        {nombre}
                      </option>
                    ))
                  ) : (
                    <></>
                  )}
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="comuna">Comuna (*)</label>
                <select
                  className="form-select"
                  name="ccomuna"
                  value={ccomuna}
                  onChange={onInputChange}>
                  <option value={''}>Seleccionar</option>
                  {comunas.length > 0 ? (
                    comunas.map(({ idcomuna, nombre }) => (
                      <option key={idcomuna} value={idcomuna}>
                        {nombre}
                      </option>
                    ))
                  ) : (
                    <></>
                  )}
                </select>
              </div>
              {/* <div className="col-md-4">
            <label htmlFor="tipo">Tipo (*)</label>
            <select className="form-select" id="tipo" />
          </div> */}
            </div>

            <div className="row mt-2">
              <div className="col-md-4">
                <label htmlFor="exampleInputEmail1">Calle (*)</label>
                <input
                  type="text"
                  name="calle"
                  value={calle}
                  onChange={onInputChange}
                  autoComplete="new-custom-value"
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
                  onChange={onInputChange}
                  autoComplete="new-custom-value"
                  value={numero}
                  className="form-control"
                  aria-describedby="numHelp"
                  placeholder=""
                />
                <small id="numHelp" className="form-text text-muted"></small>
              </div>
              <div className="col-md-4">
                <label htmlFor="exampleInputEmail1">Block / Departamento</label>
                <input
                  type="text"
                  name="bdep"
                  onChange={onInputChange}
                  autoComplete="new-custom-value"
                  value={bdep}
                  className="form-control"
                  aria-describedby="bdepHelp"
                  placeholder=""
                />
                <small id="bdepHelp" className="form-text text-muted"></small>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-4">
                <label htmlFor="exampleInputEmail1">Punto de referencia (Opcional)</label>
                <input
                  type="text"
                  name="pref"
                  className="form-control"
                  aria-describedby="prefHelp"
                  placeholder=""
                />
                <small id="prefHelp" className="form-text text-muted"></small>
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
                    value={tf1}
                    autoComplete="new-custom-value"
                    onChange={onInputChangeOnlyNum}
                    minLength={9}
                    maxLength={9}
                    required
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
                    value={tf2}
                    onChange={onInputChangeOnlyNum}
                    autoComplete="new-custom-value"
                    minLength={9}
                    maxLength={9}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-4">
                <label htmlFor="exampleInputEmail1">Correo electrónico empleador (*)</label>
                <input
                  type="mail"
                  name="cemple"
                  value={cemple}
                  onChange={onInputChange}
                  autoComplete="new-custom-value"
                  className="form-control"
                />
                <small id="cempleHelp" className="form-text text-muted">
                  ejemplo@ejemplo.cl
                </small>
              </div>
              <div className="col-md-4">
                <label htmlFor="exampleInputEmail1">repetir correo electrónico (*)</label>
                <input
                  type="mail"
                  name="recemple"
                  value={recemple}
                  onChange={onInputChange}
                  autoComplete="new-custom-value"
                  className="form-control"
                  aria-describedby="recempleHelp"
                  placeholder=""
                />
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Holding</label>
                  <input
                    type="text"
                    name="holding"
                    className="form-control"
                    aria-describedby="holdHelp"
                    placeholder=""
                  />
                  <small id="holdHelp" className="form-text text-muted"></small>
                </div>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="qtrabajadores">N° de trabajadores</label>

                  <select
                    className="form-select"
                    id="qtrabajadores"
                    value={qtrabajadores}
                    onChange={onInputChange}
                    required>
                    <option value={''}>Seleccionar</option>
                    {CCTAMANOCB.length > 0 ? (
                      CCTAMANOCB.map(({ idtamanoempresa, descripcion }) => (
                        <option key={idtamanoempresa} value={idtamanoempresa}>
                          {descripcion}
                        </option>
                      ))
                    ) : (
                      <></>
                    )}
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <label htmlFor="sremuneraciones">Sistema de Remuneración</label>
                <select
                  className="form-select"
                  id="sremuneraciones"
                  value={sremuneraciones}
                  onChange={onInputChange}
                  required>
                  <option value={''}>Seleccionar</option>
                  {CCREMUNERACION.length > 0 ? (
                    CCREMUNERACION.map(({ idsistemaremuneracion, descripcion }) => (
                      <option key={idsistemaremuneracion} value={idsistemaremuneracion}>
                        {descripcion}
                      </option>
                    ))
                  ) : (
                    <></>
                  )}
                </select>
              </div>
            </div>

            <div className="row mt-5">
              <div className="inline-group text-end">
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                  Actualizar Datos
                </button>{' '}
                &nbsp;
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancelar
                </button>
              </div>
            </div>
          </form>

          <br />
        </div>
      </div>
    </>
  );
};

export default DatosEmpleadoresPage;
