import { buscarComunas } from '@/app/empleadores/(servicios)/buscar-comunas';
import { buscarRegiones } from '@/app/empleadores/(servicios)/buscar-regiones';
import { useForm } from '@/hooks/use-form';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { FormEvent, useState } from 'react';
import { CrearUnidad } from '../(modelos)/datos-nueva-unidad';
import { Comuna } from '../../(modelos)/comuna';

interface ModalNuevaUnidadProps {
  idEmpleador: string;
  onCrearNuevaUnidad: (nuevaUnidad: CrearUnidad) => void;
}

const ModalNuevaUnidad = ({ idEmpleador, onCrearNuevaUnidad }: ModalNuevaUnidadProps) => {
  const [region, setregion] = useState<any>();
  const [comunas, setcomuna] = useState([] as Comuna[]);

  const [_, combos] = useMergeFetchObject({
    CCREGION: buscarRegiones(),
    CCCOMUNA: buscarComunas(),
  });

  const [InitialForm, setInitialForm] = useState({
    editnombre: '',
    editcomuna: '',
    editcalle: '',
    editnrocalle: '',
    editnrocasa: '',
    editidentificador: '',
    edittelefono: '',
    editemail: '',
    editremail: '',
    editregion: '',
  });

  const {
    nombre,
    comuna,
    calle,
    nrocalle,
    nrocasa,
    identificador,
    telefono,
    email,
    remail,
    onInputChange,
    onInputChangeOnlyNum,
  } = useForm({
    nombre: '',
    comuna: '',
    calle: '',
    nrocalle: '',
    nrocasa: '',
    identificador: '',
    telefono: '',
    email: '',
    remail: '',
  });

  const onChangeRegion = (event: any) => {
    setregion(event.target.value);

    setInitialForm({
      ...InitialForm,
      [event.target.name]: event.target.value,
    });

    const comunas = combos!.CCCOMUNA.filter(
      ({ region: { idregion } }) => idregion == event.target.value,
    );

    setcomuna(comunas);
  };

  const handleSubmitInterno = (e: FormEvent) => {
    e.preventDefault();

    onCrearNuevaUnidad({
      empleador: {
        idempleador: Number(idEmpleador),
      },
      direccionunidad: {
        calle: calle,
        comuna: {
          idcomuna: comuna,
          nombre: comuna,
        },
        depto: nrocasa,
        numero: nrocalle,
      },
      email: email,
      estadounidadrrhh: {
        idestadounidadrrhh: 1,
        descripcion: 'SUSCRITO',
      },
      identificador: identificador,
      telefono: telefono,
      unidad: nombre,
    });
  };

  return (
    <>
      <div
        className="modal fade"
        id="AddURHH"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <form onSubmit={handleSubmitInterno}>
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Crear nueva Unidad RRHH
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="row mt-2">
                  <div className="col-md-3">
                    <label className="form-text">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={nombre}
                      onChange={onInputChange}
                      autoComplete="new-custom-value"
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-text">Región</label>
                    <select
                      className="form-select"
                      name="region"
                      value={region}
                      onChange={onChangeRegion}
                      required>
                      <option value={''}>Seleccionar</option>

                      {combos &&
                        combos.CCREGION.map(({ idregion, nombre }) => (
                          <option key={idregion} value={idregion}>
                            {nombre}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-text">Comuna</label>
                    <select
                      className="form-select"
                      name="comuna"
                      value={comuna}
                      onChange={onInputChange}
                      required>
                      <option value={''}>Seleccionar</option>
                      {comunas.length > 0 ? (
                        comunas.map(({ idcomuna, nombre }) => (
                          <option key={idcomuna} value={idcomuna}>
                            {nombre}
                          </option>
                        ))
                      ) : (
                        <></>
                      )}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-text">Calle</label>
                    <input
                      type="text"
                      className="form-control"
                      name="calle"
                      value={calle}
                      onChange={onInputChange}
                      autoComplete="new-custom-value"
                      required
                    />
                  </div>
                </div>

                <div className="row mt-2">
                  <div className="col-md-3">
                    <label className="form-text">N° Calle</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nrocalle"
                      value={nrocalle}
                      onChange={onInputChange}
                      autoComplete="new-custom-value"
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-text">N° casa/Departamento</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nrocasa"
                      value={nrocasa}
                      onChange={onInputChange}
                      autoComplete="new-custom-value"
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-text">Identificador Único</label>
                    <input
                      type="text"
                      className="form-control"
                      name="identificador"
                      value={identificador}
                      autoComplete="new-custom-value"
                      onChange={onInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="sr-only" htmlFor="tel1">
                      Teléfono
                    </label>
                    <div className="input-group mb-2">
                      <div className="input-group-prepend">
                        <div className="input-group-text">+56</div>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        name="telefono"
                        value={telefono}
                        onChange={onInputChangeOnlyNum}
                        minLength={9}
                        maxLength={9}
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md-3">
                    <label>Correo electrónico unidad RRHH</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={email}
                      onChange={onInputChange}
                      onPaste={(e) => e.preventDefault()}
                      required
                    />
                    <small id="cempleHelp" className="form-text text-muted">
                      ejemplo@ejemplo.cl
                    </small>
                  </div>

                  <div className="col-md-3">
                    <label>Repetir correo electrónico</label>
                    <input
                      type="email"
                      className="form-control"
                      name="remail"
                      value={remail}
                      autoComplete="new-custom-value"
                      onPaste={(e) => e.preventDefault()}
                      onChange={onInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  Guardar
                </button>
                <button type="button" className="btn btn-success" data-bs-dismiss="modal">
                  Volver
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ModalNuevaUnidad;
