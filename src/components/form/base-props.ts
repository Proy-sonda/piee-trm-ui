export interface InputReciclableBase {
  /**
   * Label para el input.
   *
   * En caso de no incluirse, el input no va a mostrar el label.
   *
   * No se debe agregar `(*)` al final, el input detecta si incluirlo o no en el label dependiendo
   * de si este es obligatorio u opcional.
   */
  label?: string;

  /** El nombre del input para usar en la función `register` de `react-hook-form`. */
  name: string;

  className?: string;

  deshabilitado?: boolean;

  opcional?: boolean;
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

/**
 * Agrega una propiedad `errores`, que es un objeto cuyas propiedades son strings opcionales para
 * sobreescribir los mensajes de error.
 *
 * @example
 *  ```typescript
 *  interface MyProps extends ErroresEditables<'requerido' | 'muyCorto'> {}
 *
 *  // Luego al momento de usar
 *  export const NuevoInput = ({ errores }) => {
 *    // Se puede acceder a los errores sin problemas de tipado
 *    console.log(errores.requerido);
 *    console.log(errores.muyCorto);
 *  }
 *  ```
 */
export interface ErroresEditables<T extends string> {
  errores?: Partial<Record<T, string>>;
}
