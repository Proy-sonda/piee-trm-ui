'use client';
import Titulo from '@/components/titulo/titulo';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { buscarUsuarios } from '../../usuarios/(servicios)/buscar-usuarios';
import { formUsrUnd } from './(modelos)/iformusrund';
import { asociarUnidad } from './(servicios)/asociar-unidad';
import { buscarEmpleadorRut } from './(servicios)/buscar-empleador-rut';
import styles from './usuarios.module.css';

interface iUsuarios {
  searchParams: {
    unidad: string;
    id: number;
    razon: string;
    rut: string;
  };
}

const UsuariosPageRrhh = ({ searchParams }: iUsuarios) => {
  const { id, unidad, razon, rut } = searchParams;
  const [refresh, setRefresh] = useState(0);
  const [err, datosPagina, pendiente] = useMergeFetchObject(
    {
      usuarios: buscarUsuarios(rut),
      empleador: buscarEmpleadorRut(rut),
    },
    [refresh],
  );
  const [formIni, setformIni] = useState<formUsrUnd>({
    idempleador: 0,
    idunidad: 0,
    idusuario: 0,
  });

  useEffect(() => {
    setformIni({
      ...formIni,
      idempleador: datosPagina?.empleador.idempleador,
    });
  }, [datosPagina]);

  // useEffect(() => window.history.pushState(null, '', '/empleadores/unidad/usuarios'), []);

  const onHandleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const respuesta = await Swal.fire({
      icon: 'info',
      title: 'Asociar Usuario/a',
      html: `¿Desea asociar al usuario a la unidad ${unidad}?`,
      showConfirmButton: true,
      confirmButtonText: 'SI',
      confirmButtonColor: 'var(--color-blue)',
      showCancelButton: true,
      cancelButtonText: 'NO',
      cancelButtonColor: 'var(--bs-danger)',
    });

    if (!respuesta.isConfirmed) return;

    try {
      await asociarUnidad(formIni);

      Swal.fire({
        icon: 'success',
        showConfirmButton: false,
        timer: 2000,
        html: 'Asociación realizada con éxito',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        html: 'Error en asociación, verifique los datos correctamente',
      });
    }
  };

  const onChangeSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    setformIni({
      ...formIni,
      idusuario: Number(event.currentTarget.value),
      idunidad: Number(id),
    });
  };

  return (
    <div className="bgads">
      <div className="ms-5 me-5">
        <div className="row">
          <Titulo manual="Manual" url="">
            <h5>
              Empleadores / Dirección y Unidades RRHH - <b>{razon}</b> / Usuarios - <b>{unidad}</b>
            </h5>
          </Titulo>
        </div>
        <div className="row mt-3">
          <h5>Cargar Usuarios</h5>
          <sub className={styles['sub-title']}>Agregar Usuario</sub>
        </div>

        <form className="row mt-3" onSubmit={onHandleSubmit}>
          <div className="col-md-8 col-sm-12 col-xl-6">
            <div className="row">
              <div className="col-md-6">
                <label>RUN</label>
                <select
                  className="form-select"
                  data-live-search="true"
                  required
                  onChange={onChangeSelect}
                  value={formIni?.idusuario}
                  name="idusuario">
                  <option value={''}>Seleccionar</option>
                  {datosPagina?.usuarios?.length || 0 > 0 ? (
                    datosPagina?.usuarios.map(({ idusuario, rutusuario, nombres }) => (
                      <option key={idusuario} value={idusuario} data-tokens={rutusuario}>
                        {rutusuario} / {nombres}
                      </option>
                    ))
                  ) : (
                    <></>
                  )}
                </select>
              </div>
              <div className="col-md-6 align-self-end">
                <button type="submit" className="btn btn-success">
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="row mt-3">
          <h5>Usuarios</h5>
          <div className="col-md-12 col-sm-12 col-xl-12"></div>
        </div>
      </div>
    </div>
  );
};

export default UsuariosPageRrhh;
