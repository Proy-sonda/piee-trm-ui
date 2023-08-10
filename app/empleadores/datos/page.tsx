'use client';

import Position from '@/app/components/stage/Position';
import Stage from '@/app/components/stage/Stage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';

interface DatosEmpleadoresProps {
  searchParams: {
    rut: string;
    razon: string;
  };
}

const DatosEmpleadoresPage = ({ searchParams }: DatosEmpleadoresProps) => {
  const router = useRouter();

  const { rut, razon } = searchParams;
  let valorSInguion = rut?.replaceAll('-', '');

  let cookie = parseCookies();
  let token = cookie.token;

  if (!token) {
    router.push('/login');
    return null;
  }

  return (
    <div className="bgads">
      <Position position={4} />

      <div className="container">
        <div className="row">
          <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-3">
            <div id="flowBoxes">
              <div className="right active">
                <Link href={`/empleadores/datos?rut=${rut}&razon=${razon}`}>
                  Datos Entidad Empleadora
                </Link>{' '}
                &nbsp;
              </div>
              <div className="left right">
                <Link href={`/empleadores/unidad?rut=${rut}&razon=${razon}`}>Unidad de RRHH</Link>
                &nbsp;
              </div>
              <div className="left">
                <Link href={`/empleadores/usuarios?rut=${rut}&razon=${razon}`}>Usuarios</Link>
              </div>
            </div>

            {/* <button className='btn btn-primary'>Asoc. Usuarios RRHH</button> */}

            {/* <button className='btn btn-primary'>Asoc. Trabajadores RRHH</button> */}

            {/* <button className='btn btn-primary'>Salir</button> */}
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-8">
            <Stage manual="" url="#">
              Datos Entidad Empleadora - {razon}
            </Stage>
          </div>

          <div className="col-md-4">
            <label style={{ cursor: 'pointer', color: 'blue' }}>Manual</label>
            <br />
          </div>
        </div>

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
                value={valorSInguion}
                disabled
              />
              <small id="rutHelp" className="form-text text-muted" style={{ fontSize: '10px' }}>
                No debe incluir guiones ni puntos (EJ: 175967044)
              </small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Razón Social / Nombre particular</label>
              <input
                type="text"
                name="razon"
                className="form-control"
                aria-describedby="razonHelp"
                value={razon}
                placeholder=""
              />
              <small id="razonHelp" className="form-text text-muted"></small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Nombre Fantasía (*)</label>
              <input
                type="text"
                name="fantasia"
                className="form-control"
                aria-describedby="fantHelp"
                value={'Ejemplo'}
                placeholder=""
              />
              <small id="fantHelp" className="form-text text-muted"></small>
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-4">
            <label htmlFor="templeador">Tipo de Entidad Empleadora</label>
            <select className="form-select" id="templeador" />
          </div>
          <div className="col-md-4">
            <label htmlFor="ccaf">Seleccione CCAF a la cual está afiliada</label>
            <select className="form-select" id="ccaf" />
          </div>
          <div className="col-md-4">
            <label htmlFor="alaboralemp">Actividad Laboral Entidad Empleadora (*)</label>
            <select className="form-select" id="alaboralemp" />
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-4">
            <label htmlFor="region">Región</label>
            <select className="form-select" id="region" />
          </div>
          <div className="col-md-4">
            <label htmlFor="comuna">Comuna (*)</label>
            <select className="form-select" id="comuna" />
          </div>
          <div className="col-md-4">
            <label htmlFor="tipo">Tipo (*)</label>
            <select className="form-select" id="tipo" />
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-4">
            <label htmlFor="exampleInputEmail1">Calle (*)</label>
            <input
              type="text"
              name="calle"
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
              <input type="text" className="form-control" id="tel1" name="tf1" />
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
              <input type="text" className="form-control" id="tel2" name="tf2" />
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-4">
            <label htmlFor="exampleInputEmail1">Correo electrónico empleador (*)</label>
            <input
              type="mail"
              name="cemple"
              className="form-control"
              aria-describedby="cempleHelp"
              placeholder=""
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
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="qtrabajadores">N° de trabajadores</label>

              <select className="form-select" id="qtrabajadores"></select>
            </div>
          </div>
          <div className="col-md-4">
            <label htmlFor="sremuneraciones">Sistema de Remuneración</label>
            <select className="form-select" id="sremuneraciones" />
          </div>
        </div>

        <div className="row mt-5">
          <div className="inline-group text-end">
            <button type="button" className="btn btn-primary">
              Actualizar Datos
            </button>{' '}
            &nbsp;
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
          </div>
        </div>
        <br />
      </div>
    </div>
  );
};

export default DatosEmpleadoresPage;
