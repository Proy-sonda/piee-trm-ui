'use client';

import Position from '@/components/stage/position';
import Stage from '@/components/stage/stage';
import { Unidadrhh } from '@/modelos/tramitacion';
import { estaLogueado } from '@/servicios/auth';
import { cargaUnidadrrhh } from '@/servicios/carga-unidad-rrhh';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import NavegacionEntidadEmpleadora from '../(componentes)/navegacion-entidad-empleadora';
import ModalEditarUnidad from './(componentes)/modal-editar-unidad';
import ModalNuevaUnidad from './(componentes)/modal-nueva-unidad';
import TablaUnidades from './(componentes)/tabla-unidades';
import { UpdateUnidad } from './(modelos)/datos-actualizar-unidad';
import { CrearUnidad } from './(modelos)/datos-nueva-unidad';
import { actualizarUnidad } from './(servicios)/actualizar-unidad';
import { crearUnidad } from './(servicios)/crear-unidad';
import { eliminarUnidad } from './(servicios)/eliminar-unidad';

interface UnidadRRHHProps {
  searchParams: {
    rut: string;
    razon: string;
    id: string;
  };
}

const UnidadRRHH = ({ searchParams }: UnidadRRHHProps) => {
  const router = useRouter();

  const { rut, razon, id } = searchParams;
  const [UnidadRRHH, setUnidadRRHH] = useState<Unidadrhh[]>([]);
  const [idunidad, setIdunidad] = useState<string | undefined>(undefined);

  useEffect(() => {
    const cargaUnidades = async () => {
      const data = await cargaUnidadrrhh(rut);
      setUnidadRRHH(data);
    };
    cargaUnidades();
    window.history.pushState(null, '', '/empleadores/unidad');
  }, []);

  const handleDelete = (unidadEliminar: Unidadrhh) => {
    const { idunidad, unidad } = unidadEliminar;

    Swal.fire({
      icon: 'warning',
      html: `¿Desea eliminar la unidad: ${unidad}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const resp = await eliminarUnidad(idunidad);
        if (resp.ok) {
          const cargaUnidades = async () => {
            const data = await cargaUnidadrrhh(rut);

            setUnidadRRHH(data);
          };

          cargaUnidades();

          return Swal.fire('Operación realizada con éxito', '', 'success');
        }

        return Swal.fire('Existe un problema, favor contactar administrador', '', 'error');
      }
    });
  };

  const crearNuevaUnidad = (nuevaUnidad: CrearUnidad) => {
    const EnviaSolicitud = async () => {
      const resp = await crearUnidad(nuevaUnidad);
      if (resp.ok) {
        const cargaUnidades = async () => {
          const data = await cargaUnidadrrhh(rut);
          setUnidadRRHH(data);
        };
        cargaUnidades();

        return Swal.fire({
          html: 'Unidad creada con éxito',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      }

      return Swal.fire({ html: 'Existe un problema', icon: 'error' });
    };

    EnviaSolicitud();
  };

  const handleEditUnidad = (DataUnidad: UpdateUnidad) => {
    const updateUnidad = async () => {
      const data = await actualizarUnidad(DataUnidad);
      if (data.ok) {
        const cargaUnidades = async () => {
          const data = await cargaUnidadrrhh(rut);
          setUnidadRRHH(data);
        };
        cargaUnidades();
        return Swal.fire({
          html: 'Unidad fue actualizada con exito',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      }
      Swal.fire({ html: 'Existe un problema en la operación', icon: 'error' });
    };
    updateUnidad();
  };

  if (!estaLogueado()) {
    router.push('/login');
    return null;
  }

  return (
    <div className="bgads">
      <Position position={4} />
      <div className="container">
        <div className="row">
          <NavegacionEntidadEmpleadora rut={rut} razon={razon} id={id} />
        </div>

        <div className="row mt-2">
          <div className="col-md-8">
            <Stage manual="" url="#">
              Entidad Empleadora / Dirección y Unidades RRHH - <b>{razon}</b>
            </Stage>
          </div>

          <div className="col-md-4">
            <label style={{ cursor: 'pointer', color: 'blue' }}>Manual</label>
            <br />
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-8"></div>
          <div className="col-md-4 float-end">
            <button
              className="btn btn-success btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#AddURHH">
              + Agregar Unidad RRHH
            </button>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-12">
            <TablaUnidades
              rut={rut}
              unidades={UnidadRRHH}
              razon={razon}
              onEditarUnidad={({ idunidad }) => setIdunidad(idunidad.toString())}
              onEliminarUnidad={(unidad) => handleDelete(unidad)}
            />
          </div>
        </div>
      </div>

      <ModalNuevaUnidad idEmpleador={id} onCrearNuevaUnidad={crearNuevaUnidad} />

      <ModalEditarUnidad idEmpleador={id} idUnidad={idunidad} onEditarUnidad={handleEditUnidad} />
    </div>
  );
};

export default UnidadRRHH;
