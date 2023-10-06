'use client';
import { Stepper } from '@/components/stepper/stepper';
import Titulo from '@/components/titulo/titulo';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import { useEffect, useState } from 'react';
import { LicenciaTramitar } from '../../(modelos)/licencia-tramitar';
import { buscarLicenciasParaTramitar } from '../../(servicios)/buscar-licencias-para-tramitar';
import InformacionLicencia from './informacion-licencia';

interface myprops {
  foliotramitacion: string;
  step: any[];
  title: string;
  rutEmpleador?: (run: string) => void;
}
const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour12: false, // Para usar formato de 24 horas
};

const Cabecera: React.FC<myprops> = ({ foliotramitacion, step, title, rutEmpleador }) => {
  const [refrescar, refrescarPagina] = useRefrescarPagina();
  const [datopaciente, setdatopaciente] = useState<LicenciaTramitar>();
  const [fechafin, setfechafin] = useState<string>('');
  const [errorCargaData, data, cargandoData] = useMergeFetchObject(
    {
      LMETRM: buscarLicenciasParaTramitar(),
    },
    [refrescar],
  );

  useEffect(() => {
    setdatopaciente(data?.LMETRM.find(({ foliolicencia }) => foliotramitacion == foliolicencia));
    if (rutEmpleador == undefined) return;
    if (datopaciente?.rutempleador) rutEmpleador(datopaciente?.rutempleador);
  }, [cargandoData]);

  useEffect(() => {
    if (data?.LMETRM == undefined) return;
    let fechainicio = new Date(datopaciente!?.fechainicioreposo);
    let fechafin = fechainicio.setDate(fechainicio.getDate() + datopaciente!?.diasreposo);

    setfechafin(new Date(fechafin).toLocaleString('es-CL', options));
  }, [datopaciente]);

  return (
    <>
      <div className="row mt-5">
        <Titulo url="">Tramitación / Tramitar</Titulo>
      </div>
      <div className="row mt-2">
        <InformacionLicencia folioLicencia={foliotramitacion} />
      </div>
      <div className="row me-5">
        <div className="mt-3 mb-4 mx-0 mx-md-5">
          <Stepper Options={step} />
        </div>
      </div>
      <div className="row mt-2">
        <h5>{title}</h5>
        <hr />
      </div>
    </>
  );
};

export default Cabecera;
