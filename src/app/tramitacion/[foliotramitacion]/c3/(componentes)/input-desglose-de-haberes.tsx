import { BaseProps } from '@/components/form';
import { useRandomId } from '@/hooks/use-random-id';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

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
}

export const InputDesgloseDeHaberes: React.FC<InputDesgloseDeHaberes> = ({
  name,
  opcional,
  unirConFieldArray,
}) => {
  const idInput = useRandomId('desgloseHaberes');

  const {
    register,
    formState: { errors },
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
          })}
        />

        <Form.Control.Feedback type="invalid" tooltip>
          {mensajeDeError()}
        </Form.Control.Feedback>
      </FormGroup>
    </>
  );
};
