'use client';

import Position from '@/app/components/stage/Position';
import Stage from '@/app/components/stage/Stage';
import { Unidadrhh } from '@/app/interface/tramitacion';
import { estaLogueado } from '@/app/servicios/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { cargaUnidadrrhh } from '../../servicios/cargaUnidadRRHH';
import ModalEditarUnidad from './(componentes)/ModalEditarUnidad';
import ModalNuevaUnidad from './(componentes)/ModalNuevaUnidad';
import TablaUnidades from './(componentes)/TablaUnidades';
import { UpdateUnidad } from './(modelos)/UpdateUnidad';
import { CrearUnidad } from './(modelos)/nuevaUnidad';
import { actualizarUnidad } from './(servicios)/actualizarDatoUnidad';
import { crearUnidad } from './(servicios)/crearUnidad';
import { eliminarUnidad } from './(servicios)/eliminarUnidad';

interface UnidadRRHHProps {
  searchParams: {
    rut: string;
    razon: string;
    id: string;
  };
}

const UnidadRRHH = ({ searchParams }: UnidadRRHHProps) => {
  const router = useRouter();

  if (!estaLogueado()) {
    router.push('/login');
    return null;
  }

  const { rut, razon, id } = searchParams;
  const [UnidadRRHH, setUnidadRRHH] = useState<Unidadrhh[]>([]);
  const [idunidad, setIdunidad] = useState<string | undefined>(undefined);

  useEffect(() => {
    const cargaUnidades = async () => {
      const data = await cargaUnidadrrhh(rut);
      setUnidadRRHH(data);
    };
    cargaUnidades();
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

  return (
    <div className="bgads">
      <Position position={4} />
      <div className="container">
        <div className="row">
          <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-3">
            <div id="flowBoxes">
              <div className="right">
                <Link href={`/empleadores/datos?rut=${rut}&razon=${razon}&id=${id}`}>
                  Datos Entidad Empleadora
                </Link>{' '}
                &nbsp;
              </div>
              <div className="left right active">
                <Link href={`/empleadores/unidad?rut=${rut}&razon=${razon}&id=${id}`}>
                  Unidad de RRHH
                </Link>
                &nbsp;
              </div>
              <div className="left">
                <Link href={`/empleadores/usuarios?rut=${rut}&razon=${razon}&id=${id}`}>
                  Usuarios
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-8">
            <Stage manual="" url="#">
              Entidad Empleadora / Dirección y Unidades RRHH - {razon}
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
