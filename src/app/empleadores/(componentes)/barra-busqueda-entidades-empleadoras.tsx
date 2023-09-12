import React, { useState } from 'react';

interface BarraBusquedaEntidadesEmpleadorasProps {
  onBuscar: (rut: string, razonSocial: string) => void;
}

const BarraBusquedaEntidadesEmpleadoras: React.FC<BarraBusquedaEntidadesEmpleadorasProps> = ({
  onBuscar,
}) => {
  const [rut, setRut] = useState('');
  const [razonSocial, setRazonSocial] = useState('');

  return (
    <>
      <form className="row g-2 align-items-end">
        <div className="col-12 col-md-3 col-xxl-2">
          <label id="rutBuscar" className="form-label">
            RUT
          </label>
          <input
            type="text"
            id="rutBuscar"
            className="form-control"
            value={rut}
            onInput={(e) => setRut(e.currentTarget.value)}
          />
        </div>

        <div className="col-12 col-md-3 col-xxl-2">
          <label id="razonSocialBuscar" className="form-label">
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
            <button
              type="button"
              className="btn btn-success mt-3 mt-md-0"
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
