'use client';

import { Titulo } from '@/components';
import { GuiaUsuario } from '@/components/guia-usuario';
import { AuthContext } from '@/contexts';
import { emptyFetch, useFetch, useRefrescarPagina } from '@/hooks';
import { Unidadesrrhh } from '@/modelos/tramitacion';
import { buscarUnidadesDeRRHH } from '@/servicios';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { useEmpleadorActual } from '../../(contexts)/empleador-actual-context';
import { ModalEditarUnidad, ModalNuevaUnidad } from './(componentes)';
import TablaUnidades from './(componentes)/tabla-unidades';
import { TIPOS_DE_OPERADORES, TipoOperador } from './(modelos)/tipo-operador';

const IfContainer = dynamic(() => import('@/components/if-container'));
const LoadingSpinner = dynamic(() => import('@/components/loading-spinner'));

interface UnidadRRHHPageProps {
  params: {
    rutempleador: string;
  };
}

const UnidadRRHHPage: React.FC<UnidadRRHHPageProps> = ({ params: { rutempleador } }) => {
  const search = useSearchParams();

  // prettier-ignore
  const tabOperadorQuery: TipoOperador = TIPOS_DE_OPERADORES.find((x) => x === search.get('operador')) ?? 'imed';

  const [tabOperador, setTabOperador] = useState<TipoOperador>(tabOperadorQuery);

  const [idunidad, setIdUnidad] = useState<string | undefined>(undefined);

  const [abrirModalCrearUnidad, setAbrirModalCrearUnidad] = useState(false);

  const [abrirModalEditarUnidad, setAbrirModalEditarUnidad] = useState(false);

  const { empleadorActual, rolEnEmpleadorActual } = useEmpleadorActual();

  const [unidadesFiltradas, setunidadesFiltradas] = useState<Unidadesrrhh[] | undefined>([]);

  const [refrescar, refrescarUnidades] = useRefrescarPagina();

  const { usuario } = useContext(AuthContext);

  const [errorCargarUnidad, unidades, cargandoUnidades] = useFetch(
    empleadorActual
      ? buscarUnidadesDeRRHH(empleadorActual.rutempleador, tabOperador == 'imed' ? 3 : 4)
      : emptyFetch(),
    [refrescar, empleadorActual, tabOperador],
  );

  const {
    datosGuia: { AgregarGuia, listaguia, guia },
  } = useContext(AuthContext);

  const tabulador = useRef(null);
  const botonAgregarUnidad = useRef(null);

  // Actualiza URL en cambio de operador
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('operador', tabOperador);
    window.history.pushState({}, '', url);
  }, [tabOperador]);

  useEffect(() => {
    setunidadesFiltradas(unidades);
  }, [unidades]);

  useEffect(() => {
    AgregarGuia([
      {
        indice: 0,
        nombre: 'Menu lateral',
        activo: true,
      },
      {
        indice: 1,
        nombre: 'Tab Operadores',
        activo: false,
      },
      {
        indice: 3,
        nombre: 'Agregar Unidad RRHH',
        activo: false,
      },
    ]);
  }, []);

  return (
    <>
      <Titulo url="">
        Entidad Empleadora - <b>{empleadorActual?.razonsocial ?? ''}</b> / Unidades de RRHH
      </Titulo>

      <GuiaUsuario guia={listaguia[1]!?.activo && guia} placement="top-start" target={tabulador}>
        Menú para datos de Operadores <br />
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
                  nombre: 'Tab Operadores',
                  activo: false,
                },
                {
                  indice: 3,
                  nombre: 'Agregar Unidad RRHH',
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
          &nbsp;
          <button
            className="btn btn-sm text-white"
            onClick={() =>
              AgregarGuia([
                {
                  indice: 0,
                  nombre: 'Menu lateral',
                  activo: false,
                },
                {
                  indice: 1,
                  nombre: 'Tab Operadores',
                  activo: false,
                },
                {
                  indice: 3,
                  nombre: 'Agregar Unidad RRHH',
                  activo: true,
                },
              ])
            }
            style={{
              border: '1px solid white',
            }}>
            Continuar &nbsp;
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </GuiaUsuario>

      <Nav
        variant="tabs"
        className={`mt-4 ${listaguia[1]!?.activo && guia && 'overlay-marco'}`}
        ref={tabulador}>
        <Nav.Link active={tabOperador === 'imed'} onClick={() => setTabOperador('imed')}>
          I-MED
        </Nav.Link>
        <Nav.Link active={tabOperador === 'medipass'} onClick={() => setTabOperador('medipass')}>
          MEDIPASS
        </Nav.Link>
      </Nav>

      <div className="row my-4 g-3">
        <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xxl-4">
          <input
            className="form-control"
            type="search"
            placeholder="Buscar unidad de RRHH"
            onChange={(e) => {
              setunidadesFiltradas(
                unidades?.filter(
                  ({ GlosaUnidadRRHH, CodigoUnidadRRHH, Direccion }) =>
                    GlosaUnidadRRHH.toUpperCase().includes(e.target.value.toUpperCase()) ||
                    CodigoUnidadRRHH.includes(e.target.value) ||
                    Direccion.toUpperCase().includes(e.target.value.toUpperCase()),
                ),
              );
            }}
          />
        </div>

        <IfContainer show={rolEnEmpleadorActual === 'administrador'}>
          <div className="col-12 col-sm-4 col-md-6 col-lg-7 col-xxl-8">
            <div className="w-100 d-flex flex-column flex-md-row justify-content-sm-end">
              <GuiaUsuario
                guia={listaguia[2]!?.activo && guia}
                target={botonAgregarUnidad}
                placement="top">
                Botón para agregar una nueva <br /> unidad de RRHH <br />
                <div className="text-end mt-2">
                  <button
                    className="btn btn-sm text-white"
                    onClick={() =>
                      AgregarGuia([
                        {
                          indice: 0,
                          nombre: 'Menu lateral',
                          activo: false,
                        },
                        {
                          indice: 1,
                          nombre: 'Tab Operadores',
                          activo: true,
                        },
                        {
                          indice: 3,
                          nombre: 'Agregar Unidad RRHH',
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
                  &nbsp;
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
                          nombre: 'Tab Operadores',
                          activo: false,
                        },
                        {
                          indice: 3,
                          nombre: 'Agregar Unidad RRHH',
                          activo: false,
                        },
                      ])
                    }
                    style={{
                      border: '1px solid white',
                    }}>
                    Continuar &nbsp;
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </GuiaUsuario>
              <button
                ref={botonAgregarUnidad}
                className={`btn btn-success ${listaguia[2]!?.activo && guia && 'overlay-marco'}`}
                disabled={cargandoUnidades || !!errorCargarUnidad}
                onClick={() => setAbrirModalCrearUnidad(true)}>
                + Agregar Unidad RRHH
              </button>
            </div>
          </div>
        </IfContainer>
      </div>

      <div className="row mt-2">
        <div className="col-md-12">
          <IfContainer show={cargandoUnidades}>
            <div className="my-4">
              <LoadingSpinner titulo="Cargando unidades " />
            </div>
          </IfContainer>

          <IfContainer show={!cargandoUnidades && errorCargarUnidad}>
            <h4 className="mt-4 mb-5 text-center">Error al cargar las unidades de RRHH</h4>
          </IfContainer>

          <IfContainer show={!cargandoUnidades && !errorCargarUnidad}>
            <TablaUnidades
              rutempleador={rutempleador}
              unidades={unidadesFiltradas ?? []}
              onEditarUnidad={({ CodigoUnidadRRHH }) => {
                setIdUnidad(CodigoUnidadRRHH);
                setAbrirModalEditarUnidad(true);
              }}
              onUnidadEliminada={() => refrescarUnidades()}
              operador={tabOperador == 'imed' ? 3 : 4}
            />
          </IfContainer>
        </div>
      </div>

      <ModalNuevaUnidad
        show={abrirModalCrearUnidad}
        rutempleador={rutempleador}
        onCerrarModal={() => setAbrirModalCrearUnidad(false)}
        onNuevaUnidadCreada={() => {
          setAbrirModalCrearUnidad(false);
          refrescarUnidades();
        }}
        operador={tabOperador == 'imed' ? 3 : 4}
      />

      {
        <ModalEditarUnidad
          show={abrirModalEditarUnidad}
          rutempleador={rutempleador}
          idUnidad={idunidad}
          Operador={tabOperador == 'imed' ? 3 : 4}
          onUnidadRRHHEditada={() => {
            setAbrirModalEditarUnidad(false);
            refrescarUnidades();
          }}
          onCerrarModal={() => {
            setIdUnidad(undefined);
            setAbrirModalEditarUnidad(false);
          }}
        />
      }
    </>
  );
};

export default UnidadRRHHPage;
