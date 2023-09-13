'use client';

import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import Titulo from '@/components/titulo/titulo';
import { useForm } from '@/hooks/use-form';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import 'animate.css';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import TablaTrabajadores from './(componentes)/tabla-trabajadores';
import { Trabajador, UnidadEmpleador } from './(modelos)/';
import {
  actualizarTrabajador,
  buscarTrabajadoresDeUnidad,
  crearTrabajador,
  eliminarTrabajador,
} from './(servicios)/';
import styles from './trabajadores.module.css';

interface TrabajadoresPageProps {
  searchParams: {
    idunidad: number;
    razon: string;
    rutempleador: string;
  };
}

const TrabajadoresPage: React.FC<TrabajadoresPageProps> = ({ searchParams }) => {
  const [unidad, setunidad] = useState('');
  const [unidadEmpleador, setunidadEmpleador] = useState<UnidadEmpleador[]>([]);
  let [loading, setLoading] = useState(false);
  const { idunidad, razon, rutempleador } = searchParams;
  const [editar, seteditar] = useState<Trabajador>({
    idtrabajador: 0,
    unidad: {
      idunidad: 0,
    },
  });
  const { run, onInputValidRut } = useForm({
    run: '',
  });
  const [rutedit, setrutedit] = useState<string>();
  const [show, setshow] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const [err, datosPagina, pendiente] = useMergeFetchObject(
    {
      trabajadores: buscarTrabajadoresDeUnidad(Number(idunidad)),
    },
    [refresh],
  );

  const refrescarComponente = () => setRefresh(Math.random());

  const handleEditTrabajador = (idtrabajador: number, idunidad: number, ruttrabajador: string) => {
    seteditar({
      idtrabajador: idtrabajador,
      unidad: {
        idunidad: idunidad,
      },
    });
    setrutedit(ruttrabajador);
    refrescarComponente();
    setshow(true);
  };

  const handleClose = () => setshow(false);

  const handleDeleteTrabajador = (idtrabajador: number, rut: string) => {
    const EliminarTrabajador = async () => {
      const data = await eliminarTrabajador(idtrabajador);

      if (data.ok) {
        refrescarComponente();
        return Swal.fire({
          html: `Persona trabajadora ${rut} fue eliminada con éxito`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      }
      Swal.fire({ html: 'Ha ocurrido un problema', icon: 'error' });
    };
    Swal.fire({
      title: `¿Desea eliminar a la persona trabajadora ${rut}?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Si',
      confirmButtonColor: 'var(--color-blue)',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) EliminarTrabajador();
    });
  };

  const handleChangeUnidad = (event: ChangeEvent<HTMLSelectElement>) => {
    seteditar({
      idtrabajador: editar?.idtrabajador,
      unidad: {
        idunidad: Number(event.target.value),
      },
    });
  };

  const handleSubmitEdit = () => {
    const ActualizaTrabajador = async () => {
      const data = await actualizarTrabajador(editar);
      if (data.ok) {
        Swal.fire({
          html: 'Trabajador modificado con éxito',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        setshow(false);
        refrescarComponente();
      } else {
        Swal.fire({ html: 'Se ha producido un error', icon: 'error' });
      }
    };

    ActualizaTrabajador();
  };

  const handleAddTrabajador = (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();

    const crearTrabajadorAux = async () => {
      const data = await crearTrabajador({
        ruttrabajador: run,
        unidad: {
          idunidad: Number(idunidad),
        },
      });

      if (data.ok) {
        Swal.fire({
          html: 'Persona trabajadora agregada correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        const obtenerTrabajadorUnidad = async () => {
          refrescarComponente();
        };
        obtenerTrabajadorUnidad();
        setLoading(false);
      } else {
        setLoading(false);
        Swal.fire({
          html: 'Existe un problema al momento de grabar ' + (await data.text()),
          icon: 'error',
        });
      }
    };

    crearTrabajadorAux();
  };

  return (
    <>
      <div className="bgads">
        <div className="me-5 ms-5 animate__animate animate__fadeIn">
          <div className="row mt-5">
            <Titulo url="">
              Entidad Empleadora / Dirección y Unidades RRHH - {razon} / Trabajadores - {unidad}
            </Titulo>
          </div>

          <div className="row mt-2">
            <div className="col-md-6">
              <h5>Cargar Trabajadores</h5>
              <sub style={{ color: 'blue' }}>Agregar Persona Trabajadora</sub>
              <br />
              <form onSubmit={handleAddTrabajador}>
                <div className="row mt-2">
                  <div className="col-md-8">
                    <label htmlFor="run">RUN</label>
                    <input
                      id="run"
                      type="text"
                      className="form-control"
                      minLength={4}
                      maxLength={11}
                      name="run"
                      value={run}
                      onChange={onInputValidRut}
                      required
                    />
                  </div>
                  <div
                    className="col-md-4"
                    style={{
                      alignSelf: 'end',
                    }}>
                    <button type="submit" className="btn btn-success">
                      Agregar
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="col-md-6">
              <h5>Cargar Nómina</h5>
              <sub>
                Para poder cargar trabajadores de la unidad <b>{unidad}</b>, solo tiene que
                seleccionar un archivo (formato CSV) según el{' '}
                <span className={styles['span-link']}>siguiente formato</span>
              </sub>
              <div className="row mt-2">
                <div className="col-md-6">
                  <input type="file" className="form-control" />
                </div>

                <div className="col-md-6">
                  <div className="d-grid gap-2 d-md-flex">
                    <button className="btn btn-success">Cargar</button>
                    <button className="btn btn-danger">Borrar todo</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-5">
            <div className="col-md-12 text-center">
              <h5>Trabajadores</h5>

              <hr />
              <IfContainer show={pendiente || loading}>
                <div className="mb-5">
                  <LoadingSpinner titulo="Cargando trabajadores..." />
                </div>
              </IfContainer>
              <IfContainer show={!pendiente || !loading}>
                {datosPagina?.trabajadores?.length || 0 > 0 ? (
                  <TablaTrabajadores
                    handleDeleteTrabajador={handleDeleteTrabajador}
                    handleEditTrabajador={handleEditTrabajador}
                    idunidad={idunidad}
                    trabajadores={datosPagina?.trabajadores || []}
                  />
                ) : (
                  <div className="text-center">
                    <b>No se han encontrado trabajadores</b>
                  </div>
                )}
              </IfContainer>
            </div>
          </div>
          <div
            className="row mt-2"
            style={{
              alignSelf: 'end',
            }}>
            <div className="col-md-6"></div>
            <div className="col-md-6 text-end">
              <button className="btn btn-danger" onClick={() => window.history.go(-2)}>
                Volver
              </button>
            </div>
          </div>
          <br />
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modificar Persona Trabajadora</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                <label>Run</label>
                <input
                  type="text"
                  className="form-control"
                  disabled
                  value={rutedit}
                  onChange={(e) => e.preventDefault}
                />
              </div>
              <div className="col-md-6">
                <label>Unidad</label>
                <select
                  className="form-select"
                  value={editar?.unidad.idunidad}
                  onChange={handleChangeUnidad}>
                  <option value={''}>Seleccionar</option>
                  {unidadEmpleador.length > 0 ? (
                    unidadEmpleador.map(({ idunidad, unidad }) => (
                      <option key={idunidad} value={idunidad}>
                        {unidad}
                      </option>
                    ))
                  ) : (
                    <></>
                  )}
                </select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn btn-primary" onClick={() => handleSubmitEdit()}>
              Modificar
            </button>{' '}
            &nbsp;
            <button className="btn btn-danger" onClick={() => handleClose()}>
              Volver
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default TrabajadoresPage;
