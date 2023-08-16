'use client';

import Position from '@/app/components/stage/Position';
import Stage from '@/app/components/stage/Stage';
import { EliminarUnidad, cargaUnidadrrhh, crearUnidad } from '@/app/helpers/tramitacion/empleadores';
import { Unidadrhh } from '@/app/interface/tramitacion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import { useEffect, useState, FormEvent } from 'react';
import Swal from 'sweetalert2';
import { useForm } from '../../hooks/useForm';
import { CCCOMUNACB, CCREGIONCB } from '@/app/contexts/interfaces/types';
import useCombo from '@/app/hooks/useCombo';
import { CrearUnidad } from '../interface/crearUnidad';


interface UnidadRRHHProps {
  searchParams: {
    rut: string;
    razon: string;
    id:string;
  };
}
const initialComuna: CCCOMUNACB[] = [{
  idcomuna: 0,
  nombre: '',
  region: {
      idregion: 0,
      nombre: ''
  }
}]

const UnidadRRHH = ({ searchParams }: UnidadRRHHProps) => {
  const router = useRouter();
  let CCREGION: CCREGIONCB[] = useCombo("/Region/all");
  let CCCOMUNA: CCCOMUNACB[] = useCombo("/comuna/all/region");
  const [region, setregion] = useState<any>();
  const [comunas, setcomuna] = useState(initialComuna);

  const { rut, razon, id } = searchParams;
  const [UnidadRRHH, setUnidadRRHH] = useState<Unidadrhh[]>([]);
  const { nombre, comuna, calle, nrocalle, nrocasa, identificador, telefono, email, remail, onInputChange , onInputChangeOnlyNum} =  useForm ({
      nombre:'',
      comuna:'',
      calle:'',
      nrocalle:'',
      nrocasa:'',
      identificador:'',
      telefono:'',
      email:'',
      remail:''
  })
  

  let cookie = parseCookies();
  let token = cookie.token;

  

  useEffect(() => {
    
    const cargaUnidades = async ()=> {
      const data = await cargaUnidadrrhh(rut);
      setUnidadRRHH(data);
    }
    cargaUnidades();
  }, [])


  const handleDelete = (idunidad:number, unidad:string)=> {
    Swal.fire({
      icon:'warning',
      html:`¿Desea eliminar la unidad: ${unidad}?`,
      showDenyButton: true,
      confirmButtonText:'Si'
    }).then(async (result)=>{
      if(result.isConfirmed){
        const resp = await EliminarUnidad(idunidad);
        if(resp.ok) {
          const cargaUnidades = async ()=> {
            const data = await cargaUnidadrrhh(rut);
            
            setUnidadRRHH(data);
          }
          
          cargaUnidades();
          
          return Swal.fire('Operación realizada con éxito', '', 'success')
        };

        return Swal.fire('Existe un problema, favor contactar administrador', '', 'error');

      }
    })
  }

  const handleSubmit = (e:FormEvent) => {
   
    e.preventDefault();
    const nuevaUnidad:CrearUnidad = {
      empleador:{
        idempleador: Number(id)
      },
      direccionunidad:{
        calle:calle,
        comuna: {
          idcomuna:comuna,
          nombre:comuna
        },
        depto:nrocasa,
        numero:nrocalle
      },
      email:email,
      estadounidadrrhh:{
        idestadounidadrrhh: 1,
        descripcion:'SUSCRITO'
      },
      identificador:identificador,
      telefono:telefono,
      unidad:nombre
    }

    const EnviaSolicitud = async ()=> {

      const resp = await crearUnidad(nuevaUnidad);
      if(resp.ok){
        const cargaUnidades = async ()=> {
          const data = await cargaUnidadrrhh(rut);
          setUnidadRRHH(data);
        }
        cargaUnidades();

        return Swal.fire({html:'Unidad creada con éxito', icon:'success', timer:2000, showConfirmButton:false});
      } 

      return Swal.fire({html:'Existe un problema', icon:'error'})
    }

    EnviaSolicitud();
  }
  const onChangeRegion = (event: any) => {
    setregion(event.target.value);
    CCCOMUNA = CCCOMUNA.filter(({ region: { idregion } }) => idregion == event.target.value);
    setcomuna(CCCOMUNA);
  }

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
              <div className="right">
                <Link href={`/empleadores/datos?rut=${rut}&razon=${razon}&id=${id}`}>
                  Datos Entidad Empleadora
                </Link>{' '}
                &nbsp;
              </div>
              <div className="left right active">
                <Link href={`/empleadores/unidad?rut=${rut}&razon=${razon}&id=${id}`}>Unidad de RRHH</Link>
                &nbsp;
              </div>
              <div className="left">
                <Link href={`/empleadores/usuarios?rut=${rut}&razon=${razon}&id=${id}`}>Usuarios</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-8">
            <Stage manual="" url="#">
              Entidad Empleadora / Dirección y Unidades RRHH - {razon}
            </Stage>
          </div>

          <div className="col-md-4">
            <label style={{ cursor: 'pointer', color: 'blue' }}>Manual</label>
            <br />
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-8"></div>
          <div className="col-md-4 float-end">
            <button
              className="btn btn-success btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#AddURHH">
              + Agregar Unidad RRHH
            </button>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-12">
            <table className="table table-hover">
              <thead className="text-center">
                <tr>
                  <th>Nombre</th>
                  <th>Código</th>
                  <th>Dirección</th>
                  <th>Teléfono</th>
                  <th>Correo electrónico</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="text-center align-middle">

                {
                  (UnidadRRHH.length > 0) ?
                  UnidadRRHH.map( (unidad)=> (
                    <tr key={unidad?.idunidad}>

                      <td>
                        {unidad?.unidad}
                      </td>
                      <td>
                        {unidad?.idunidad}
                      </td>
                      <td>
                        {unidad?.direccionunidad?.numero}
                      </td>
                      <td>
                        {unidad?.telefono}
                      </td>
                      <td>
                        {unidad?.email}
                      </td>
                      <td>
                        <button
                          className="btn text-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#modrrhh">
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button className="btn text-danger" 
                          title={`Eliminar Unidad: ${unidad?.unidad}`}
                          onClick={()=> handleDelete(unidad?.idunidad, unidad?.unidad)}>
                          <i className="bi bi-trash3"></i>
                        </button>
                        <Link
                          href={`/empleadores/trabajadores?unidad=${'Prueba 3'}&id=${'1'}&razon=${razon}`}
                          className="btn btn-success btn-sm">
                          Trabajadores
                        </Link>{' '}
                        &nbsp;
                        <Link
                          href={`/empleadores/usuariosrhh?unidad=${'Prueba 3'}&id=${'1'}&razon=${razon}`}
                          className="btn btn-success btn-sm">
                          Usuarios
                        </Link>
                      </td>

                    </tr>
                  ) )
                  :
                  <tr>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td></td>
                  </tr>
                }

              </tbody>
              <tfoot>
                <nav aria-label="Page navigation example" className="float-end">
                  <div>
                    <ul className="pagination">
                      <li className="page-item">
                        <a className="page-link" href="#">
                          Anterior
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          1
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          2
                        </a>
                      </li>
                      {/* <li className="page-item"><a className="page-link" href="#">3</a></li> */}
                      <li className="page-item">
                        <a className="page-link" href="#">
                          Siguiente
                        </a>
                      </li>
                    </ul>
                  </div>
                </nav>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="AddURHH"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-xl">
        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Crear nueva Unidad RRHH
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"></button>
            </div>
            <div className="modal-body">
              
              
              <div className="row mt-2">
                <div className="col-md-3">
                  <label className="form-text">Nombre</label>
                  <input type="text"
                   className="form-control"
                    name='nombre'
                    value={nombre} 
                    onChange={onInputChange}
                    autoComplete='new-custom-value'
                    required/>
                </div>
                <div className="col-md-3">
                  <label className="form-text">Región</label>
                  <select className="form-select" name='region' value={region} onChange={onChangeRegion} required>
                    <option value={''}>Seleccionar</option>

                    {
                      CCREGION.length> 0
                      ? CCREGION.map(({idregion, nombre})=> <option key={idregion} value={idregion}>{nombre}</option>)
                      : <></>
                    }

                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-text">Comuna</label>
                  <select className="form-select" name='comuna' value={comuna} onChange={onInputChange} required>
                    <option value={''}>Seleccionar</option>
                    {
                      comunas.length > 0
                      ? comunas.map(({idcomuna,nombre})=> <option key={idcomuna} value={idcomuna}>{nombre}</option>)
                      : <></>
                    }
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-text">Calle</label>
                  <input type="text" 
                  className="form-control" 
                  name='calle' 
                  value={calle} 
                  onChange={onInputChange}  
                  autoComplete='new-custom-value'
                  required/>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label className="form-text">N° Calle</label>
                  <input type="text" 
                  className="form-control" 
                  name='nrocalle' 
                  value={nrocalle} 
                  onChange={onInputChange} 
                  autoComplete='new-custom-value'
                  required/>
                </div>
                <div className="col-md-3">
                  <label className="form-text">N° casa/Departamento</label>
                  <input type="text" 
                  className="form-control" 
                  name='nrocasa' 
                  value={nrocasa} 
                  onChange={onInputChange}
                  autoComplete='new-custom-value'
                  required/>
                </div>
                <div className="col-md-3">
                  <label className="form-text">Identificador Único</label>
                  <input type="text" 
                  className="form-control" 
                  name='identificador'
                  value={identificador} 
                  autoComplete='new-custom-value'
                  onChange={onInputChange} 
                  required/>
                </div>

                <div className="col-md-3">
                  <label className="sr-only" htmlFor="tel1">
                    Teléfono
                  </label>
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text">+56</div>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      name="telefono"
                      value={telefono}
                      onChange={onInputChangeOnlyNum}
                      minLength={9}
                      maxLength={9}
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-3">
                  <label>Correo electrónico unidad RRHH</label>
                  <input type="email" 
                  className="form-control" 
                  name='email' 
                  value={email} 
                  onChange={onInputChange} 
                  onPaste={(e)=> e.preventDefault()}
                  required/>
                  <small id="cempleHelp" className="form-text text-muted">
                    ejemplo@ejemplo.cl
                  </small>
                </div>

                <div className="col-md-3">
                  <label>Repetir correo electrónico</label>
                  <input type="email"
                  className="form-control" 
                  name='remail' 
                  value={remail} 
                  autoComplete='new-custom-value'
                  onPaste={(e)=> e.preventDefault()}
                  onChange={onInputChange} 
                  required />
                </div>
              </div>
              
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary" >
                Guardar
              </button>
              <button type="button" className="btn btn-success" data-bs-dismiss="modal">
                Volver
              </button>
            </div>
          </div>
          </form>
        </div>
      </div>

      <div
        className="modal fade"
        id="modrrhh"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Modificar Unidad RRHH
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row mt-2">
                <div className="col-md-3">
                  <label className="form-text">Nombre</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="col-md-3">
                  <label className="form-text">Región</label>
                  <select className="form-select">
                    <option>Seleccionar</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-text">Comuna</label>
                  <select className="form-select">
                    <option>Seleccionar</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-text">Calle</label>
                  <input type="text" className="form-control"/>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label className="form-text">N° Calle</label>
                  <input type="text" className="form-control"/>
                </div>
                <div className="col-md-3">
                  <label className="form-text">N° casa/Departamento</label>
                  <input type="text" className="form-control"/>
                </div>
                <div className="col-md-3">
                  <label className="form-text">Identificador Único</label>
                  <input type="text" className="form-control"/>
                </div>

                <div className="col-md-3">
                  <label className="sr-only" htmlFor="tel1">
                    Teléfono
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
                      
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-3">
                  <label>Correo electrónico unidad RRHH</label>
                  <input type="email" className="form-control" />
                  <small id="cempleHelp" className="form-text text-muted">
                    ejemplo@ejemplo.cl
                  </small>
                </div>

                <div className="col-md-3">
                  <label>Repetir correo electrónico</label>
                  <input type="email" className="form-control" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary">
                Modificar
              </button>
              <button type="button" className="btn btn-success" data-bs-dismiss="modal">
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnidadRRHH;
