'use client'
import { useForm } from '@/app/hooks/useForm';
import styles from './Login.module.css'
import { useContext, useState } from 'react';
import { AuthContext } from '@/app/contexts/AuthContext';
import { UsuarioLogin } from '@/app/contexts/interfaces/types';
import Swal from 'sweetalert2';



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

    const [show, setShow] = useState('');
    const [display, setDisplay] = useState('none');
    



    const { login } = useContext(AuthContext)

    const { rutusuario, clave, claveanterior, clavenuevauno, clavenuevados, onInputChange } = useForm({
        claveanterior:'',
        clavenuevauno:'',
        clavenuevados:'',
        rutusuario: '',
        clave: ''
    });




    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let usuario: UsuarioLogin = {
            rutusuario,
            clave
        }

        if(!rutusuario || !clave) return Swal.fire('Error','Debe completar los campos', 'error');

        let respuesta: any = await login(usuario);
        console.log(respuesta);

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


        const resp = await fetch('http://localhost:3000/auth/change',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(PostVal)
        });

        console.log(resp);


    }

    const OncloseModal = ()=> {
        setShow('');
        setDisplay('none');
    }




    return (
        <>

            <div className={`modal fade ${show}`} style={{display:display}} id="modalclavetransitoria" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
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
                        onChange={onInputChange}
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
                    />
                </div>
                <div className={'mt-2 ' + styles.btnlogin}>
                    <label style={{
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        color: 'blue',
                        marginRight: '50px'
                    }} data-bs-toggle="modal" data-bs-target="#ModalRecu" >Recuperar clave de acceso</label> &nbsp;
                    <button type="submit" className={'btn btn-primary'}>{buttonText}</button>
                </div>
            </form>

        </>
    )
}
