'use client';

import { LoginComponent } from '@/components/login/login-component';
import Position from '@/components/stage/position';
import { EmpleadorContext } from '@/contexts/empleador-context';
import { Empleador } from '@/modelos/empleador';
import { estaLogueado } from '@/servicios/auth';
import { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import ModalInscribirEntidadEmpleadora from './(componentes)/modal-inscribir-entidad-empleadora';
import TablaEntidadesEmpleadoras from './(componentes)/tabla-entidades-empleadoras';
import { buscarEmpleadores } from './(servicios)/buscar-empleadores';
import { Desadscribir } from './(servicios)/desadscribir-empleador';

const EmpleadoresPage = () => {
  const [empleadores, setEmpleadores] = useState<Empleador[]>([]);
  const { cargaEmpleador } = useContext(EmpleadorContext);

  const [rut, setRut] = useState('');
  const [razonSocial, setRazonSocial] = useState('');

  useEffect(() => {
    const loadEmpleador = async () => {
      let respuesta = await buscarEmpleadores('');
      setEmpleadores(respuesta);
      cargaEmpleador(respuesta);
    };
    loadEmpleador();
  }, []);

  const desadscribirEmpleador = (empleador: Empleador) => {
    const empresa = empleador.razonsocial;
    const rut = empleador.rutempleador;

    Swal.fire({
      title: 'Desadscribir',
      html: `¿Esta seguro que desea desadscribir: <b>${rut} - ${empresa}</b>?`,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonColor: 'red',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'var(--color-blue)',
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        let resp: Response = await Desadscribir(rut);
        if (resp.ok) {
          Swal.fire({
            icon: 'success',
            html: `Entidad empleadora: ${empresa} fue eliminada con éxito`,
            timer: 3000,
            showConfirmButton: false,
          });
          const CargaEmpleador = async () => {
            let respuesta = await buscarEmpleadores('');
            setEmpleadores(respuesta);
          };
          CargaEmpleador();
        } else {
          Swal.fire({ icon: 'error', html: 'Hubo un problema en la operación' });
        }
      }
    });
  };

  const onEntidadEmpleadoraCreada = () => {
    const CargaEmpleador = async () => {
      let respuesta = await buscarEmpleadores('');
      setEmpleadores(respuesta);
      cargaEmpleador(respuesta);
    };
    CargaEmpleador();
  };

  const onBuscarEntidadEmpleadora = async () => {
    if (razonSocial.trim() === '' && rut.trim() === '') {
      let respuesta = await buscarEmpleadores('');
      setEmpleadores(respuesta);
      cargaEmpleador(respuesta);
      return;
    }

    const empleadoresFiltrados = empleadores.filter((empleador) => {
      return (
        empleador.razonsocial.toUpperCase().includes(razonSocial.trim().toUpperCase()) &&
        empleador.rutempleador.includes(rut.trim())
      );
    });

    setEmpleadores(empleadoresFiltrados);
  };

  if (!estaLogueado()) {
    return <LoginComponent buttonText="Ingresar" />;
  }

  return (
    <div className="bgads">
      <Position position={4} />
      <div>
        <div className="ms-5 me-5">
          <div className="d-flex align-items-center justify-content-between">
            <h5>Listado de entidades empleadoras</h5>
            <div className="float-end" style={{ cursor: 'pointer', color: 'blue' }}>
              Manual
              {/* TODO: REVISAR */}
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-3 float-end">
              <label>Razón Social</label>
              <input
                type="text"
                className="form-control"
                value={razonSocial}
                onInput={(e) => setRazonSocial(e.currentTarget.value)}
              />
            </div>
            <div className="col-md-3 float-end">
              <label>RUT</label>
              <input
                type="text"
                className="form-control"
                value={rut}
                onInput={(e) => setRut(e.currentTarget.value)}
              />
            </div>
            <div className="col-md-6 float-end align-self-end">
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  onBuscarEntidadEmpleadora();
                }}>
                Buscar
              </button>
              <button
                className="ms-2 btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#Addsempresa">
                Inscribe Entidad Empleadora
              </button>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-10 col-xl-8">
              <TablaEntidadesEmpleadoras
                empleadores={empleadores}
                onDesadscribirEmpleador={(e) => desadscribirEmpleador(e)}
              />
            </div>
          </div>
          <br />
        </div>
      </div>

      <ModalInscribirEntidadEmpleadora onEntidadEmpleadoraCreada={onEntidadEmpleadoraCreada} />
    </div>
  );
};

export default EmpleadoresPage;
