import { LicenciaTramitar } from '../(modelos)';
import { buscarZona0 } from '../[foliolicencia]/[idoperador]/c1/(servicios)';

export const agregarEstadoDeTramitacion = async (licencia: LicenciaTramitar) => {
  if (licencia.estadoTramitacion !== undefined) {
    return licencia;
  }

  const [request] = buscarZona0(licencia.foliolicencia, licencia.operador.idoperador);

  licencia.estadoTramitacion = await request().then((zona0) => zona0?.estadotramitacion);

  return licencia;
};
