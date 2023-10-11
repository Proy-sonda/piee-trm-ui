import { BaseProps } from '@/components/form';
import { useRandomId } from '@/hooks/use-random-id';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { DesgloseDeHaberes } from '../(modelos)/desglose-de-haberes';
import { tieneDesglose } from '../(modelos)/formulario-c3';

interface InputDesgloseDeHaberes extends Omit<BaseProps, 'label'> {
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

  /**
   * Nombre de la propiedad `name` usada en el campo de monto imponible para validar que el
   * desglose coincida con este.
   */
  montoImponibleName: string;
}

export const InputDesgloseDeHaberes: React.FC<InputDesgloseDeHaberes> = ({
  name,
  opcional,
  unirConFieldArray,
  montoImponibleName,
}) => {
  const idInput = useRandomId('desgloseHaberes');

  const {
    register,
    formState: { errors },
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
      <FormGroup controlId={idInput} className="position-relative">
        <Form.Control
          type="hidden"
          isInvalid={tieneError()}
          {...register(name, {
            required: {
              value: !opcional,
              message: 'El desglose de haberes es obligatorio',
            },
            validate: {
              coincideConMontoImponible: (desglose: DesgloseDeHaberes | Record<string, never>) => {
                if (!tieneDesglose(desglose)) {
                  return;
                }

                const montoImponibleEnBruto = getValues(montoImponibleName);
                const montoImponible = isNaN(montoImponibleEnBruto)
                  ? 0
                  : getValues(montoImponibleName);

                const totalDesglose = Object.values(desglose).reduce(
                  (total, monto: number) => total + monto,
                  0,
                );

                if (totalDesglose !== montoImponible) {
                  return 'No coincide con monto imponible';
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
