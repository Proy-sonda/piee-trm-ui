'use client';

import { Titulo } from '@/components';
import { GuiaUsuario } from '@/components/guia-usuario';
import { AuthContext } from '@/contexts';
import { emptyFetch, useFetch } from '@/hooks/use-merge-fetch';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import { AlertaConfirmacion, strIncluye } from '@/utilidades';
import { format } from 'date-fns';
import exportFromJSON from 'export-from-json';
import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { useEmpleadorActual } from '../../(contexts)/empleador-actual-context';
import { ModalCrearUsuario, ModalEditarUsuario } from './(componentes)';
import TablaUsuarios from './(componentes)/tabla-usuarios';
import {
  UsuarioEntidadEmpleadora,
  esUsuarioAdminHabilitado,
} from './(modelos)/usuario-entidad-empleadora';
import { buscarUsuarios } from './(servicios)/buscar-usuarios';

const IfContainer = dynamic(() => import('@/components/if-container'));
const LoadingSpinner = dynamic(() => import('@/components/loading-spinner'));

interface UsuariosPageProps {}

const UsuariosPage: React.FC<UsuariosPageProps> = ({}) => {
  const {
    usuario,
    datosGuia: { guia, listaguia, AgregarGuia },
  } = useContext(AuthContext);

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

  useEffect(() => {
    AgregarGuia([
      {
        indice: 0,
        nombre: 'Menu Lateral',
        activo: true,
      },
      {
        indice: 1,
        nombre: 'Agregar Usuario',
        activo: false,
      },
    ]);
  }, []);

  const agregaUsuario = useRef(null);

  // Filtrar usuarios
  useEffect(() => {
    if (!usuarios) {
      setUsuariosFiltrados([]);
      return;
    }

    const filtrados = usuarios.filter((usuario) => {
      return (
        strIncluye(usuario.rutusuario, textoBusqueda) ||
        strIncluye(`${usuario.nombres} ${usuario.apellidopaterno}`, textoBusqueda) ||
        strIncluye(usuario.usuarioempleadorActual.email, textoBusqueda) ||
        strIncluye(usuario.usuarioempleadorActual.telefonouno, textoBusqueda) ||
        strIncluye(usuario.usuarioempleadorActual.rol.rol, textoBusqueda)
      );
    });

    setUsuariosFiltrados(filtrados);
  }, [usuarios, textoBusqueda]);

  const exportarUsuariosCSV = async () => {
    const { isConfirmed } = await AlertaConfirmacion.fire({
      html: `¿Desea exportar las personas usuarias a CSV?`,
    });

    if (!isConfirmed) {
      return;
    }

    const data = (usuarios ?? []).map((usuario) => ({
      RUN: usuario.rutusuario,
      Nombre: `${usuario.nombres} ${usuario.apellidopaterno} ${usuario.apellidomaterno}`,
      'Teléfono 1': usuario.usuarioempleadorActual.telefonouno,
      'Teléfono 2': usuario.usuarioempleadorActual.telefonodos,
      'Correo Electrónico': usuario.usuarioempleadorActual.email,
      Rol: usuario.usuarioempleadorActual.rol.rol,
    }));

    exportFromJSON({
      data,
      fileName: `personas_usuarias_${format(Date.now(), 'dd_MM_yyyy_HH_mm_ss')}`,
      exportType: exportFromJSON.types.csv,
      delimiter: ';',
      withBOM: true,
    });
  };

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

        <Col
          xs={12}
          sm={4}
          md={6}
          lg={7}
          xxl={8}
          className="d-flex flex-row flex-md-row justify-content-sm-end">
          <div>
            <OverlayTrigger overlay={<Tooltip>Exportar personas usuarias a CSV</Tooltip>}>
              <button
                disabled={!usuarios || usuarios.length === 0}
                className="btn btn-sm border border-0"
                style={{ fontSize: '24px' }}
                onClick={() => exportarUsuariosCSV()}>
                <i className="bi bi-filetype-csv"></i>
              </button>
            </OverlayTrigger>
          </div>
          <IfContainer show={rolEnEmpleadorActual === 'administrador'}>
            <GuiaUsuario
              guia={listaguia[1]!?.activo && guia}
              placement="top-start"
              target={agregaUsuario}>
              Agregar nuevos usuarios a la entidad empleadora
              <br />
              <div className="text-end mt-2">
                <button
                  className="btn btn-sm text-white"
                  onClick={() =>
                    AgregarGuia([
                      {
                        indice: 0,
                        nombre: 'Menu lateral',
                        activo: true,
                      },
                      {
                        indice: 1,
                        nombre: 'Carga trabajador',
                        activo: false,
                      },
                    ])
                  }
                  style={{
                    border: '1px solid white',
                  }}>
                  <i className="bi bi-arrow-left"></i>
                  &nbsp; Anterior
                </button>
              </div>
            </GuiaUsuario>
            <button
              className={`btn btn-success ${listaguia[1]!?.activo && guia && 'overlay-marco'}`}
              onClick={() => setAbrirModalCrearUsuario(true)}
              ref={agregaUsuario}>
              + Agregar Usuario
            </button>
          </IfContainer>
        </Col>
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
