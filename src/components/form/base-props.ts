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

export interface UnibleConFormArray {
  /**
   * Indica de donde obtener los errores cuando se usa el input con `useFieldArray`.
   *
   * Si se incluye esta propiedad se obtienen desde el arreglo usado por `useFieldArray`, pero si
   * no se incluye se van a tratar de obtener los errores desde la propiedad`formState.errors[name]`
   * que devuelve `useFormContext`.
   */
  unirConFieldArray?: {
    /**
     * La propiedad `name` usada cuando se creo el field array con `useFieldArray`.
     * */
    fieldArrayName: string;

    /** El indice del input. */
    index: number;

    /**
     * Nombre de la propiedad de un elemento del field array.
     */
    campo: string;
  };
}
