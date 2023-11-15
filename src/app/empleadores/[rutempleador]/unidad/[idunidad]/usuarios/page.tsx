'use client';
import { useEmpleadorActual } from '@/app/empleadores/(contexts)/empleador-actual-context';
import { buscarUnidadPorId } from '@/app/empleadores/[rutempleador]/unidad/(servicios)/buscar-unidad-por-id';
import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import Titulo from '@/components/titulo/titulo';
import { AuthContext } from '@/contexts';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { Usuariosunidad } from '@/modelos/tramitacion';
import { AlertaConfirmacion, AlertaError, AlertaExito } from '@/utilidades/alertas';
import React, { ChangeEvent, Fragment, useContext, useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Usuarioxrrhh } from '../../(modelos)/payload-unidades';
import { UsuarioEntidadEmpleadora } from '../../../usuarios/(modelos)/usuario-entidad-empleadora';
import { buscarUsuarios } from '../../../usuarios/(servicios)/buscar-usuarios';
import { TableUsuariosAsociados } from './(componentes)/table-usuarios-asociados';
import { asociarUnidad } from './(servicios)/asociar-unidad';
import { buscarUsuariosAsociado } from './(servicios)/buscar-usuario-asociado';
import { eliminarUsuarioAsociado } from './(servicios)/eliminar-usuario-asociado';
import styles from './usuarios.module.css';
interface iUsuarios {
  params: {
    rutempleador: string;
    idunidad: string;
  };
}

interface Formulario {
  acccionusuxrrhh: number;
  codigounidadrrhh: string;
  runusuario: string;
  rolusuario: number;
}

const UsuariosPageRrhh: React.FC<iUsuarios> = ({ params }) => {
  const { rutempleador, idunidad } = params;
  const [unidad, setunidad] = useState('');
  const [spinner, setspinner] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [usuarios, setusuarios] = useState<UsuarioEntidadEmpleadora[]>([]);
  const [usuariosAsociados, setusuariosAsociados] = useState<Usuariosunidad[] | undefined>([]);
  const { empleadorActual, rolEnEmpleadorActual } = useEmpleadorActual();
  const { usuario } = useContext(AuthContext);

  const formulario = useForm<Formulario>({
    mode: 'onSubmit',
    defaultValues: {
      acccionusuxrrhh: 1,
      codigounidadrrhh: '',
      rolusuario: 0,
      runusuario: '',
    },
  });

  useEffect(() => {
    const busquedaUnidad = async () => {
      const [resp] = await buscarUnidadPorId(idunidad);
      setunidad((await resp())!?.glosaunidadrrhh);
    };

    busquedaUnidad();

    refrescarComponente();
  }, []);

  useEffect(() => {
    const busquedaUsuarios = async () => {
      if (empleadorActual?.rutempleador == '' || empleadorActual == undefined) return;
      const [resp] = await buscarUsuarios(empleadorActual.rutempleador);
      setusuarios(await resp());
    };
    busquedaUsuarios();
  }, [empleadorActual?.rutempleador]);

  const [err, datosPagina, pendiente] = useMergeFetchObject(
    {
      usuarioAso: buscarUsuariosAsociado(idunidad, rutempleador),
    },
    [refresh],
  );

  useEffect(() => {
    if (datosPagina?.usuarioAso == undefined) return;
    setusuariosAsociados(datosPagina!?.usuarioAso);
  }, [datosPagina]);

  useEffect(() => {
    setusuarios(
      usuarios.filter(
        (usuario) =>
          usuario.rutusuario !==
          usuariosAsociados?.find(
            (usuarioAsociado) => usuarioAsociado.runusuario == usuario.rutusuario,
          )?.runusuario,
      ),
    );
  }, [datosPagina?.usuarioAso]);

  const refrescarComponente = () => setRefresh(Math.random());

  const onHandleSubmit: SubmitHandler<Formulario> = async (data) => {
    const respuesta = await AlertaConfirmacion.fire({
      title: 'Asociar Usuario/a',
      html: `¿Desea asociar al usuario ${usuarios!?.find(
        ({ rutusuario }) => rutusuario == data.runusuario,
      )?.nombres} a la unidad ${unidad}?`,
    });

    const usuarioaasociar: Usuarioxrrhh = {
      acccionusuxrrhh: 1,
      rolusuario:
        usuarios.find(({ rutusuario }) => rutusuario == data.runusuario)?.usuarioempleadorActual.rol
          .idrol ?? 0,
      codigounidadrrhh: idunidad,
      runusuario: data.runusuario,
    };

    if (!respuesta.isConfirmed) return;
    setspinner(true);
    try {
      if (usuario == undefined) return;
      await asociarUnidad(usuarioaasociar, usuario?.rut, rutempleador);
      setspinner(false);
      AlertaExito.fire({
        html: 'Asociación realizada con éxito',
        didClose: () => {
          refrescarComponente();
        },
      });
    } catch (error) {
      setspinner(false);
      AlertaError.fire({
        html: 'Error en asociación, verifique los datos correctamente',
      });
    }
  };

  const handleDelete = async (runusuarioeliminar: string) => {
    const respuesta = await AlertaConfirmacion.fire({
      title: 'Eliminar Usuario/a',
      html: `¿Desea eliminar al usuario de la unidad ${unidad}?`,
    });

    if (!respuesta.isConfirmed) return;

    setspinner(true);
    try {
      const usuarioEliminar: Usuarioxrrhh = {
        acccionusuxrrhh: 3,
        codigounidadrrhh: idunidad,
        rolusuario: Number(
          usuariosAsociados?.find(({ runusuario }) => runusuario == runusuarioeliminar)?.rolusuario,
        ),
        runusuario: runusuarioeliminar,
      };
      if (usuario == undefined) return;
      await eliminarUsuarioAsociado(usuarioEliminar, usuario?.rut, rutempleador);
      setspinner(false);
      refrescarComponente();
      AlertaExito.fire({
        html: 'Eliminación realizada con éxito',
        didClose: () => refrescarComponente(),
      });
    } catch (error) {
      setspinner(false);
      AlertaError.fire({
        html: 'Error en eliminación, verifique los datos correctamente',
      });
    } finally {
      refrescarComponente();
      window.location.href = window.location.href;
    }
  };

  return (
    <>
      <IfContainer show={spinner}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <div className="row">
        <Titulo manual="Manual" url="">
          Entidad Empleadora - <b>{empleadorActual?.razonsocial}</b> / Unidades de RRHH -{' '}
          <b>{unidad}</b> / Personas Usuarias
        </Titulo>
      </div>

      {rolEnEmpleadorActual === 'administrador' && (
        <>
          <div className="row mt-4">
            <h5>Cargar Personas Usuarias</h5>
            <sub className={styles['sub-title']}>Agregar RUN Persona Usuaria</sub>
          </div>
          <FormProvider {...formulario}>
            <form className="row mt-3" onSubmit={formulario.handleSubmit(onHandleSubmit)}>
              <div className="col-md-8 col-sm-12 col-xl-6">
                <div className="row">
                  <div className="col-md-6">
                    <select
                      className="form-select js-example-basic-single"
                      data-live-search="true"
                      required
                      onChange={(e) => {
                        formulario.setValue('runusuario', e.target.value);
                      }}
                      name="runusuario">
                      <option value={''}>Seleccionar</option>
                      {usuarios?.length || 0 > 0 ? (
                        usuarios.map(({ rutusuario, nombres }) => (
                          <Fragment key={rutusuario}>
                            {datosPagina?.usuarioAso.find(
                              (useraso) => useraso.runusuario === rutusuario,
                            ) ? (
                              <Fragment key={Math.random()}></Fragment>
                            ) : (
                              <>
                                <option
                                  key={Math.random()}
                                  value={rutusuario}
                                  data-tokens={rutusuario}>
                                  {rutusuario} / {nombres}
                                </option>
                              </>
                            )}
                          </Fragment>
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
          </FormProvider>
        </>
      )}

      <div className="row mt-3 text-center">
        <h5>Personas Usuarias</h5>
        <div className="col-md-12 col-sm-12 col-xl-12">
          <IfContainer show={pendiente}>
            <div className="mb-5">
              <LoadingSpinner titulo="Cargando personas usuarias..." />
            </div>
          </IfContainer>

          <IfContainer show={!pendiente && err.length === 0}>
            <div className="row mb-2">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Búsqueda por RUN..."
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setusuariosAsociados(
                      datosPagina?.usuarioAso.filter(({ runusuario }) =>
                        runusuario.includes(e.target.value),
                      ),
                    );
                  }}
                />
              </div>
            </div>
            <TableUsuariosAsociados
              usuarioAsociado={usuariosAsociados}
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
              window.history.back();
            }}>
            Volver
          </button>
        </div>
      </div>
    </>
  );
};

export default UsuariosPageRrhh;
