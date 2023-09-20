'use client';

import { AuthContext } from '@/contexts';
import { logout } from '@/servicios/auth';
import { useRouter } from 'next/navigation';
import { FormEvent, useContext } from 'react';
import Swal from 'sweetalert2';

const Usuario: React.FC = () => {
  const { datosusuario, resetearUsuario } = useContext(AuthContext);

  const router = useRouter();

  const handleLogout = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await logout();

      resetearUsuario();

      router.push('/');
    } catch (error) {
      console.error('ERROR EN LOGOUT: ', error);

      Swal.fire({ html: 'Error al desloguear', timer: 2000 });
    }
  };

  return (
    <div
      id="navbarText"
      style={{
        marginRight: '25px',
        display: datosusuario.exp == 0 ? 'none' : '',
      }}>
      <div
        className="nav navbar-nav navbar-right hidden-xs text-light d-sm-none d-md-block"
        style={{ fontSize: '14px' }}>
        <span className="pull-left user-top">
          <div className="mT10 ng-binding ng-scope">
            <span
              className="fw-semibold"
              style={{
                whiteSpace: 'nowrap',
              }}>
              Te damos la bienvenida
              <div
                style={{
                  whiteSpace: 'nowrap',
                }}>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="true">
                    {datosusuario.user.email}
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#Editacc">
                        Editar Cuenta
                      </a>
                    </li>
                  </ul>
                </li>
              </div>
            </span>
          </div>
          <div>
            <a
              className="link-light"
              onClick={handleLogout}
              style={{
                cursor: 'pointer',
              }}>
              Cerrar Sesión
            </a>
          </div>
        </span>
      </div>
    </div>
  );
};

export default Usuario;
