import { LicenciaC0 } from '@/app/tramitacion/[foliolicencia]/[idoperador]/c1/(modelos)';
import { UsuarioEntidadEmpleadoraAPI } from '@/modelos';
import { format } from 'date-fns';
import React from 'react';

interface DatosLicenciaProps {
  licencia: LicenciaC0;
  usuarioTramitador?: UsuarioEntidadEmpleadoraAPI;
}

export const DatosLicencia: React.FC<DatosLicenciaProps> = ({
  licencia: zona0,
  usuarioTramitador,
}) => {
  return (
    <>
      <h3 className="mb-3 fs-6">Persona Trabajadora</h3>
      <table className="table">
        <tbody>
          <tr>
            <td>RUN</td>
            <td>{`${zona0.nombres} ${zona0.apellidopaterno} ${zona0.apellidomaterno}`}</td>
          </tr>
          <tr>
            <td>NOMBRE</td>
            <td>{zona0.ruttrabajador}</td>
          </tr>
        </tbody>
      </table>

      <h3 className="mt-4 mb-3 fs-6">Usuario Tramitación</h3>
      <table className="table">
        <tbody>
          <tr>
            <td>RUN</td>
            <td>{usuarioTramitador ? usuarioTramitador.rutusuario : 'NO DISPONIBLE'}</td>
          </tr>
          <tr>
            <td>NOMBRE</td>
            <td>
              {usuarioTramitador
                ? `${usuarioTramitador.nombres} ${usuarioTramitador.apellidos}`
                : 'NO DISPONIBLE'}
            </td>
          </tr>
        </tbody>
      </table>

      <h3 className="mt-4 mb-3 fs-6">Descripción LME</h3>
      <table className="table">
        <tbody>
          <tr>
            <td>{zona0.tiporeposo.tiporeposo}</td>
            <td>{zona0.ndias} día(s)</td>
          </tr>
          <tr>
            <td>INICIO REPOSO</td>
            <td>{format(new Date(zona0.fechainicioreposo), 'dd-MM-yyyy')}</td>
          </tr>
          <tr>
            <td>FECHA DE EMISIÓN</td>
            <td>{format(new Date(zona0.fechaemision), 'dd-MM-yyyy')}</td>
          </tr>
          <tr>
            <td>TIPO LICENCIA</td>
            <td>{zona0.tipolicencia.tipolicencia}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
