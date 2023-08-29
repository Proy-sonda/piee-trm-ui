import { CCCOMUNACB } from '@/contexts/modelos/types';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { UnidadResp } from '../(modelos)/UnidadResp';
import { UpdateUnidad } from '../(modelos)/UpdateUnidad';
import { getDatoUnidad } from '../(servicios)/getDatoUnidad';
import { buscarComunas, buscarRegiones } from '../../(servicios)/buscarCombos';

interface ModalEditarUnidadProps {
  idEmpleador: string;
  idUnidad?: string;
  onEditarUnidad: (DataUnidad: UpdateUnidad) => void;
}

const ModalEditarUnidad = ({ idEmpleador, idUnidad, onEditarUnidad }: ModalEditarUnidadProps) => {
  const [region, setregion] = useState<any>();
  const [comunas, setcomuna] = useState([
    {
      idcomuna: 0,
      nombre: '',
      region: {
        idregion: 0,
        nombre: '',
      },
    },
  ] as CCCOMUNACB[]);

  const [_, combos] = useMergeFetchObject({
    regiones: buscarRegiones(),
    comunas: buscarComunas(),
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

  useEffect(() => {
    if (!idUnidad || !combos) {
      return;
    }

    getDatoUnidad(parseInt(idUnidad))
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Error al buscar unidad');
        }

        return resp.json() as Promise<UnidadResp>;
      })
      .then((resp) => {
        const idRegionResp = resp.direccionunidad.comuna.region.idregion;

        const comunas = combos.comunas.filter(
          ({ region: { idregion } }) => `${idregion}` === idRegionResp,
        );

        setcomuna(comunas);

        setInitialForm({
          editnombre: resp.unidad,
          editcalle: resp.direccionunidad.numero,
          editcomuna: resp.direccionunidad.comuna.idcomuna,
          editemail: resp.email,
          editidentificador: resp.identificador,
          editnrocalle: resp.direccionunidad.numero,
          editnrocasa: resp.direccionunidad.depto,
          editremail: resp.email,
          edittelefono: resp.telefono,
          editregion: idRegionResp,
        });
      })
      .catch((err) => {
        console.error(err);

        Swal.fire({
          icon: 'error',
          html: `Hubo un error al buscar la unidad para editar`,
          showDenyButton: false,
          confirmButtonText: 'OK',
        });
      });
  }, [idUnidad]);

  const onChangeEdit = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInitialForm({ ...InitialForm, [e.target.name]: e.target.value });
  };

  const onChangeRegion = (event: any) => {
    setregion(event.target.value);

    setInitialForm({
      ...InitialForm,
      [event.target.name]: event.target.value,
    });

    const comunas = combos!.comunas.filter(
      ({ region: { idregion } }) => idregion == event.target.value,
    );
    setcomuna(comunas);
  };

  const handleEditarUnidad = (e: FormEvent) => {
    e.preventDefault();

    onEditarUnidad({
      direccionunidad: {
        comuna: {
          idcomuna: InitialForm.editcomuna,
          nombre: InitialForm.editcomuna,
        },
        calle: InitialForm.editcalle,
        depto: InitialForm.editnrocasa,
        numero: InitialForm.editnrocalle,
      },
      email: InitialForm.editemail,
      empleador: {
        idempleador: Number(idEmpleador),
      },
      estadounidadrrhh: {
        idestadounidadrrhh: 1,
        descripcion: 'SUSCRITO',
      },
      identificador: InitialForm.editidentificador,
      idunidad: Number(idUnidad),
      telefono: InitialForm.edittelefono,
      unidad: InitialForm.editnombre,
    });
  };

  return (
    <>
      <div
        className="modal fade"
        id="modrrhh"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <form onSubmit={handleEditarUnidad}>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Modificar Unidad RRHH
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
                      name="editnombre"
                      value={InitialForm.editnombre}
                      onChange={onChangeEdit}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-text">Región</label>
                    <select
                      className="form-select"
                      name="editregion"
                      value={InitialForm.editregion}
                      onChange={onChangeRegion}
                      required>
                      <option value={''}>Seleccionar</option>
                      {combos &&
                        combos.regiones.map(({ idregion, nombre }) => (
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
                      name="editcomuna"
                      value={InitialForm.editcomuna}
                      onChange={onChangeEdit}
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
                      name="editcalle"
                      value={InitialForm.editcalle}
                      onChange={onChangeEdit}
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
                      name="editnrocalle"
                      value={InitialForm.editnrocalle}
                      onChange={onChangeEdit}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-text">N° casa/Departamento</label>
                    <input
                      type="text"
                      className="form-control"
                      name="editnrocasa"
                      value={InitialForm.editnrocasa}
                      onChange={onChangeEdit}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-text">Identificador Único</label>
                    <input
                      type="text"
                      className="form-control"
                      name="editidentificador"
                      value={InitialForm.editidentificador}
                      onChange={onChangeEdit}
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
                        name="edittelefono"
                        value={InitialForm.edittelefono}
                        onChange={onChangeEdit}
                        required
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
                      name="editemail"
                      value={InitialForm.editemail}
                      onChange={onChangeEdit}
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
                      name="editremail"
                      value={InitialForm.editremail}
                      onChange={onChangeEdit}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  Modificar
                </button>
                <button type="button" className="btn btn-success" data-bs-dismiss="modal">
                  Volver
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalEditarUnidad;
