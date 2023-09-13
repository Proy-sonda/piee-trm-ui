import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { ActualizarUnidadRequest } from '../(modelos)/datos-actualizar-unidad';

export const actualizarUnidad = (request: ActualizarUnidadRequest) => {
  const payload = {
    idunidad: request.unidadId,
    unidad: request.nombre,
    identificador: request.identificadorUnico,
    email: request.email,
    telefono: request.telefono,
    direccionunidad: {
      calle: request.calle,
      comuna: {
        idcomuna: request.comunaId,
        nombre: ' ',
      },
      depto: request.departamento,
      numero: request.numero,
    },
    estadounidadrrhh: {
      idestadounidadrrhh: 1,
      descripcion: 'SUSCRITO',
    },
    empleador: {
      idempleador: request.empleadorId,
    },
  };

  return runFetchConThrow<void>(`${apiUrl()}/unidad/update`, {
    method: 'PUT',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};
