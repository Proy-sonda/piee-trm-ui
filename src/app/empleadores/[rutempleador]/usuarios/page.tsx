'use client';

import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import Titulo from '@/components/titulo/titulo';
import { AuthContext } from '@/contexts';
import { emptyFetch, useFetch } from '@/hooks/use-merge-fetch';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import { strIncluye } from '@/utilidades';
import React, { useContext, useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useEmpleadorActual } from '../../(contexts)/empleador-actual-context';
import ModalCrearUsuario from './(componentes)/modal-crear-usuario';
import ModalEditarUsuario from './(componentes)/modal-editar-usuario';
import TablaUsuarios from './(componentes)/tabla-usuarios';
import {
  UsuarioEntidadEmpleadora,
  esUsuarioAdminHabilitado,
} from './(modelos)/usuario-entidad-empleadora';
import { buscarUsuarios } from './(servicios)/buscar-usuarios';

interface UsuariosPageProps {}

const UsuariosPage: React.FC<UsuariosPageProps> = ({}) => {
  const { usuario } = useContext(AuthContext);

  const {
    cargandoEmpleador,
    empleadorActual,
    errorCargarEmpleador,
    rolEnEmpleadorActual,
    actualizarRol,
  } = useEmpleadorActual();

  const [refresh, cargarUsuarios] = useRefrescarPagina();

  const [, usuarios] = useFetch(
    empleadorActual ? buscarUsuarios(empleadorActual.rutempleador) : emptyFetch(),
    [empleadorActual, refresh],
  );

  const [cantidadUsuariosAdmin, setCantidadUsuariosAdmin] = useState<number>(0);

  const [abrirModalCrearUsuario, setAbrirModalCrearUsuario] = useState(false);

  const [abrirModalEditarUsuario, setAbrirModalEditarUsuario] = useState(false);

  const [idUsuarioEditar, setIdUsuarioEditar] = useState<number | undefined>(undefined);

  const [textoBusqueda, setTextoBusqueda] = useState('');

  const [usuariosFiltrados, setUsuariosFiltrados] = useState<UsuarioEntidadEmpleadora[]>([]);

  // Actualizar la cantidad de usuarios activos y administradores
  useEffect(() => {
    if (!usuarios) {
      setCantidadUsuariosAdmin(0);
      return;
    }

    setCantidadUsuariosAdmin(usuarios.filter(esUsuarioAdminHabilitado).length);
  }, [usuarios]);

  // Filtrar usuarios
  useEffect(() => {
    if (!usuarios) {
      setUsuariosFiltrados([]);
      return;
    }

    const filtrados = usuarios.filter((usuario) => {
      return (
        strIncluye(usuario.rutusuario, textoBusqueda) ||
        strIncluye(`${usuario.nombres} ${usuario.apellidos}`, textoBusqueda) ||
        strIncluye(usuario.usuarioempleadorActual.email, textoBusqueda) ||
        strIncluye(usuario.usuarioempleadorActual.telefonouno, textoBusqueda) ||
        strIncluye(usuario.usuarioempleadorActual.rol.rol, textoBusqueda)
      );
    });

    setUsuariosFiltrados(filtrados);
  }, [usuarios, textoBusqueda]);

  return (
    <>
      <Titulo url="">
        Entidad Empleadora - <b>{empleadorActual?.razonsocial ?? 'Cargando...'}</b> / Personas
        Usuarias
      </Titulo>

      <Row className="my-4 g-3">
        <Col xs={12} sm={8} md={6} lg={5} xxl={4}>
          <Form.Control
            type="search"
            placeholder="Buscar persona usuaria..."
            value={textoBusqueda}
            onChange={(event) => setTextoBusqueda(event.target.value ?? '')}
          />
        </Col>

        <IfContainer show={rolEnEmpleadorActual === 'administrador'}>
          <Col
            xs={12}
            sm={4}
            md={6}
            lg={7}
            xxl={8}
            className="d-flex flex-column flex-md-row justify-content-sm-end">
            <button className="btn btn-success" onClick={() => setAbrirModalCrearUsuario(true)}>
              + Agregar Usuario
            </button>
          </Col>
        </IfContainer>
      </Row>

      <div className="row mt-3">
        <div className="col-md-12">
          <IfContainer show={!cargandoEmpleador && errorCargarEmpleador}>
            <h4 className="mt-4 mb-5 text-center">Error al buscar personas usuarias</h4>
          </IfContainer>

          <IfContainer show={cargandoEmpleador}>
            <div className="mb-5">
              <LoadingSpinner titulo="Cargando usuarios..." />
            </div>
          </IfContainer>

          <IfContainer show={!cargandoEmpleador && !errorCargarEmpleador}>
            <TablaUsuarios
              usuarios={usuariosFiltrados}
              cantidadAdministradoresActivos={cantidadUsuariosAdmin}
              onEditarUsuario={(idUsuario) => {
                setIdUsuarioEditar(idUsuario);
                setAbrirModalEditarUsuario(true);
              }}
              onUsuarioEliminado={() => cargarUsuarios()}
            />
          </IfContainer>
        </div>
      </div>

      <ModalCrearUsuario
        show={abrirModalCrearUsuario}
        empleador={empleadorActual}
        onCerrarModal={() => setAbrirModalCrearUsuario(false)}
        onUsuarioCreado={() => {
          cargarUsuarios();
          setAbrirModalCrearUsuario(false);
        }}
      />

      <ModalEditarUsuario
        cantidadUsuariosAdminActivos={cantidadUsuariosAdmin}
        show={abrirModalEditarUsuario}
        idUsuario={idUsuarioEditar}
        empleador={empleadorActual}
        onCerrarModal={() => {
          setIdUsuarioEditar(undefined);
          setAbrirModalEditarUsuario(false);
        }}
        onUsuarioEditado={(rutUsuarioEditado) => {
          setIdUsuarioEditar(undefined);
          setAbrirModalEditarUsuario(false);
          cargarUsuarios();

          if (usuario && usuario.rut === rutUsuarioEditado) {
            actualizarRol();
          }
        }}
      />
    </>
  );
};

export default UsuariosPage;
