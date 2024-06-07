import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { EmpleadorUnidad, Unidadesrrhh } from '../(modelos)/payload-unidades';


export const eliminarUnidad = (
  unidadesrrhh: Unidadesrrhh,
  RutEmpleador: string,
  RunUsuario: string,
  operador:number
) => {
  const payload: EmpleadorUnidad = {
    RunUsuario,
    RutEmpleador,
    unidadesrrhh,
    operador
  };
  // @ts-ignore
  delete payload.unidadesrrhh!?.RolUsuario;

  if(payload.unidadesrrhh?.CodigoRegion.length == 1){
    payload.unidadesrrhh.CodigoRegion = `0${payload.unidadesrrhh.CodigoRegion}`
  }
  if(payload.unidadesrrhh?.CodigoComuna.length == 4){
    payload.unidadesrrhh.CodigoComuna = `0${payload.unidadesrrhh.CodigoComuna}`
  }

  console.log(payload)
  

  return runFetchConThrow<void>(`${urlBackendTramitacion()}/operadores/actualizarrhhusu`, {
    method: 'PUT',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};
