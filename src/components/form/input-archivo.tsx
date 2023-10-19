import { useRandomId } from '@/hooks/use-random-id';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { BaseProps } from '.';

interface InputArchivoProps extends BaseProps {
  opcional?: boolean;

  multiple?: boolean;
}

/** El valor del input va a ser un arreglo de objetos {@link File} */
export const InputArchivo: React.FC<InputArchivoProps> = ({
  name,
  label,
  className,
  opcional,
  multiple,
}) => {
  const idInput = useRandomId('archivo');

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <FormGroup controlId={idInput} className={`${className ?? ''} position-relative`}>
        <Form.Label>{`${label}${!opcional ? ' (*)' : ''}`}</Form.Label>

        <Form.Control
          type="file"
          isInvalid={!!errors[name]}
          multiple={multiple !== undefined && multiple === true}
          {...register(name, {
            required: {
              value: !opcional,
              message: 'Debe adjuntar evidencia',
            },
          })}
        />

        <Form.Control.Feedback type="invalid" tooltip>
          {errors[name]?.message?.toString()}
        </Form.Control.Feedback>
      </FormGroup>
    </>
  );
};
