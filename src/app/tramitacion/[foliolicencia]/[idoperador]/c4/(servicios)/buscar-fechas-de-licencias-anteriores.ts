import { FetchAbortableResponse } from '@/servicios';
import { compareDesc, format } from 'date-fns';
import { RangoLmeAnterioresSugerido } from '../(modelos)';
import { LicenciaAnteriorZC4 } from '../../(modelo)/licencias-anteriores';
import { BuscarLicenciasAnteriores } from '../../(servicios)/buscar-licencias-anteriores';

/**
 * Busca las licencias anteriores de los ultimos 6 meses para la zona 4 en licencias tramitadas
 * en portal PIEE para un trabajador. Las fechas se devuelven de la mas reciente a la mas antigua
 * y solo las que esten en el rango indicado (inclusivos ambos extemos).
 *
 * @returns
 */
export const buscarFechasDeLicenciasAnteriores = (
  rutTrabajador: string,
  rangoSugerido: RangoLmeAnterioresSugerido,
) => {
  const [request, abortador] = BuscarLicenciasAnteriores(rutTrabajador);

  const nuevoCallback = async () => {
    const licenciasAnteriores = await request().then((las) =>
      las.length > 0 ? las[0] : undefined,
    );

    const licenciasZona4 = licenciasAnteriores?.licenciazc4 ?? [];

    return licenciasZona4
      .sort((a, b) => compareDesc(new Date(a.lmafechadesde), new Date(b.lmafechadesde)))
      .filter(({ lmafechadesde }) => {
        const fechaSugerida = format(new Date(lmafechadesde), 'yyyy-MM-dd');
        return rangoSugerido.desde <= fechaSugerida && fechaSugerida <= rangoSugerido.hasta;
      });
  };

  return [nuevoCallback, abortador] as FetchAbortableResponse<LicenciaAnteriorZC4[]>;
};
