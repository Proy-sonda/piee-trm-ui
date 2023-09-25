'use client';

import { AuthContext } from '@/contexts';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Swal from 'sweetalert2';
import IfContainer from '../if-container';

const Usuario: React.FC = () => {
  const { datosUsuario, logout } = useContext(AuthContext);

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();

      router.push('/');
    } catch (error) {
      console.error('ERROR EN LOGOUT: ', error);

      Swal.fire({ html: 'Error al desloguear', timer: 2000 });
    }
  };

  const calcularInicialesNombreUsuario = () => {
    if (!datosUsuario) {
      return '';
    }

    const nombreUsuario = datosUsuario.user.nombres.trim();
    const apellidosUsuario = datosUsuario.user.apellidos.trim();

    const inicialNombre = nombreUsuario === '' ? '' : nombreUsuario[0].toUpperCase();
    const inicialApellido = apellidosUsuario === '' ? '' : apellidosUsuario[0].toUpperCase();

    return inicialNombre + inicialApellido;
  };

  return (
    <>
      <IfContainer show={datosUsuario}>
        <Dropdown>
          <OverlayTrigger
            placement="left"
            delay={{ show: 250, hide: 100 }}
            overlay={(props) => (
              <Tooltip id="button-tooltip" {...props}>
                {datosUsuario?.user.nombres + ' ' + datosUsuario?.user.apellidos}
              </Tooltip>
            )}>
            <Dropdown.Toggle
              variant="danger"
              style={{ backgroundColor: 'transparent' }}
              className="p-2 border-0">
              <span
                className="me-1 d-inline-flex align-items-center justify-content-center border border-white border-1 rounded-circle"
                style={{
                  backgroundColor: '#0063aeff',
                  width: '40px',
                  height: '40px',
                  fontSize: '18px',
                }}>
                {calcularInicialesNombreUsuario()}
              </span>
            </Dropdown.Toggle>
          </OverlayTrigger>

          <Dropdown.Menu>
            <Dropdown.Item className="dropdown-item-text">
              <div>
                <small>
                  <b>{datosUsuario?.user.nombres + ' ' + datosUsuario?.user.apellidos}</b>
                </small>
              </div>
              <div>
                <small>{datosUsuario?.user.email}</small>
              </div>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>
              <small>Cerrar Sesión</small>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </IfContainer>
    </>
  );
};

export default Usuario;
