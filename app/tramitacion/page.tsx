'use client'

import { LoginComponent } from "../components/login/LoginComponent";
import jwt_decode from "jwt-decode";
import { useEffect, useContext, useState } from 'react';
import { parseCookies } from 'nookies';
import { CompruebaToken } from "../helpers/adscripcion/LoginUsuario";
import Position from "../components/stage/Position";
import { AuthContext } from "../contexts";
import { useForm } from "../hooks/useForm";
import useCombo from "../hooks/useCombo";
import styles from './tramitacion.module.css'
import { Empleador } from "../empleadores/interface/empleador";
import { ComboEntidadEmpleador, cargaUnidadrrhh } from "../helpers/tramitacion/empleadores";
import { Unidadrhh } from "../interface/tramitacion";



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
    urrhh: ''

  });
  let cookie = parseCookies();
  let token = '';
  token = cookie.token;
  
  useEffect(() => {
    
    let data: any = jwt_decode(token);

    CompletarUsuario(data);

    const EntidadEmpleadora = async ()=> {

      let resp:Empleador[] = await ComboEntidadEmpleador();

      setEntidadEmp(resp);
    }

    EntidadEmpleadora();


  }, [token])
  




  if (token == '') return <LoginComponent buttonText="Ingresar" />

  token = token?.replaceAll('Bearer ', '');
  

  CompruebaToken(token);

  const onChangeEmp = (event:any)=> {
    
    let value = event.target.value;
    seteempleador(value);
    if(value == '') return;
    const cargarUnidad = async ()=> {
      const resp:Unidadrhh[] = await cargaUnidadrrhh(value);
      setUnidadRRHH(resp);

    }

    cargarUnidad();

  }

  return (
    <div className="bgads">

      <Position position={1} />

      <div className="ms-5 me-5">
        <div className="row">
          <div className="col-md-8 jumbotron">
            <h5>Filtro para Licencias pendientes de Tramitar</h5>
            <p>En esta pantalla se muestran todas las licencias médicas que usted tiene pendiente de tramitación.</p>
          </div>
          <div className='col-md-4'>
            <label className="float-end" style={{ cursor: 'pointer', color: 'blue' }}>Manual</label><br />
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-3">
            <label className="form-label"><b>Folio</b></label>
            <input
              type="text"
              name='folio'
              className="form-control"
              value={folio}
              onInput={onInputChange} />
            <small id="rutHelp" className="form-text text-muted" style={{ fontSize: '10px' }}>Debe incluir el dígito verificador sin guion</small>
          </div>
          <div className="col-md-3">
            <label className="form-label"><b>RUN Persona Trabajadora</b></label>
            <input type="text"
              className="form-control"
              name="run"
              value={run}
              maxLength={11}
              onInput={onInputValidRut} />
          </div>

          <div className="col-md-3">
            <label><b>Fecha emisión Desde</b></label>
            <input
              type="date"
              className="form-control"
              name="fdesde"
              value={fdesde}
              onInput={onInputChange} />
            <small id="rutHelp" className="form-text text-muted" style={{ fontSize: '10px' }}></small>
          </div>
          <div className="col-md-3">
            <label><b>Fecha emisión Hasta</b></label>
            <input
              type="date"
              className="form-control"
              name="fhasta"
              value={fhasta}
              onInput={onInputChange} />
            <small id="rutHelp" className="form-text text-muted" style={{ fontSize: '10px' }}></small>
          </div>

        </div>

        <div className="row mt-3">
          <div className="col-md-3">
            <label><b>Entidad Empleadora</b></label>
            <select className="form-select" name="entidademp" value={eempleador} onChange={onChangeEmp}>
              <option value={''}>Seleccionar</option>
              { 
                (entidadEmp.length > 0) ?
              
                entidadEmp.map((value)=> (
                <option key={value.rutempleador} value={value.rutempleador}>
                  {value.razonsocial}
                </option>
                ))
                :
                
                <></>

              }
                
            </select>
          </div>
          <div className="col-md-3">
            <div style={{display:UnidadRRHH.length > 0 ? '':'none' }}>
              <label><b>Unidad RRHH</b></label>
              <select className="form-select">
                <option value={''}>Seleccionar</option>
                {

                  (UnidadRRHH.length > 0) ? 
                  
                    UnidadRRHH.map((value) => (
                      <option key={value.idunidad} value={value.idunidad}>{value.unidad}</option>
                    ))
                  
                    :
                    <></>
                }
              </select>

            </div>
          </div>

          <div className={"col-md-2 " + styles.btnbottom}>
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
              <span style={{ height: '25px', marginLeft: '4px', cursor: 'pointer' }} className={`${styles.circlegreen}`}></span>
              &nbsp;<label style={{ cursor: 'pointer' }}>Por Tramitar</label>
            </div>
            <div className={`text-start ${styles.filtrocolor}`}>
              <span style={{ height: '25px', marginLeft: '4px', cursor: 'pointer' }} className={`${styles.circleyellow}`}></span>
              &nbsp;<label style={{ cursor: 'pointer' }}>Por Vencer</label>
            </div>
            <div className={`text-start ${styles.filtrocolor}`}>
              <span style={{ height: '25px', marginLeft: '4px', cursor: 'pointer' }} className={`${styles.circlered}`}></span>
              &nbsp;<label style={{ cursor: 'pointer' }}>Vencido</label>
            </div>
          </div>

        </div>

        <div className="row mt-3">

          <div className="col-md-12">
            <table className="table table-hover table-striped">
              <thead>
                <tr className={`text-center ${styles['text-tr']}`}>

                  <th>FOLIO</th>
                  <th>ESTADO</th>
                  <th>ENTIDAD EMPLEADORA</th>
                  <th>PERSONA TRABAJADORA</th>
                  <th>DESCRIPCIÓN</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr></tr>
              </tbody>
            </table>
          </div>

        </div>

      </div>


    </div>
  )
}



export default TramitacionPage;
