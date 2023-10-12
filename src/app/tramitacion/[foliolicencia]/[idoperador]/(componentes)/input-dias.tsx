import { BaseProps } from '@/components/form';
import { useRandomId } from '@/hooks/use-random-id';
import { esFechaInvalida } from '@/utilidades';
import { differenceInDays } from 'date-fns';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

interface InputDiasProps extends Omit<BaseProps, 'label'> {
  opcional?: boolean;

  /** Número mínimo de días (default: 0) */
  minDias?: number;

  /** Numero maximo de dias (default: `30`) */
  maxDias?: number;

  deshabilitado?: boolean;

  coincideConRango?: {
    /** Nombre del input en la función `register` para la fecha desde */
    desde: string;

    /** Nombre del input en la función `register` para la fecha hasta */
    hasta: string;
  };

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

export const InputDias: React.FC<InputDiasProps> = ({
  name,
  className,
  opcional,
  minDias,
  maxDias,
  deshabilitado,
  unirConFieldArray,
  coincideConRango,
}) => {
  const minDiasFinal = minDias ?? 0;
  const maxDiasFinal = maxDias ?? 30;

  const idInput = useRandomId('dias');

  const {
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext();

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
      <FormGroup controlId={idInput} className={`${className ?? ''} position-relative`}>
        <Form.Control
          type="text"
          inputMode="numeric"
          disabled={deshabilitado === true}
          isInvalid={tieneError()}
          {...register(name, {
            valueAsNumber: true,
            required: {
              value: !opcional,
              message: 'Este campo es obligatorio',
            },
            min: {
              value: minDiasFinal,
              message: `No puede ingresar menos de ${minDiasFinal} días`,
            },
            max: {
              value: maxDiasFinal,
              message: `No puede ingresar más de ${maxDiasFinal} días`,
            },
            validate: {
              estaEnRango: (dias) => {
                if (!coincideConRango) {
                  return;
                }

                const desde = getValues(coincideConRango.desde);
                const hasta = getValues(coincideConRango.hasta);

                if (!esFechaInvalida(desde) && !esFechaInvalida(hasta)) {
                  const diasEnRango = differenceInDays(hasta, desde);

                  if (dias !== diasEnRango) {
                    return 'Los días no coinciden con el rango indicado';
                  }
                }
              },
            },
            onChange: (event: any) => {
              const regex = /[^0-9]/g; // solo números postivos
              let montoImponible = event.target.value as string;

              if (regex.test(montoImponible)) {
                montoImponible = montoImponible.replaceAll(regex, '');
                setValue(name, montoImponible, { shouldValidate: true });
              }
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
