import { GuiaUsuario } from '@/components/guia-usuario';
import { AuthContext } from '@/contexts';
import React, { useContext, useRef, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { formatRut, validateRut } from 'rutlib';

interface BarraBusquedaEntidadesEmpleadorasProps {
  onBuscar: (rut: string, razonSocial: string) => void;
}

const BarraBusquedaEntidadesEmpleadoras: React.FC<BarraBusquedaEntidadesEmpleadorasProps> = ({
  onBuscar,
}) => {
  const [rut, setRut] = useState('');
  const {
    datosGuia: { listaguia, guia, AgregarGuia },
  } = useContext(AuthContext);
  const [razonSocial, setRazonSocial] = useState('');
  const [error, seterror] = useState(false);
  const target = useRef(null);

  return (
    <>
      <GuiaUsuario guia={listaguia[0]!?.activo && guia} target={target} placement="top-start">
        Filtro para buscar Entidades Empleadoras por RUT o Razón Social
      </GuiaUsuario>
      <form
        className={`row g-2 align-items-end ${
          listaguia[0]!?.activo && guia ? 'overlay-marco' : ''
        }`}
        ref={target}>
        <div className="col-12 col-md-3 col-xxl-2 position-relative">
          <label className="form-label" htmlFor="rutBuscar">
            <span>RUT</span>
            {
              <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={(props) => (
                  <Tooltip id="button-tooltip" {...props}>
                    {'Se debe ingresar sin puntos y con guión (Ej: 123456-7)'}
                  </Tooltip>
                )}>
                <i className="ms-2 text-primary bi bi-info-circle" style={{ fontSize: '16px' }}></i>
              </OverlayTrigger>
            }
          </label>
          <input
            type="text"
            id="rutBuscar"
            className={`form-control ${error ? 'is-invalid' : ''}`}
            value={rut}
            onInput={(e) => setRut(e.currentTarget.value)}
            onBlur={(e) => {
              if (e.target.value.length > 8) {
                if (!validateRut(e.target.value)) {
                  seterror(true);
                } else {
                  seterror(false);
                }
                setRut(formatRut(e.target.value, false));
              } else {
                setRut(e.target.value);
                seterror(false);
              }
            }}
          />
          {error && <div className="invalid-tooltip">Debe ingresar un RUT válido</div>}
        </div>

        <div className="col-12 col-md-3 col-xxl-2">
          <label htmlFor="razonSocialBuscar" className="form-label">
            Razón Social
          </label>
          <input
            type="text"
            id="razonSocialBuscar"
            className="form-control"
            value={razonSocial}
            onInput={(e) => setRazonSocial(e.currentTarget.value)}
          />
        </div>

        <div className="col-12 col-md-6 col-xxl-8">
          <div className="d-flex flex-column flex-md-row justify-content-md-between">
            <button
              type="submit"
              className="btn btn-primary mt-2 mt-md-0"
              onClick={(e) => {
                e.preventDefault();
                onBuscar(rut, razonSocial);
              }}>
              Buscar
            </button>

            <GuiaUsuario
              guia={listaguia[0]!?.activo && guia}
              target={target}
              placement="bottom-end">
              Botón para inscribir una nueva Entidad Empleadora en el sistema <br />
              <div className="text-end mt-2">
                <button
                  className="btn btn-sm text-white"
                  onClick={() => {
                    AgregarGuia([
                      {
                        indice: 0,
                        nombre: 'Filtro de búsquedaa',
                        activo: false,
                      },
                      {
                        indice: 1,
                        nombre: 'Tabla Entidad Empleadora',
                        activo: true,
                      },
                    ]);
                  }}
                  style={{
                    border: '1px solid white',
                  }}>
                  Continuar &nbsp;
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </GuiaUsuario>

            <button
              type="button"
              className={`btn btn-success mt-3 mt-md-0 ${
                listaguia[0]!?.nombre.includes('Filtro') && guia ? 'overlay-marco' : ''
              }'}`}
              data-bs-toggle="modal"
              data-bs-target="#Addsempresa">
              Inscribe Entidad Empleadora
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default BarraBusquedaEntidadesEmpleadoras;
