import { format } from 'date-fns';
import React from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { EventoCron } from '../(modelos)';

interface TablaEventosCronesProps {
  eventos: EventoCron[];
}

export const TablaEventosCrones: React.FC<TablaEventosCronesProps> = ({ eventos }) => {
  return (
    <>
      <Table className="table table-hover">
        <Thead className="align-middle">
          <Tr>
            <Th>Fecha</Th>
            <Th>Tipo de Evento</Th>
            <Th>Observaciones</Th>
          </Tr>
        </Thead>
        <Tbody className="align-middle">
          {eventos.length > 0 ? (
            eventos.map((eventoCron) => (
              <Tr key={eventoCron.id} className="align-middle">
                <Td>{format(new Date(eventoCron.fecha), 'yyyy/MM/dd hh:mm:ss')}</Td>
                <Td>{eventoCron.tipoEvento.glosa} </Td>
                <Td>{eventoCron.observaciones}</Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td>-</Td>
              <Td>-</Td>
              <Td>-</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </>
  );
};
