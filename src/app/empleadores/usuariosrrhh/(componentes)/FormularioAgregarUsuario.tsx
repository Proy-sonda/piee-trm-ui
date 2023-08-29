import React from 'react';

interface FormularioAgregarUsuarioProps {
  onAgregarUsuario: (run: string) => void;
}

const FormularioAgregarUsuario: React.FC<FormularioAgregarUsuarioProps> = ({
  onAgregarUsuario,
}) => {
  const agregarNuevoUsuarioInterno = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onAgregarUsuario('640371234');
  };

  return (
    <>
      <h5>Cargar Usuarios</h5>
      <p className="text-primary" style={{ fontSize: '12px' }}>
        Agregar Usuario
      </p>

      <form
        className="row row-cols-lg-auto g-3 align-items-center"
        onSubmit={agregarNuevoUsuarioInterno}>
        <div className="col-12 flex-grow-1">
          <label>RUN</label>
          <input type="text" className="form-control" />
          <small id="rutHelp" className="form-text text-muted" style={{ fontSize: '10px' }}>
            No debe incluir guiones ni puntos (EJ: 175967044)
          </small>
        </div>

        <div>
          <button className="btn btn-success">Agregar</button>
        </div>
      </form>
    </>
  );
};

export default FormularioAgregarUsuario;
