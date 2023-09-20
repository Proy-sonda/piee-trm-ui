import { logout, renovarToken } from '@/servicios/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const SessionTimer = () => {
  const [isActive, setIsActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(900); // Tiempo inicial en segundos
  const alertThreshold = 5; // Mostrar la alerta 5 segundos antes de expirar

  const router = useRouter();

  useEffect(() => {
    let inactivityTimer: any;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);

      let timerInterval: any;
      inactivityTimer = setTimeout(
        () => {
          setIsActive(false);
          // Mostrar la alerta utilizando SweetAlert2
          Swal.fire({
            title: 'Aviso de cierre de sesión',
            html: `
            <p>Su sesión está a punto de expirar, ¿Necesita más tiempo?</p>
            <b>15</b>
          `,
            icon: 'warning',
            showConfirmButton: true,
            timer: 15000,
            timerProgressBar: true,
            confirmButtonText: 'Mantener sesión activa',
            confirmButtonColor: 'var(--color-blue)',
            showCancelButton: true,
            cancelButtonText: 'Cerrar sesión',
            cancelButtonColor: 'var(--bs-danger)',
            didOpen: () => {
              const b: any = Swal.getHtmlContainer()?.querySelector('b');
              timerInterval = setInterval(() => {
                b.textContent = Math.round((Swal.getTimerLeft() ?? 0) / 1000);
              }, 1000);
            },
            didClose: () => {
              clearInterval(timerInterval);
            },
          }).then((result) => {
            if (result.isConfirmed) {
              (async () => {
                try {
                  await renovarToken();
                } catch (error) {
                  await logout();
                  router.push('/');
                }
              })();
            } else {
              (async () => {
                try {
                  await logout();
                } catch (error) {
                  console.error('[SESION TIMER] ERROR EN LOGOUT: ', error);
                } finally {
                  router.push('/');
                }
              })();
            }
          });
        },
        (10 - alertThreshold) * 1000,
      ); // 60 segundos - alertThreshold

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
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isActive]);

  return <div>{/* No se necesita contenido aquí ya que está en la alerta */}</div>;
};

export default SessionTimer;
