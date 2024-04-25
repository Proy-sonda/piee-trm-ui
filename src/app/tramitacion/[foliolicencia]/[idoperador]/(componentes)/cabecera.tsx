'use client';

import { LicenciaTramitar } from '@/app/tramitacion/(modelos)';
import { buscarLicenciasParaTramitar } from '@/app/tramitacion/(servicios)/buscar-licencias-para-tramitar';
import { Stepper, Titulo } from '@/components';
import { useMergeFetchObject, useRefrescarPagina } from '@/hooks';
import { useEffect, useState } from 'react';
import { InformacionLicencia } from '.';
import { interfaceCabecera } from '../(modelo)';

export const Cabecera: React.FC<interfaceCabecera> = ({
  foliotramitacion,
  step,
  title,
  rutEmpleador,
  idoperador,
  onLicenciaCargada,
  onLinkClickeado,
}) => {
  const [refrescar] = useRefrescarPagina();
  const [datopaciente, setdatopaciente] = useState<LicenciaTramitar>();
  const [, data, cargandoData] = useMergeFetchObject(
    {
      LMETRM: buscarLicenciasParaTramitar(),
    },
    [refrescar],
  );

  useEffect(() => {
    const licencia = data?.LMETRM.find(({ foliolicencia }) => foliotramitacion == foliolicencia);
    if (licencia && onLicenciaCargada) {
      onLicenciaCargada(licencia);
    }

    setdatopaciente(licencia);
    if (rutEmpleador == undefined) return;
    if (datopaciente?.rutempleador) rutEmpleador(datopaciente?.rutempleador);
  }, [
    cargandoData,
    data?.LMETRM,
    datopaciente?.rutempleador,
    foliotramitacion,
    onLicenciaCargada,
    rutEmpleador,
  ]);

  return (
    <>
      <div className="row">
        <Titulo url="">
          <h1 className="p-0 m-0 fs-5">Tramitación / Tramitar</h1>
        </Titulo>
      </div>

      <div className="row mt-4">
        <InformacionLicencia folioLicencia={foliotramitacion} idoperador={idoperador} />
      </div>
      <div className="row me-5">
        <div className="mt-3 mb-4 mx-0 mx-md-5">
          <Stepper Options={step} onLinkClickeado={onLinkClickeado} />
        </div>
      </div>
      <div className="row mt-2">
        <h5>{title}</h5>
        <hr />
      </div>
    </>
  );
};
