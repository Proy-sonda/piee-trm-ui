import { BaseProps } from '@/components/form';
import { useRandomId } from '@/hooks/use-random-id';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

interface InputMontoImponibleProps extends Omit<BaseProps, 'label'> {
  opcional?: boolean;

  /** (defecto: `0`) */
  montoMinimo?: number;

  /** (defecto: lo definido por la función {@link montoMaximoPorDefecto} ) */
  montoMaximo?: number;

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

export const InputMonto: React.FC<InputMontoImponibleProps> = ({
  name,
  className,
  opcional,
  montoMinimo,
  montoMaximo,
  unirConFieldArray,
}) => {
  const montoMinimoFinal = montoMinimo ?? 0;
  const montoMaximoFinal = montoMaximo ?? 5_000_000;

  const idInput = useRandomId('monto');

  const {
    register,
    formState: { errors },
    setValue,
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
          type="number"
          inputMode="numeric"
          isInvalid={tieneError()}
          {...register(name, {
            valueAsNumber: true,
            required: {
              value: !opcional,
              message: 'Este campo es obligatorio',
            },
            min: {
              value: montoMinimoFinal,
              message: `No puede ser menor a $${montoMinimoFinal.toLocaleString()}`,
            },
            max: {
              value: montoMaximoFinal,
              message: `No puede ser mayor a $${montoMaximoFinal.toLocaleString()}`,
            },
            onChange: (event: any) => {
              const regex = /[^0-9-]/g; // Solo numeros enteros
              let montoImponible = event.target.value as string;

              if (regex.test(montoImponible)) {
                montoImponible = montoImponible.replaceAll(regex, '');
                setValue(name, montoImponible === '' ? undefined : parseInt(montoImponible), {
                  shouldValidate: true,
                });
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
