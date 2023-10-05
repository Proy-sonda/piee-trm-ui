'use client';
import { ComboSimple, InputArchivo } from '@/components/form';
import IfContainer from '@/components/if-container';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import Swal from 'sweetalert2';
import Cabecera from '../(componentes)/cabecera';
import { BuscarTipoDocumento } from '../(servicios)/tipo-documento';
import { LicenciaTramitar } from '../../(modelos)/licencia-tramitar';
import ModalDesgloseDeHaberes from './(componentes/modal-desglose-haberes';

interface myprops {
  params: {
    foliotramitacion: string;
  };
}
interface FormularioC3 {
  tipoDocumento: string;
}

const C3Page: React.FC<myprops> = ({ params: { foliotramitacion } }) => {
  const router = useRouter();

  const formulario = useForm<FormularioC3>({ mode: 'onBlur' });

  const [licencia, setLicencia] = useState<LicenciaTramitar | undefined>();

  const [abrirModalDesglose, setAbrirModalDesglose] = useState(false);

  const step = [
    { label: 'Entidad Empleadora/Independiente', num: 1, active: false, url: '/adscripcion' },
    { label: 'Previsión persona trabajadora', num: 2, active: false, url: '/adscripcion/pasodos' },
    { label: 'Renta y/o subsidios', num: 3, active: true, url: '/adscripcion/pasodos' },
    { label: 'LME Anteriores', num: 4, active: false, url: '/adscripcion/pasodos' },
  ];

  const [errorData, combos, cargandoCombos] = useMergeFetchObject({
    TIPODOCUMENTO: BuscarTipoDocumento(),
  });

  const pasarAPaso4: SubmitHandler<FormularioC3> = async (datos) => {
    console.log('Yendome a paso 4...');
    console.table(datos);

    const { isConfirmed } = await Swal.fire({
      html: `
        <p>Antes de seguir, recuerde confirmar que debe ingresar Comprobante de Liquidación mensual para todos los periodos declarados:</p>
          
          <li>Enero 2023</li>
          <li>Febrero 2023</li>
          <li>Marzo 2023</li>
          <li>Agosto 2022</li>
          <li>Septiembre 2022</li>
          <li>Octubre 2022</li>

        <p class="mt-3 fw-bold">¿Está seguro que desea continuar, o desea volver a ingresar o revisar la documentación?</p>
        `,
      showConfirmButton: true,
      confirmButtonText: 'Continuar',
      confirmButtonColor: 'var(--color-blue)',
      showCancelButton: true,
      cancelButtonText: 'Volver',
      cancelButtonColor: 'var(--bs-danger)',
    });

    if (!isConfirmed) {
      return;
    }

    router.push(`/tramitacion/${foliotramitacion}/c4`);
  };

  return (
    <FormProvider {...formulario}>
      <Form onSubmit={formulario.handleSubmit(pasarAPaso4)}>
        <ModalDesgloseDeHaberes
          show={abrirModalDesglose}
          onCerrar={() => setAbrirModalDesglose(false)}
          onDesgloseGuardardo={() => setAbrirModalDesglose(false)}
        />

        <div className="bgads">
          <div className="mx-3 mx-lg-5 pb-4">
            <Cabecera
              foliotramitacion={foliotramitacion}
              step={step}
              title="Informe de Remuneraciones Rentas y/o Subsidios"
              onLicenciaCargada={setLicencia}
            />

            <div className="row mt-2">
              <h6 className="mb-3 text-center">
                RENTAS DE MESES ANTERIORES A LA FECHA DE LA INCAPACIDAD
              </h6>

              <Table className="table table-bordered">
                <Thead>
                  <Tr className="align-middle text-center">
                    <Th>Institución Previsional</Th>
                    <Th>Periodo Renta </Th>
                    <Th> N° Días</Th>
                    <Th> Monto Imponible</Th>
                    <Th>Registrar Desglose de haberes</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {/* // Aquí es donde se va a iterar los elementos en el caso de que sea tipo 3 son 6. */}
                  <Tr>
                    <Td>{/* <ComboSimple descripcion="" name="" label="" idElemento="" /> */}</Td>
                    <Td>
                      <input className="form-control" />
                    </Td>
                    <Td>
                      <input className="form-control" />
                    </Td>
                    <Td>
                      <input className="form-control" />
                    </Td>
                    <Td>
                      <div className="align-middle text-center">
                        <button
                          className="btn btn-primary"
                          onClick={() => setAbrirModalDesglose(true)}>
                          <i className="bi bi-bounding-box-circles"></i>
                        </button>
                      </div>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </div>

            <div className="row mt-2">
              <div className="col-md-6 col-sm-6">
                <p>
                  <b>Remuneración imponible previsional mes anterior inicio licencia médica:</b>
                </p>
              </div>
              <div className="col-md-2 col-sm-6">
                <input className="form-control" />
              </div>
              <div className="col-md-2 col-sm-8 col-xs-8">
                <p>
                  <b>% Desahucio:</b>
                </p>
              </div>
              <div className="col-md-2 col-sm-4 col-xs-4">
                <input className="form-control" />
              </div>
            </div>

            <IfContainer show={licencia && licencia.tipolicencia.idtipolicencia === 3}>
              <div className="row mt-3">
                <h6 className="mb-3 text-center">
                  EN CASO DE LICENCIAS MATERNALES (TIPO 3) SE DEBE LLENAR ADEMÁS EL RECUADRO
                  SIGUIENTE
                </h6>

                <Table className="table table-bordered">
                  <Thead>
                    <Tr className="align-middle text-center">
                      <Th>Institución Previsional</Th>
                      <Th>Periodo Renta </Th>
                      <Th> N° Días</Th>
                      <Th> Monto Imponible</Th>
                      <Th>Registrar Desglose de haberes</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {/* // Aquí es donde se va a iterar los elementos en el caso de que sea tipo 3 son 6. */}
                    <Tr>
                      <Td>{/* <ComboSimple descripcion="" name="" label="" idElemento="" /> */}</Td>
                      <Td>
                        <input className="form-control" />
                      </Td>
                      <Td>
                        <input className="form-control" />
                      </Td>
                      <Td>
                        <input className="form-control" />
                      </Td>
                      <Td>
                        <div className="align-middle text-center">
                          <button
                            className="btn btn-primary"
                            onClick={() => setAbrirModalDesglose(true)}>
                            <i className="bi bi-bounding-box-circles"></i>
                          </button>
                        </div>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </div>
            </IfContainer>

            <div className="row mt-3">
              <h5>Documentos Adjuntos</h5>
              <p>
                Se recomienda adjuntar liquidaciones generadas por su sistema de remuneración
                (Exccel, Word, PDF, ETC) El tamaño máximo permitido por archivo es de 10 MB.
              </p>

              <ComboSimple
                label="Tipo de documento"
                name="tipoDocumento"
                descripcion="tipoadjunto"
                idElemento="idtipoadjunto"
                // datos={combos?.TIPODOCUMENTO} // TODO: descomentar
                datos={[
                  { idtipoadjunto: 1, tipoadjunto: 'Comprobante Liquidación Mensual' },
                  { idtipoadjunto: 2, tipoadjunto: 'Contrato de Trabajo Vigente a la Fecha' },
                  { idtipoadjunto: 3, tipoadjunto: 'Certificado de Pago Cotizaciones' },
                  {
                    idtipoadjunto: 4,
                    tipoadjunto: 'Comprobante Pago Cotizaciones Operación Renta',
                  },
                ]}
                className="col-md-4 mb-2"
              />

              <InputArchivo
                opcional
                name="documentosAdjuntos"
                label="Adjuntar documento"
                className="col-md-4 mb-2"
              />

              <div className="col-md-4 mb-2" style={{ alignSelf: 'end' }}>
                <button className="btn btn-primary">Adjuntar documento</button>
              </div>
            </div>

            <div className="row mt-3">
              <Table className="table table-bordered">
                <Thead>
                  <Tr className="align-middle">
                    <Th>Tipo Documento</Th>
                    <Th>Nombre Documento</Th>
                    <Th>Acciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr className="align-middle">
                    <Td>Comprobante Liquidacion Mensual</Td>
                    <Td>a</Td>
                    <Td>
                      <div className="d-flex justify-content-evenly">
                        <button className="btn btn-primary">
                          <i className="bi bi-file-earmark-plus"></i>
                        </button>
                        <button className="btn btn-danger">
                          <i className="bi bi-x"></i>
                        </button>
                      </div>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </div>

            <div className="row">
              <div className="d-none d-md-none col-lg-6 d-lg-inline"></div>
              <div className="col-sm-4 col-md-4 d-grid col-lg-2 p-2">
                <a className="btn btn-danger" href="/tramitacion">
                  Tramitación
                </a>
              </div>
              <div className="col-sm-4 col-md-4 d-grid col-lg-2 p-2">
                <button className="btn btn-success">Guardar</button>
              </div>
              <div className="col-sm-4 col-md-4 d-grid col-lg-2 p-2">
                <button className="btn btn-primary" type="submit">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </FormProvider>
  );
};

export default C3Page;
