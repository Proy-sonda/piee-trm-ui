export interface BaseProps {
  /**
   * Label para el input.
   *
   * No se debe agregar `(*)` al final, el input detecta si incluirlo o no en el label dependiendo
   * de si es obligatorio u opcional.
   */
  label: string;

  /** El nombre del input para usar en la función `register` de `react-hook-form`. */
  name: string;

  className?: string;
  deshabilitado?: boolean;
}
