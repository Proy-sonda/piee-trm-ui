'use client'
import { useForm } from '@/app/hooks/useForm';
import styles from './Login.module.css'
import { useContext, useState } from 'react';
import { AuthContext } from '@/app/contexts/AuthContext';
import { UsuarioLogin } from '@/app/contexts/interfaces/types';
import Swal from 'sweetalert2';
import { Modal, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { setCookie } from 'nookies';




type appsProps = {
    buttonText: string;
}

type changePass = {

    rutusuario: string,
    claveanterior: string,
    clavenuevauno: string,
    clavenuevados: string
  
  }



export const LoginComponent: React.FC<appsProps> = ({ buttonText = 'Ingresar' }) => {

    const router = useRouter();

    const [show, setShow] = useState('');
    const [display, setDisplay] = useState('none');
    const [showModalRecu, setShowModalRecu] = useState(false);
    const [showModalRecu2, setshowModalRecu2] = useState(false)

     
    const handleShowModalRecu = () => {
        setShowModalRecu(true);
    };
    const handleCloseModalRecu = () => {
        setShowModalRecu(false);
    };
    const handleCloseModalRecu2 = ()=> {
        setshowModalRecu2(false)
    }
    const handleShowModalRecu2 = ()=> {
        setshowModalRecu2(true);
    }
    



    const { login } = useContext(AuthContext)

    const { rutusuario, clave, claveanterior, clavenuevauno, clavenuevados, rutrecu, onInputChange, onInputValidRut } = useForm({
        claveanterior:'',
        clavenuevauno:'',
        clavenuevados:'',
        rutusuario: '',
        clave: '',
        rutrecu: '',
    });




    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let usuario: UsuarioLogin = {
            rutusuario,
            clave
        }

        if(!rutusuario || !clave) return Swal.fire('Error','Debe completar los campos', 'error');

        let respuesta: any = await login(usuario);
        
        if(respuesta?.resp == undefined ) return Swal.fire('Error', 'Ocurrió un problema en el sistema', 'error')

        let messageError: string = '';
        if (respuesta.resp?.statusCode == 400) {
            respuesta.resp.message.map((message: string) => {
                if (message == "rutusuario|invalido") messageError += `<br/> Rut Invalido`;
            });
        };

        if (respuesta.resp.statusCode == 401) {
            if (respuesta.resp.message == 'Login/Password invalida') messageError += 'Contraseña invalida'
        }

        if (respuesta.resp?.statusCode == 412) {
            if (respuesta.resp.message == 'Autenticación Transitoria') {
                setShow('show');
                setDisplay('block');

            }
        }

        if(respuesta.resp.statusCode == 200){
            if(respuesta.resp.message.includes('Bearer')) {
                setCookie(null,'token',respuesta.resp.message, { maxAge: 3600, path: '/' });
                return Swal.fire({
                    html:'Sesión iniciada correctamente',
                    icon:'success',
                    timer:2000,
                    showConfirmButton:false,
                    willClose:()=>  router.push('/tramitacion')
                    
                })
            }

            


        }

        if (messageError != '') Swal.fire({ title: 'Error', icon: 'error', html: messageError, confirmButtonColor: '#225F9D' });

    };

   


    const ChangeTemporal = async ()=> {

        if(!claveanterior) return Swal.fire('Error','Debe ingresar clave transitoria','error');
        if(clavenuevauno != clavenuevados) return Swal.fire('Error','Las contraseñas deben coincidir', 'error');
        let PostVal:changePass ={
            rutusuario: rutusuario,
            claveanterior:claveanterior,
            clavenuevauno:clavenuevauno,
            clavenuevados:clavenuevados
        }


        const resp = await fetch('http://10.153.106.88:3000/auth/change',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(PostVal)
        });

        if (resp.ok) return Swal.fire({
            html: 'Contraseña actualizada correctamente, vuelva a iniciar sesión', icon: 'success', timer: 2000, showConfirmButton: false,
            willClose: () => {
                OncloseModal();
            }
        });


    }

    const validaRut = async ()=> {
        if(rutrecu == '') return Swal.fire({html:'El campo RUT no puede estar vació', icon:'error', timer: 2000, showConfirmButton:false});
        
        handleCloseModalRecu();
        const data = await fetch('http://10.153.106.88:3000/auth/recover',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rutusuario: rutrecu
            })
        });
        if(data.ok) return handleShowModalRecu2();

        const resp = await data.json();
        if(resp.statusCode == 401) return Swal.fire({html:resp.message, icon:'error', showConfirmButton:false, timer:2000});
        

    }

    const OncloseModal = ()=>  {
        setShow('');
        setDisplay('none');
    }




    return (
        <>

            <div className={`modal fade ${show}`} style={{display:display}} id="modalclavetransitoria" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Clave Transitoria</h1>
                            <button type="button" onClick={OncloseModal} className="btn-close" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <h6>Tu cuenta posee con una clave transitoria, completa el siguiente formulario para activar tu cuenta.</h6>
                            <br/>
                            <label htmlFor='transitoria'>Contraseña transitoria</label>
                            <input id='transitoria' name='claveanterior' value={claveanterior} onChange={onInputChange} type='password' className='form-control'/>
                            <br/>
                            <label htmlFor='claveuno'>Contraseña Nueva</label>
                            <input name='clavenuevauno' value={clavenuevauno} onChange={onInputChange} id='claveuno' type='password' className='form-control'/>
                            <br/>
                            <label htmlFor='claveuno'>Repetir Contraseña</label>
                            <input name='clavenuevados' value={clavenuevados} onChange={onInputChange} id='claveuno' type='password' className='form-control'/>



                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={OncloseModal}>Cerrar</button>
                            <button type="button" className="btn btn-primary" onClick={ChangeTemporal}>Actualizar</button>
                        </div>
                    </div>
                </div>
            </div>



            <form onSubmit={handleSubmit} className={styles.formlogin}>
                <label style={{
                    textAlign: 'justify',
                    textJustify: 'inter-word',
                    fontSize: '15px'

                }}>Ingresa tus credenciales de acceso al Portal Único Empleadores</label>
                <br />
                <div className='mb-3 mt-3'>
                    <label htmlFor="username">RUN Persona Usuaria:</label>
                    <input
                        type="text"
                        name="rutusuario"
                        className='form-control'
                        value={rutusuario}
                        onChange={onInputValidRut}
                        maxLength={11}
                        required
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor="password">Clave de acceso:</label>
                    <input
                        type="password"
                        name="clave"
                        className='form-control'
                        value={clave}
                        onChange={onInputChange}
                        required
                    />
                </div>
                <div className={'mt-2 ' + styles.btnlogin}>
                    <label style={{
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        color: 'blue',
                        marginRight: '50px'
                    }}  onClick={handleShowModalRecu}>Recuperar clave de acceso</label> &nbsp;
                    <button type="submit" className={'btn btn-primary'}>{buttonText}</button>
                </div>
            </form>


            <Modal show={showModalRecu} onHide={handleCloseModalRecu} backdrop="static"
                keyboard={false}>
                <Modal.Header closeButton >
                    <Modal.Title>Recuperar Clave de acceso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Escriba su rut para solicitar una nueva clave de acceso</p>
                    <div className='row'>
                        <div className='col-md-12'>
                            <label>Por favor ingresa tu RUT</label>
                            <input type='text' className='form-control' name='rutrecu' value={rutrecu} onChange={onInputValidRut} autoComplete='off'/>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalRecu}>Cerrar</Button>
                    <button type="button" className="btn btn-primary" onClick={validaRut}>Recuperar Clave</button>
                </Modal.Footer>

            </Modal>

            <Modal show={showModalRecu2} onHide={handleCloseModalRecu2} backdrop='static' keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Recuperar Clave de acceso</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className='row text-center' style={{
                        textAlign: 'justify'
                    }}>

                        <p>¡Felicitaciones!</p>
                        <p>Hemos creado tu clave para acceder al Nuevo Portal</p>
                        <p>Esta clave tiene una vigencia de 48 horas</p>



                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <button onClick={handleCloseModalRecu2} className='btn btn-primary'>Aceptar</button>
                </Modal.Footer>


            </Modal>
           

           


        </>
    )
}
