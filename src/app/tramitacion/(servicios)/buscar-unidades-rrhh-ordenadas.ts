import { Unidadesrrhh } from '@/modelos';
import { buscarUnidadesDeRRHH, FetchAbortableResponse } from '@/servicios';

/** Retorna las unidades de un empleador ordenas por operador y en orden alfabetico */
export const buscarUnidadesRRHHOrdenadas = (
  rutEmpleador: string,
): FetchAbortableResponse<Unidadesrrhh[]> => {
  const [reqImed, abortImed] = buscarUnidadesDeRRHH(rutEmpleador, 3);
  const [reqMedipass, abortmedipass] = buscarUnidadesDeRRHH(rutEmpleador, 4);

  const newCallback = async () => {
    const [unidadesImed, unidadesMedipass] = await Promise.all([reqImed(), reqMedipass()]);
    const unidadesImedOrdenadas = ordenarUnidades(unidadesImed, 'imed');
    const unidadesMedipassOrdenadas = ordenarUnidades(unidadesMedipass, 'medipass');
    return unidadesImedOrdenadas.concat(unidadesMedipassOrdenadas);
  };

  const nuevoAbortador = () => {
    abortImed();
    abortmedipass();
  };

  return [newCallback, nuevoAbortador];
};

function ordenarUnidades(unidades: Unidadesrrhh[], operador: string): Unidadesrrhh[] {
  return unidades
    .sort((a, b) => a.GlosaUnidadRRHH.localeCompare(b.GlosaUnidadRRHH))
    .map((unidad) => ({
      ...unidad,
      GlosaUnidadRRHH: `(${operador}) ${unidad.GlosaUnidadRRHH}`,
    }));
}
