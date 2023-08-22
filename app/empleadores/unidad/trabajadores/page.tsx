'use client'
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import 'animate.css';
import Stage from '@/app/components/stage/Stage'
import styles from './trabajadores.module.css'
import { getDatoUnidad } from '@/app/helpers/tramitacion/empleadores';
import { AgregarTrabajador, Trabajador, Trabajadores } from './(modelos)/trabajadores';
import { Unidadrhh } from '@/app/interface/tramitacion';
import Swal from 'sweetalert2';
import { createTrabajador, deleteTrabajador, getTrabajadorUnidad, getUnidadEmpleador, putTrabajador } from './(servicios)/trabajadores.services';
import { Modal } from 'react-bootstrap';
import { ClipLoader } from 'react-spinners';
import { UnidadEmpleador } from './(modelos)/unidadEmpleador';
import { useForm } from '@/app/hooks/useForm';


interface props {
    searchParams: {
        idunidad: number;
        razon: string;
        rutempleador:string
    };

}



const TrabajadoresPage: React.FC<props> = ({ searchParams }: props) => {


    const [unidad, setunidad] = useState('')
    const [unidadEmpleador, setunidadEmpleador] = useState<UnidadEmpleador[]>([])
    let [loading, setLoading] = useState(true);
    const { idunidad, razon, rutempleador } = searchParams;
    const [trabajadores, settrabajadores] = useState<Trabajadores[]>([]);
    const [editar, seteditar] = useState<Trabajador>({
        idtrabajador:0,
        unidad:{
            idunidad:0
        }
    });
    const [rutedit, setrutedit] = useState<string>()
    const [show, setshow] = useState(false);

    const { run, onInputValidRut } = useForm({
        run:''
    })


    useEffect(() => {

        setLoading(true)
        
        const obtenerTrabajadorUnidad = async () => {
            const data = await getTrabajadorUnidad(Number(idunidad));
            if (data.ok) {
                const resp: Trabajadores[] = await data.json();

                if (resp.length > 0) {
                    settrabajadores(resp);

                }
                setTimeout(() => setLoading(false), 2000); 
            }
        }

        obtenerTrabajadorUnidad();

        const obtenerUnidad = async () => {
            const data = await getDatoUnidad(Number(idunidad));
            if (data.ok) {
                const resp: Unidadrhh = await data.json();
                setunidad(resp.unidad)
            }
        }
        obtenerUnidad();

    }, []);

    const handleEditTrabajador = (idtrabajador:number, idunidad:number, ruttrabajador:string)=> {

        seteditar({
            idtrabajador: idtrabajador,
            unidad:{
                idunidad: idunidad
            }
        });

        setrutedit(ruttrabajador);

        const ObtenerUnidadesEmpleador = async()=> {
            const data = await getUnidadEmpleador(rutempleador);
            if(data.ok){
                const resp:UnidadEmpleador[] = await data.json();
                setunidadEmpleador(resp);
            }
        }

        ObtenerUnidadesEmpleador();

        setshow(true);
    }

    const handleClose = ()=> setshow(false);

    const handleDeleteTrabajador = (idtrabajador: number, rut:string) => {
        const EliminarTrabajador = async () => {
            const data = await deleteTrabajador(idtrabajador);
            
            if (data.ok) {
                const dataund = await getTrabajadorUnidad(Number(idunidad));
                if (data.ok) {
                    const resp: Trabajadores[] = await dataund.json();
                    (resp.length > 0) ? settrabajadores(resp) : settrabajadores([]);
                }
                return Swal.fire({ html: `Persona trabajadora ${rut} fue eliminada con éxito`, icon: 'success', timer: 2000, showConfirmButton: false });
            }
            Swal.fire({html: 'Ha ocurrido un problema', icon: 'error'})
        }
        Swal.fire({
            title: `¿Desea eliminar a la persona trabajadora ${rut}?`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Si',
            denyButtonText: `No`,
        }).then((result) => { if (result.isConfirmed) EliminarTrabajador()})
    }

    const handleChangeUnidad = (event : ChangeEvent<HTMLSelectElement>)=> {
        seteditar({
            idtrabajador:editar?.idtrabajador,
            unidad:{
                idunidad: Number(event.target.value)
            }
        });
    }

    const handleSubmitEdit = ()=>{
        console.log('test')

        const ActualizaTrabajador = async ()=>{
            const data = await putTrabajador(editar);
            if(data.ok) {
                Swal.fire({html:'Trabajador modificado con éxito', icon:'success', timer:2000, showConfirmButton:false});
                setshow(false)
                const obtenerTrabajadorUnidad = async () => {
                    const data = await getTrabajadorUnidad(Number(idunidad));
                    if (data.ok) {
                        const resp: Trabajadores[] = await data.json();
        
                        if (resp.length > 0) {
                            settrabajadores(resp);
        
                        }
                    }
                }

                obtenerTrabajadorUnidad();

            }else{
                Swal.fire({html:'Se ha producido un error', icon:'error'})
            }

        }
        
        ActualizaTrabajador();


    }

    const handleAddTrabajador = (e: FormEvent)=> {
        e.preventDefault();

        const dataAgregarTrabajador:AgregarTrabajador ={
            ruttrabajador: run,
            unidad:{
                idunidad:Number(idunidad)
            },
        }

        const crearTrabajador = async()=> {
            const data = await createTrabajador(dataAgregarTrabajador);
            if(data.ok){
                Swal.fire({html:'Persona trabajadora agregada correctamente', icon:'success',timer:2000, showConfirmButton:false});
                const obtenerTrabajadorUnidad = async () => {
                    const data = await getTrabajadorUnidad(Number(idunidad));
                    if (data.ok) {
                        const resp: Trabajadores[] = await data.json();
        
                        if (resp.length > 0) {
                            settrabajadores(resp);
        
                        }
                        setTimeout(() => setLoading(false), 2000); 
                    }

                }
                obtenerTrabajadorUnidad();

            }else{
                Swal.fire({html: 'Existe un problema al momento de grabar '+ await data.text(), icon:'error'})
            }
        }

        crearTrabajador();

    }

    return (<>
    <div className={"spinner"} style={{
                display: (loading ? '' : 'none')
            }}>

                <ClipLoader
                    color={"var(--color-blue)"}
                    loading={loading}
                    size={150}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />

    </div>
    
        <div className='bgads' style={{
            display: (loading) ? 'none' :''
        }}>
            <div className='me-5 ms-5 animate__animate animate__fadeIn'>

                <div className="row mt-2">
                    <div className="col-md-8">
                        <Stage manual="" url="#">
                            Entidad Empleadora / Dirección y Unidades RRHH - {razon} / Trabajadores - {unidad}
                        </Stage>
                    </div>

                    <div className="col-md-4">
                        <label style={{ cursor: 'pointer', color: 'blue' }}>Manual</label>
                        <br />
                    </div>
                </div>


                <div className='row mt-2'>

                    <div className='col-md-6'>
                        <h5>
                            Cargar Trabajadores
                        </h5>
                        <sub style={{ color: 'blue' }}>Agregar Persona Trabajadora</sub>
                        <br />
                        <form onSubmit={handleAddTrabajador}>
                            <div className='row mt-2'>
                                <div className='col-md-8'>
                                    <label htmlFor='run'>RUN</label>
                                    <input id='run' 
                                    type='text' 
                                    className='form-control' 
                                    minLength={4} 
                                    maxLength={11} 
                                    name='run' 
                                    value={run} 
                                    onChange={onInputValidRut} 
                                    required />
                                    
                                </div>
                                <div className='col-md-4' style={{
                                    alignSelf: 'end'
                                }}>
                                    <button type='submit' className='btn btn-success'>Agregar</button>
                                </div>

                            </div>
                        </form>
                    </div>

                    <div className='col-md-6'>
                        <h5>Cargar Nómina</h5>
                        <sub>Para poder cargar trabajadores de la unidad <b>{unidad}</b>, solo tiene que seleccionar un archivo (formato CSV) según el <span className={styles['span-link']}>siguiente formato</span></sub>
                        <div className='row mt-2'>
                            <div className='col-md-6'>
                                <input type='file' className='form-control' />
                            </div>

                            <div className='col-md-6'>
                                <div className='d-grid gap-2 d-md-flex'>

                                    <button className='btn btn-success'>Cargar</button>
                                    <button className='btn btn-danger'>Borrar todo</button>
                                </div>
                            </div>
                        </div>


                    </div>

                </div>

                <div className='row mt-2'>

                    <h5>Trabajadores</h5>
                    <br />
                    <div className='col-md-6'>

                        <table className='table table-striped'>
                            <thead className='align-middle text-center'>
                                <tr>
                                    <th>
                                        Run
                                    </th>
                                    <th>
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='align-middle text-center'>
                                {
                                    trabajadores.length > 0
                                        ? trabajadores.map(({ ruttrabajador, idtrabajador }) => (
                                            <tr key={ruttrabajador}>
                                                <td>
                                                    {ruttrabajador}
                                                </td>
                                                <td>
                                                    <button className='btn btn-sm btn-primary' onClick={()=> handleEditTrabajador(idtrabajador, idunidad, ruttrabajador, )}><i title={`editar ${ruttrabajador}`} className={"bi bi-pencil-square"}></i></button>
                                                    &nbsp;
                                                    <button className='btn btn-sm btn-danger' onClick={() => handleDeleteTrabajador(idtrabajador, ruttrabajador)}><i title={`eliminar ${ruttrabajador}`} className={"bi bi-trash btn-danger"}></i></button>
                                                </td>
                                            </tr>
                                        ))
                                        : <tr>
                                            <td>
                                                -
                                            </td>
                                            <td>-</td>
                                        </tr>
                                }
                            </tbody>

                        </table>

                    </div>


                </div>



            </div>
            
                <Modal show={show} onHide={handleClose} >
                    <Modal.Header closeButton>
                        <Modal.Title>Modificar Persona Trabajadora</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                        <div className='row'>
                            <div className='col-md-6'>
                                <label>Run</label>
                                <input type='text' className='form-control' disabled value={rutedit} onChange={(e) => e.preventDefault} />
                            </div>
                            <div className='col-md-6'>
                                <label>Unidad</label>
                                <select className='form-select' value={editar?.unidad.idunidad} onChange={handleChangeUnidad}>
                                    <option value={''}>Seleccionar</option>
                                    {
                                        unidadEmpleador.length > 0
                                            ? unidadEmpleador.map(({ idunidad, unidad }) => <option key={idunidad} value={idunidad}>{unidad}</option>)
                                            : <></>
                                    }
                                </select>
                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <button type='submit' className='btn btn-primary' onClick={()=> handleSubmitEdit()}>Modificar</button> &nbsp;
                        <button className='btn btn-sucess'>Volver</button>
                    </Modal.Footer>
                </Modal>
            
        </div>
        </>
    )
}



export default TrabajadoresPage;




