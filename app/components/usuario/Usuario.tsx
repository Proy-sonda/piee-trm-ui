'use client'
import { AuthContext } from "@/app/contexts";
import { Logout } from "@/app/helpers/tramitacion/empleadores";
import { useRouter } from "next/navigation";
import { useContext, FormEvent } from 'react';
import Swal from "sweetalert2";


const Usuario: React.FC = () => {
    const { datosusuario, CompletarUsuario } = useContext(AuthContext);

    const router = useRouter();

    const handleLogout = (e:FormEvent)=> {
        e.preventDefault();
        Logout().then((value)=> {
            if(value.ok){
                CompletarUsuario({
                    exp:0,
                    iat:0,
                    user:{
                        nombres:'',
                        apellidos:'',
                        rol:{
                            idrol:0,
                            rol:''
                        },
                        rutusuario:'',
                        email:''

                    }
                })
                return router.push('/');
            }

            Swal.fire({html:value.text(), timer:2000})

        });

    }

    return (
        <div id="navbarText" style={{
            marginRight:'25px',
            display: (datosusuario.exp == 0) ? 'none': ''
        }}>

            <div className="nav navbar-nav navbar-right hidden-xs text-light" style={{ fontSize: '14px' }}>
                <span className="pull-left user-top">
                    <div className="mT10 ng-binding ng-scope">
                        {/* <h1><i className="bi bi-person-circle"></i></h1> */}
                        <span className="fw-semibold" style={{
                                    whiteSpace:'nowrap'
                            }}>
                            Te damos la bienvenida
                            <div style={{
                                    whiteSpace:'nowrap'
                            }}><li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="true">
                            {datosusuario.user.email}
                            </a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#Editacc">Editar Cuenta</a></li>
                            </ul>
                        </li></div>
                            

                        </span>

                    </div>
                    <div>
                        <a className="link-light" onClick={handleLogout}>
                            Cerrar Sesión
                        </a>
                    </div>
                </span>
            </div>
        </div>
    )
}




export default Usuario;
