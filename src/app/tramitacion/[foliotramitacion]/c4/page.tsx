'use client';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import Cabecera from '../(componentes)/cabecera';
interface myprops {
  params: {
    foliotramitacion: string;
  };
}
const C4Page: React.FC<myprops> = ({ params: { foliotramitacion } }) => {
  const step = [
    { label: 'Entidad Empleadora/Independiente', num: 1, active: false, url: '/adscripcion' },
    { label: 'Previsión persona trabajadora', num: 2, active: false, url: '/adscripcion/pasodos' },
    { label: 'Renta y/o subsidios', num: 3, active: false, url: '/adscripcion/pasodos' },
    { label: 'LME Anteriores', num: 4, active: true, url: '/adscripcion/pasodos' },
  ];
  return (
    <div className="bgads">
      <div className="ms-5 me-5">
        <Cabecera
          foliotramitacion={foliotramitacion}
          step={step}
          title="Licencias Anteriores en los Últimos 6 Meses"
        />

        <div className="row mt-2">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Informar Licencias Médicas Anteriores últimos 6 meses
            </label>
          </div>
        </div>

        <div className="row mt-2">
          <Table className="table table-bordered">
            <Thead>
              <Tr className="align-middle">
                <Th>Total Días</Th>
                <Th>Desde</Th>
                <Th>Hasta</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>
                  <input className="form-control" />
                </Td>
                <Td>
                  <input type="date" className="form-control" />
                </Td>
                <Td>
                  <input type="date" className="form-control" />
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <input className="form-control" />
                </Td>
                <Td>
                  <input type="date" className="form-control" />
                </Td>
                <Td>
                  <input type="date" className="form-control" />
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <input className="form-control" />
                </Td>
                <Td>
                  <input type="date" className="form-control" />
                </Td>
                <Td>
                  <input type="date" className="form-control" />
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <input className="form-control" />
                </Td>
                <Td>
                  <input type="date" className="form-control" />
                </Td>
                <Td>
                  <input type="date" className="form-control" />
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <input className="form-control" />
                </Td>
                <Td>
                  <input type="date" className="form-control" />
                </Td>
                <Td>
                  <input type="date" className="form-control" />
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <input className="form-control" />
                </Td>
                <Td>
                  <input type="date" className="form-control" />
                </Td>
                <Td>
                  <input type="date" className="form-control" />
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
            <button className="btn btn-primary">Tramitar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default C4Page;
