'use client';

import Position from '@/components/stage/position';
import { AuthContext } from '@/contexts';
import { useForm } from '@/hooks/use-form';
import { Empleador } from '@/modelos/empleador';
import { Unidadrhh } from '@/modelos/tramitacion';
import { cargaUnidadrrhh } from '@/servicios/carga-unidad-rrhh';
import { useContext, useState } from 'react';
import { Table, Tbody, Th, Thead, Tr } from 'react-super-responsive-table';
import styles from './tramitacion.module.css';

const TramitacionPage = () => {
  const { CompletarUsuario } = useContext(AuthContext);

  const [entidadEmp, setEntidadEmp] = useState<Empleador[]>([]);
  const [UnidadRRHH, setUnidadRRHH] = useState<Unidadrhh[]>([]);
  const [eempleador, seteempleador] = useState();

  const { folio, run, fdesde, fhasta, onInputChange, onInputValidRut } = useForm({
    folio: '',
    run: '',
    fdesde: '',
    fhasta: '',
    entidadempleador: '',
    urrhh: '',
  });

  /* TODO: Usar los hooks para obtener la entidad empleadora y no usar cookies en esta parte
  let cookie = parseCookies();
  let token = '';
  token = cookie.token;

  useEffect(() => {
    let data: any = jwt_decode(token);

    CompletarUsuario(data);

    const EntidadEmpleadora = async () => {
      let resp: Empleador[] = await ComboEntidadEmpleador();

      setEntidadEmp(resp);
    };

    EntidadEmpleadora();
  }, [token]);  */

  const onChangeEmp = (event: any) => {
    let value = event.target.value;
    seteempleador(value);
    if (value == '') return;
    const cargarUnidad = async () => {
      const resp: Unidadrhh[] = await cargaUnidadrrhh(value);
      setUnidadRRHH(resp);
    };

    cargarUnidad();
  };

  return (
    <div className="bgads">
      <Position position={1} />

      <div className="ms-5 me-5">
        <div className="row">
          <div className="col-md-8 jumbotron">
            <h5>Filtro para Licencias pendientes de Tramitar</h5>
            <p>
              En esta pantalla se muestran todas las licencias médicas que usted tiene pendiente de
              tramitación.
            </p>
          </div>
          <div className="col-md-4">
            <label className="float-end" style={{ cursor: 'pointer', color: 'blue' }}>
              Manual
            </label>
            <br />
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-3">
            <label className="form-label">
              <b>Folio</b>
            </label>
            <input
              type="text"
              name="folio"
              className="form-control"
              value={folio}
              onInput={onInputChange}
            />
            <small id="rutHelp" className="form-text text-muted" style={{ fontSize: '10px' }}>
              Debe incluir el dígito verificador sin guion
            </small>
          </div>
          <div className="col-md-3">
            <label className="form-label">
              <b>RUN Persona Trabajadora</b>
            </label>
            <input
              type="text"
              className="form-control"
              name="run"
              value={run}
              maxLength={11}
              onInput={onInputValidRut}
            />
          </div>

          <div className="col-md-3">
            <label>
              <b>Fecha emisión Desde</b>
            </label>
            <input
              type="date"
              className="form-control"
              name="fdesde"
              value={fdesde}
              onInput={onInputChange}
            />
            <small
              id="rutHelp"
              className="form-text text-muted"
              style={{ fontSize: '10px' }}></small>
          </div>
          <div className="col-md-3">
            <label>
              <b>Fecha emisión Hasta</b>
            </label>
            <input
              type="date"
              className="form-control"
              name="fhasta"
              value={fhasta}
              onInput={onInputChange}
            />
            <small
              id="rutHelp"
              className="form-text text-muted"
              style={{ fontSize: '10px' }}></small>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-3">
            <label>
              <b>Entidad Empleadora</b>
            </label>
            <select
              className="form-select"
              name="entidademp"
              value={eempleador}
              onChange={onChangeEmp}>
              <option value={''}>Seleccionar</option>
              {entidadEmp.length > 0 ? (
                entidadEmp.map((value) => (
                  <option key={value.rutempleador} value={value.rutempleador}>
                    {value.razonsocial}
                  </option>
                ))
              ) : (
                <></>
              )}
            </select>
          </div>
          <div className="col-md-3">
            <div style={{ display: UnidadRRHH.length > 0 ? '' : 'none' }}>
              <label>
                <b>Unidad RRHH</b>
              </label>
              <select className="form-select">
                <option value={''}>Seleccionar</option>
                {UnidadRRHH.length > 0 ? (
                  UnidadRRHH.map((value) => (
                    <option key={value.idunidad} value={value.idunidad}>
                      {value.unidad}
                    </option>
                  ))
                ) : (
                  <></>
                )}
              </select>
            </div>
          </div>

          <div className={'col-md-2 ' + styles.btnbottom}>
            <div className="d-grid">
              <button className="btn btn-primary">Filtrar</button>
            </div>
          </div>
        </div>

        <hr />

        <div className="row text-center">
          <h5>BANDEJA DE TRAMITACIÓN</h5>
        </div>
        <br />
        <div className="row text-end">
          <div className="col-md-12">
            <div className={`text-start ${styles.filtrocolor}`}>
              <span
                style={{ height: '25px', marginLeft: '4px', cursor: 'pointer' }}
                className={`${styles.circlegreen}`}></span>
              &nbsp;<label style={{ cursor: 'pointer' }}>Por Tramitar</label>
            </div>
            <div className={`text-start ${styles.filtrocolor}`}>
              <span
                style={{ height: '25px', marginLeft: '4px', cursor: 'pointer' }}
                className={`${styles.circleyellow}`}></span>
              &nbsp;<label style={{ cursor: 'pointer' }}>Por Vencer</label>
            </div>
            <div className={`text-start ${styles.filtrocolor}`}>
              <span
                style={{ height: '25px', marginLeft: '4px', cursor: 'pointer' }}
                className={`${styles.circlered}`}></span>
              &nbsp;<label style={{ cursor: 'pointer' }}>Vencido</label>
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-12">
            <Table className="table table-hover table-striped">
              <Thead>
                <Tr className={`text-center ${styles['text-tr']}`}>
                  <Th>FOLIO</Th>
                  <Th>ESTADO</Th>
                  <Th>ENTIDAD EMPLEADORA</Th>
                  <Th>PERSONA TRABAJADORA</Th>
                  <Th>DESCRIPCIÓN</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr></Tr>
              </Tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TramitacionPage;
