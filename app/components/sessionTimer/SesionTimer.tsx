import { renovacionToken } from '@/app/helpers/tramitacion/empleadores';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const SessionTimer = () => {
  const [isActive, setIsActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10); // Tiempo inicial en segundos
  const alertThreshold = 5; // Mostrar la alerta 5 segundos antes de expirar

  useEffect(() => {
    let inactivityTimer:any;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        setIsActive(false);
        // Mostrar la alerta utilizando SweetAlert2
        Swal.fire({
          title: 'Aviso de cierre de sesión',
          html: `
            <p>Tu sesión está a punto de expirar, ¿Necesitas más tiempo?</p>
            <div class="progress">
              <div class="progress-bar" role="progressbar" style="width: ${(
                timeLeft / 60
              ) * 100}%;" aria-valuenow="${timeLeft}" aria-valuemin="0" aria-valuemax="60"></div>
            </div>
          `,
          icon: 'warning',
          showConfirmButton: true,
          timer: 5000,
          confirmButtonText: 'Mantener sesión activa',
          showCancelButton: true,
          cancelButtonText: 'Cerrar sesión'
        }).then((result) => {

          if(result.isConfirmed)
          {
            
            const resp = async()=> {
                const data = await renovacionToken();
                if(data.ok){
                  const respuesta = await data.json();
                  console.log(respuesta)
                }
            }
            resp();

          }
          // Aquí puedes realizar alguna acción adicional si lo deseas
          // (por ejemplo, redirigir al usuario a la página de inicio de sesión).
        });
      }, (60 - alertThreshold) * 1000); // 60 segundos - alertThreshold

      document.addEventListener('mousemove', resetTimer);
      document.addEventListener('keydown', resetTimer);
    };

    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      document.removeEventListener('mousemove', resetTimer);
      document.removeEventListener('keydown', resetTimer);
    };
  }, []);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isActive]);

  return <div>{/* No se necesita contenido aquí ya que está en la alerta */}</div>;
};

export default SessionTimer;