'use client';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import Cabecera from '../(componentes)/cabecera';

interface myprops {
  params: {
    foliotramitacion: string;
  };
}

const C3Page: React.FC<myprops> = ({ params: { foliotramitacion } }) => {
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
                <Td></Td>
              </Tr>
            </Tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default C3Page;
