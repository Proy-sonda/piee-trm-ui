'use client';
import { useRouter } from 'next/navigation';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import Cabecera from '../(componentes)/cabecera';

interface myprops {
  params: {
    foliotramitacion: string;
  };
}

const C3Page: React.FC<myprops> = ({ params: { foliotramitacion } }) => {
  const router = useRouter();
  const step = [
    { label: 'Entidad Empleadora/Independiente', num: 1, active: false, url: '/adscripcion' },
    { label: 'Previsión persona trabajadora', num: 2, active: false, url: '/adscripcion/pasodos' },
    { label: 'Renta y/o subsidios', num: 3, active: true, url: '/adscripcion/pasodos' },
    { label: 'LME Anteriores', num: 4, active: false, url: '/adscripcion/pasodos' },
  ];
  return (
    <div className="bgads">
      <div className="ms-5 me-5">
        <Cabecera
          foliotramitacion={foliotramitacion}
          step={step}
          title="Informe de Remuneraciones Rentas y/o Subsidios"
        />
        <div className="row mt-2">
          <h6 className="text-center">RENTAS DE MESES ANTERIORES A LA FECHA DE LA INCAPACIDAD</h6>
        </div>
        <div className="row mt-2">
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
                    <button className="btn btn-primary">
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
        <div className="row mt-3">
          <h6 className="text-center">
            EN CASO DE LICENCIAS MATERNALES (TIPO 3) SE DEBE LLENAR ADEMÁS EL RECUADRO SIGUIENTE
          </h6>
        </div>
        <div className="row mt-2">
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
                    <button className="btn btn-primary">
                      <i className="bi bi-bounding-box-circles"></i>
                    </button>
                  </div>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </div>

        <div className="row mt-3">
          <h5>Documentos Adjuntos</h5>
          <p>
            Se recomienda adjuntar liquidaciones generadas por su sistema de remuneración (Exccel,
            Word, PDF, ETC) El tamaño máximo permitido por archivo es de 10 MB.
          </p>
        </div>
        <div className="row mt-3">
          <div className="col-md-4 mb-2">
            <label>Tipo de documento</label>
            <select className="form-select">
              <option value={''}>Seleccionar</option>
              <option value={1}>Comprobante Liquidacion Mensual</option>
              <option value={2}>Contrato de Trabajo Vigente a la fecha</option>
              <option value={3}>Certificado de Pago Cotizaciones</option>
              <option value={4}>Comprobante Pago Cotizaciones operación Renta</option>
            </select>
          </div>
          <div className="col-md-4 mb-2">
            <label>Adjuntar documento</label>
            <input type="file" className="form-control" />
          </div>
          <div
            className="col-md-4 mb-2"
            style={{
              alignSelf: 'end',
            }}>
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
            <button
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                router.push(`/tramitacion/${foliotramitacion}/c4`);
              }}>
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default C3Page;
