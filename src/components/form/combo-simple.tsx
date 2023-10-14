import { useRandomId } from '@/hooks/use-random-id';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import IfContainer from '../if-container';
import { BaseProps } from './base-props';

interface ComboSimpleProps<T> extends Omit<BaseProps, 'label'> {
  label?: string;

  /** Datos para rellenar el combo */
  datos?: T[];

  /**
   * Propiedad de un elemento de los datos para usar en las propiedades `key` y `value` del tag
   * `<option>`.
   */
  idElemento: keyof T | ((elemento: T) => number | string);

  /** Propiedad de un elemento de los datos para usar como texto de tag `<option />` */
  descripcion: keyof T | ((elemento: T) => string);

  /** Texto para incluir como la opción nula (default: `'Seleccionar'`). */
  textoOpcionPorDefecto?: string;

  /**
   * Si parsear la propiedad `value` del tag `<option />` a numero o dejarla como string
   * (default: `number`).
   * */
  tipoValor?: 'number' | 'string';

  opcional?: boolean;

  /**
   * Indica de donde obtener los errores cuando se usa el input con `useFieldArray.
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
 * El valor en caso de ser opcional es un string vacío cuando el combo es tipo `string` o `isNan`
 * cuando es un combo tipo `number`.
 */
export const ComboSimple = <T extends Record<string, any>>({
  name,
  label,
  className,
  datos,
  idElemento,
  descripcion,
  textoOpcionPorDefecto,
  tipoValor,
  opcional,
  unirConFieldArray,
}: ComboSimpleProps<T>) => {
  const idInput = useRandomId('combo');

  const {
    register,
    formState: { errors },
  } = useFormContext();

  const determinarLabel = () => {
    if (label === undefined || label === null) {
      return '';
    }

    return opcional ? `${label}` : `${label} (*)`;
  };

  const tieneError = () => {
    if (!unirConFieldArray) {
      return !!errors[name];
    }

    const { fieldArrayName, index, campo } = unirConFieldArray;

    return !!(errors[fieldArrayName] as any)?.at?.(index)?.[campo];
  };

  const mensajeDeError = () => {
    if (!unirConFieldArray) {
      return errors[name]?.message?.toString();
    }

    const { fieldArrayName, index, campo } = unirConFieldArray;

    return (errors[fieldArrayName] as any)?.at?.(index)?.[campo]?.message?.toString();
  };

  const calcularId = (x: T) => {
    return typeof idElemento === 'function' ? idElemento(x) : (x[idElemento] as any);
  };

  const calcularDescripcion = (x: T) => {
    return typeof descripcion === 'function' ? descripcion(x) : (x[descripcion] as any);
  };

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        <IfContainer show={label !== undefined}>
          <Form.Label>{determinarLabel()}</Form.Label>
        </IfContainer>

        <Form.Select
          autoComplete="new-custom-value"
          isInvalid={tieneError()}
          {...register(name, {
            setValueAs: (value) => {
              if (!tipoValor || tipoValor === 'number') {
                return parseInt(value, 10);
              } else {
                return value;
              }
            },
            validate: {
              comboObligatorio: (valor: number | string) => {
                if (opcional) {
                  return;
                }

                if (Number.isNaN(valor)) {
                  return 'Este campo es obligatorio';
                }

                if (typeof valor === 'string' && valor === '') {
                  return 'Este campo es obligatorio';
                }
              },
            },
          })}>
          <option value={''}>{textoOpcionPorDefecto ?? 'Seleccionar'}</option>
          {(datos ?? []).map((dato) => (
            <option key={calcularId(dato)} value={calcularId(dato)}>
              {calcularDescripcion(dato)}
            </option>
          ))}
        </Form.Select>

        <Form.Control.Feedback type="invalid" tooltip>
          {mensajeDeError()}
        </Form.Control.Feedback>
      </FormGroup>
    </>
  );
};
