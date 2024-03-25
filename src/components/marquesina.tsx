'use client';

import { useFetch } from '@/hooks';
import { obtenerMensajes } from '@/servicios/obtiene-mensajes';
import { useEffect, useState } from 'react';

const Marquesina = () => {
  const [error, mensajes, pendiente] = useFetch(obtenerMensajes());
  const [mensajemarquesina, setmensajemarquesina] = useState<string>('');

  useEffect(() => {
    if (mensajes) {
      const marquesina = mensajes.find((m) => m.idmensajegeneral === 1)!?.mensaje || '';

      //validamos si se encuentra en la fecha de inicio y fin de la marquesina
      const fechainicio = mensajes.find((m) => m.idmensajegeneral === 1)!?.fechainicio || '';
      const fechafin = mensajes.find((m) => m.idmensajegeneral === 1)!?.fechatermino || '';
      const fechaactual = new Date();
      if (fechaactual >= new Date(fechainicio) && fechaactual <= new Date(fechafin)) {
        setmensajemarquesina(marquesina);
      } else {
        setmensajemarquesina('');
      }
    }
  }, [mensajes]);

  return (
    <div
      className="alert alert-warning alert-dismissible fade show"
      role="alert"
      style={{
        display: mensajemarquesina ? 'block' : 'none',
      }}>
      <b dangerouslySetInnerHTML={{ __html: mensajemarquesina }} />
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"></button>
    </div>
  );
};

export default Marquesina;
