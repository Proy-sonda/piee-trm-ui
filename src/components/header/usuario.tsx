'use client';

import { AuthContext } from '@/contexts';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { Dropdown } from 'react-bootstrap';
import Swal from 'sweetalert2';
import IfContainer from '../if-container';

const Usuario: React.FC = () => {
  const { usuario, ultimaConexion, logout } = useContext(AuthContext);

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

  return (
    <>
      <IfContainer show={usuario}>
        <Dropdown>
          <Dropdown.Toggle
            variant="danger"
            style={{ backgroundColor: 'transparent' }}
            className="p-2 border-0">
            <span className="d-none d-lg-inline-block me-2">{usuario?.nombreCompleto() ?? ''}</span>
            <span
              className="me-1 d-inline-flex align-items-center justify-content-center border border-white border-1 rounded-circle d-lg-none"
              style={{
                backgroundColor: '#0063aeff',
                width: '40px',
                height: '40px',
                fontSize: '17px',
              }}>
              {usuario?.iniciales() ?? ''}
            </span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item className="dropdown-item-text">
              <div>
                <small>
                  <b>{usuario?.nombreCompleto() ?? ''}</b>
                </small>
              </div>
              <div>
                <small>{usuario?.rut ?? ''}</small>
              </div>

              {ultimaConexion && (
                <>
                  <div>
                    <small>
                      Ult. Con.: <i>{format(new Date(ultimaConexion), 'dd/MM/yyyy HH:mm:ss')}</i>
                    </small>
                  </div>
                </>
              )}
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
