import { BaseProps } from '@/components/form';
import { useRandomId } from '@/hooks/use-random-id';
import { esFechaInvalida } from '@/utilidades/es-fecha-invalida';
import { endOfDay, isAfter, isBefore, parse, startOfMonth } from 'date-fns';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import IfContainer from '../if-container';

interface InputMesAnoProps extends Omit<BaseProps, 'label'> {
  label?: string;

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
 * El valor del input va a ser un objeto `Date` con la fecha seleccionada. En caso de que la fecha
 * sea invalida el valor del input va a ser `Invalid Date`, que se puede revisar con la funcion
 * `esFechaInvalida` de las utilidades.
 */
export const InputMesAno: React.FC<InputMesAnoProps> = ({
  name,
  label,
  className,
  opcional,
  unirConFieldArray,
}) => {
  const idInput = useRandomId('fecha');

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

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        <IfContainer show={label !== undefined}>
          <Form.Label>{determinarLabel()}</Form.Label>
        </IfContainer>

        <Form.Control
          type="month"
          autoComplete="new-custom-value"
          isInvalid={tieneError()}
          {...register(name, {
            setValueAs: (date: string) => {
              /** Situa la fecha con respecto al inicio de hoy */
              return parse(date, 'yyyy-MM', startOfMonth(new Date()));
            },
            required: {
              value: !opcional,
              message: 'La fecha es obligatoria',
            },
            validate: {
              esFechaValida: (fecha: Date) => {
                if (!opcional && esFechaInvalida(fecha)) {
                  return 'La fecha es inválida';
                }
              },
              despuesDe1920: (fecha: Date) => {
                if (isBefore(fecha, new Date(1920, 11, 31))) {
                  return 'Debe ser mayor o igual a enero de 1921';
                }
              },
              noMayorQueHoy: (fecha: Date) => {
                if (isAfter(fecha, endOfDay(Date.now()))) {
                  return 'No puede ser posterior a hoy';
                }
              },
            },
          })}
        />

        <Form.Control.Feedback type="invalid" tooltip>
          {mensajeDeError()}
        </Form.Control.Feedback>
      </FormGroup>
    </>
  );
};
