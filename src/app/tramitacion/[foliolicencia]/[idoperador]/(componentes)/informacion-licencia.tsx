import { LicenciaContext } from '@/app/tramitacion/(context)/licencia.context';
import { buscarLicenciasParaTramitar } from '@/app/tramitacion/(servicios)/buscar-licencias-para-tramitar';
import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import { addDays, format } from 'date-fns';
import React, { useContext, useEffect } from 'react';
import { LicenciaTramitar } from '../../../(modelos)/licencia-tramitar';

interface InformacionLicenciaProps {
  folioLicencia: string;
  idoperador: number;
  onLicenciaCargada?: (licencia: LicenciaTramitar) => void;
  noTramitar?: boolean;
}

export const InformacionLicencia: React.FC<InformacionLicenciaProps> = ({
  folioLicencia,
  idoperador,
  onLicenciaCargada,
  noTramitar,
}) => {
  const { licencia, setLicencia } = useContext(LicenciaContext);

  useEffect(() => {
    if (licencia && onLicenciaCargada) {
      onLicenciaCargada(licencia);
    }

    if (noTramitar && licencia.foliolicencia == '') {
      const buscarLicencia = async () => {
        try {
          const [resp] = await buscarLicenciasParaTramitar();
          const licencias = await resp();
          const licencia = licencias.find(({ foliolicencia }) => foliolicencia == folioLicencia);
          if (licencia !== undefined) setLicencia(licencia);
        } catch (error) {}
      };
      buscarLicencia();
    }
  }, [licencia, onLicenciaCargada]);

  const calcularFechaFin = () => {
    return addDays(new Date(licencia!.fechaemision), licencia!.diasreposo);
  };

  return (
    <div>
      <IfContainer show={licencia.foliolicencia == ''}>
        <LoadingSpinner titulo="Cargando información" />
      </IfContainer>
      <IfContainer show={licencia.foliolicencia != '' && licencia !== undefined}>
        {() => (
          <div className="small">
            <p>
              Licencia otorgada el día{' '}
              <b>{format(new Date(licencia!.fechaemision), 'dd/MM/yyyy')}</b> en plataforma operador{' '}
              <b>{licencia?.operador.operador}</b> por <b>{licencia?.entidadsalud.nombre}</b> con
              Folio <b>{folioLicencia}</b> por <b>{licencia?.tipolicencia.tipolicencia}</b>, a la
              persona trabajadora{' '}
              <b>
                {licencia?.runtrabajador} {licencia?.nombres} {licencia?.apellidopaterno}{' '}
                {licencia?.apellidomaterno}
              </b>{' '}
              estableciendo <b>{licencia?.tiporeposo.tiporeposo}</b> por{' '}
              <b>{licencia?.diasreposo} día(s)</b> desde{' '}
              <b>{format(new Date(licencia!?.fechainicioreposo), 'dd/MM/yyyy')} </b>
              al <b>{format(calcularFechaFin(), 'dd/MM/yyyy')}</b>
            </p>
          </div>
        )}
      </IfContainer>
    </div>
  );
};
