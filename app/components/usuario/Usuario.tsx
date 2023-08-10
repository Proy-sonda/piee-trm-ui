


type myAppProps = {
    usuario: string
}




const Usuario: React.FC<myAppProps> = ({ usuario }) => {
    return (
        <div className="collapse navbar-collapse" id="navbarText" style={{
            marginRight:'25px'
        }}>

            <div className="nav navbar-nav navbar-right hidden-xs text-light" style={{ fontSize: '14px' }}>
                <span className="pull-left user-top">
                    <p className="mT10 ng-binding ng-scope">
                        {/* <h1><i className="bi bi-person-circle"></i></h1> */}
                        <p><span className="fw-semibold" style={{
                                    whiteSpace:'nowrap'
                            }}>
                            Te damos la bienvenida
                            <p style={{
                                    whiteSpace:'nowrap'
                            }}><li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="true">
                            {usuario}
                            </a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#Editacc">Editar Cuenta</a></li>
                                {/* <li><hr className="dropdown-divider"/></li> */}
                                {/* <li><a className="dropdown-item" href="#">Cerrar Sesión</a></li> */}
                                {/* <li><a className="dropdown-item" href="#">Something else here</a></li> */}
                            </ul>
                        </li></p>
                            

                        </span></p>

                    </p>
                    <p>
                        <a className="link-light" href="/logout">
                            Cerrar Sesión
                        </a>
                    </p>
                </span>
            </div>
        </div>
    )
}




export default Usuario;
