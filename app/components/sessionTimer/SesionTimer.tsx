import { Logout, renovacionToken } from '@/app/helpers/tramitacion/empleadores';
import { useRouter } from 'next/navigation';
import { setCookie, destroyCookie } from 'nookies';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const SessionTimer = () => {
  const [isActive, setIsActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(900); // Tiempo inicial en segundos
  const alertThreshold = 5; // Mostrar la alerta 5 segundos antes de expirar

  const router = useRouter();

  useEffect(() => {
    let inactivityTimer:any;


    const resetTimer = () => {

      clearTimeout(inactivityTimer);
      let timerInterval;
      inactivityTimer = setTimeout(() => {
        setIsActive(false);
        // Mostrar la alerta utilizando SweetAlert2
        Swal.fire({
          title: 'Aviso de cierre de sesión',
          html: `
            <p>Tu sesión está a punto de expirar, ¿Necesitas más tiempo?</p>
            <b></b>
          `,
          icon: 'warning',
          showConfirmButton: true,
          timer: 15000,
          timerProgressBar: true,
          confirmButtonText: 'Mantener sesión activa',
          showCancelButton: true,
          cancelButtonText: 'Cerrar sesión',
          didOpen: () => {
            // Swal.showLoading()
            const b : any= Swal.getHtmlContainer()?.querySelector('b')
            timerInterval = setInterval(() => {
              b.textContent = Swal.getTimerLeft()
            }, 100)
          },
        }).then((result) => {

          if (result.isConfirmed) {

            const resp = async () => {
              const data = await renovacionToken();
              if (data.ok) {
                let token = await data.text();
                setCookie(null,'token',token, { maxAge: 3600, path: '/' });
              }
            }
            resp();

          }else{

            const resp = async()=> {
              const data = await Logout();
              if(data.ok){
                destroyCookie(null, 'token');
                router.push('/');
              }
            }

            resp();

          }
          
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