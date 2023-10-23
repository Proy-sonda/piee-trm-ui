import Swal from 'sweetalert2';

/**
 * Alerta sin botón de confirmación que se cierra automaticamente.
 *
 * Por defecto tiene un ícono de éxito
 */
export const AlertaDeExito = Swal.mixin({
  icon: 'success',
  timer: 2000,
  showConfirmButton: false,
});

/**
 * Alerta con solo un botón de confirmación que se debe cerrar manualmente.
 *
 * Por defecto tiene un ícono de error.
 */
export const AlertaDeError = Swal.mixin({
  icon: 'error',
  showConfirmButton: true,
  confirmButtonColor: 'var(--color-blue)',
  confirmButtonText: 'OK',
});

/**
 * Alerta para hacer una pregunta de `SÍ` o `NO`.
 *
 * Por defecto tiene un ícono de pregunta
 */
export const AlertaConfirmacion = Swal.mixin({
  icon: 'question',
  showConfirmButton: true,
  confirmButtonText: 'SÍ',
  confirmButtonColor: 'var(--color-blue)',
  showDenyButton: true,
  denyButtonColor: 'var(--bs-danger)',
  denyButtonText: 'NO',
});
