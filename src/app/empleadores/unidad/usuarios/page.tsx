'use client';
import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import Titulo from '@/components/titulo/titulo';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { buscarUsuarios } from '../../usuarios/(servicios)/buscar-usuarios';
import { TableUsuariosAsociados } from './(componentes)/table-usuarios-asociados';
import { formUsrUnd } from './(modelos)/formulario-usuario-unidad';
import { asociarUnidad } from './(servicios)/asociar-unidad';
import { buscarEmpleadorRut } from './(servicios)/buscar-empleador-rut';
import { buscarUsuariosAsociado } from './(servicios)/buscar-usuario-asociado';
import { eliminarUsuarioAsociado } from './(servicios)/eliminar-usuario-asociado';
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
  const router = useRouter();
  const [err, datosPagina, pendiente] = useMergeFetchObject(
    {
      usuarioAso: buscarUsuariosAsociado(Number(id)),
    },
    [refresh],
  );

  const [error, usuarios, pending] = useMergeFetchObject(
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
      idempleador: usuarios?.empleador.idempleador,
    });
  }, [usuarios]);

  useEffect(() => {
    let state = window.history.state;
    window.history.pushState(state, '', '/empleadores/unidad/usuarios');
  }, []);
  const refrescarComponente = () => setRefresh(Math.random());

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
        didClose: () => refrescarComponente(),
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        html: 'Error en asociación, verifique los datos correctamente',
      });
    }
  };

  const handleDelete = async (idusuario: number) => {
    console.log(idusuario);
    const respuesta = await Swal.fire({
      icon: 'info',
      title: 'Eliminar Usuario/a',
      html: `¿Desea eliminar al usuario de la unidad ${unidad}?`,
      showConfirmButton: true,
      confirmButtonText: 'SI',
      confirmButtonColor: 'var(--color-blue)',
      showCancelButton: true,
      cancelButtonText: 'NO',
      cancelButtonColor: 'var(--bs-danger)',
    });

    if (!respuesta.isConfirmed) return;

    try {
      await eliminarUsuarioAsociado(idusuario);

      refrescarComponente();
      Swal.fire({
        icon: 'success',
        showConfirmButton: false,
        timer: 2000,
        html: 'Eliminación realizada con éxito',
        didClose: () => refrescarComponente(),
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        html: 'Error en eliminación, verifique los datos correctamente',
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
                  className="form-select js-example-basic-single"
                  data-live-search="true"
                  required
                  onChange={onChangeSelect}
                  value={formIni?.idusuario}
                  name="idusuario">
                  <option value={''}>Seleccionar</option>
                  {usuarios?.usuarios?.length || 0 > 0 ? (
                    usuarios?.usuarios.map(({ idusuario, rutusuario, nombres }) => (
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
          <div className="col-md-12 col-sm-12 col-xl-12">
            <IfContainer show={!pendiente && err.length > 0}>
              <h4 className="mt-4 mb-5 text-center">Error al buscar usuarios</h4>
            </IfContainer>

            <IfContainer show={pendiente}>
              <div className="mb-5">
                <LoadingSpinner titulo="Cargando usuarios..." />
              </div>
            </IfContainer>

            <IfContainer show={!pendiente && err.length === 0}>
              <TableUsuariosAsociados
                usuarioAsociado={datosPagina?.usuarioAso ?? []}
                handleDelete={handleDelete}
              />
            </IfContainer>
          </div>
        </div>

        <div className="d-flex flex-row-reverse">
          <div className="p-2">
            <button
              className="btn btn-danger"
              onClick={() => {
                router.push(`/empleadores/unidad?razon=${razon}&id=${id}&rut=${rut}`);
              }}>
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuariosPageRrhh;
