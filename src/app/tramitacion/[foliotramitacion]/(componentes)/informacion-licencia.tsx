import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import { useFetch } from '@/hooks/use-merge-fetch';
import { addDays, format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { LicenciaTramitar } from '../../(modelos)/licencia-tramitar';
import { buscarLicenciasParaTramitar } from '../../(servicios)/buscar-licencias-para-tramitar';

interface InformacionLicenciaProps {
  folioLicencia: string;
}

const InformacionLicencia: React.FC<InformacionLicenciaProps> = ({ folioLicencia }) => {
  const [, licenciasTramitar, cargando] = useFetch(buscarLicenciasParaTramitar());

  const [licencia, setLicencia] = useState<LicenciaTramitar | undefined>();

  useEffect(() => {
    setLicencia((licenciasTramitar ?? []).find((lic) => lic.foliolicencia === folioLicencia));
  }, [licenciasTramitar]);

  const calcularFechaFin = () => {
    return addDays(new Date(licencia!.fechaemision), licencia!.diasreposo);
  };

  return (
    <div>
      <IfContainer show={cargando}>
        <LoadingSpinner titulo="Cargando información" />
      </IfContainer>
      <IfContainer show={!cargando && licencia !== undefined}>
        {() => (
          <div className="small">
            <p>
              Licencia otorgada el día{' '}
              <b>{format(new Date(licencia!.fechaemision), 'dd/MM/yyyy')}</b> en plataforma operador{' '}
              <b>{licencia?.operador.operador}</b> con Folio <b>{folioLicencia}</b> por{' '}
              <b>{licencia?.tipolicencia.tipolicencia}</b>, a la persona trabajadora{' '}
              <b>
                {licencia?.runtrabajador} {licencia?.nombres} {licencia?.apellidopaterno}{' '}
                {licencia?.apellidomaterno}
              </b>{' '}
              estableciendo <b>{licencia?.tiporesposo.tiporeposo}</b> por{' '}
              <b>{licencia?.diasreposo} días(s)</b> desde{' '}
              <b>{format(new Date(licencia!?.fechainicioreposo), 'dd/MM/yyyy')} </b>
              al <b>{format(calcularFechaFin(), 'dd/MM/yyyy')}</b>
            </p>
          </div>
        )}
      </IfContainer>
    </div>
  );
};

export default InformacionLicencia;