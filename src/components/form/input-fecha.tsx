import { BaseProps } from '@/components/form';
import { useRandomId } from '@/hooks/use-random-id';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

interface InputFechaProps extends BaseProps {
  opcional?: boolean;
}

export const InputFecha: React.FC<InputFechaProps> = ({ name, label, className, opcional }) => {
  const idInput = useRandomId('fecha');

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        <Form.Label>{`${label}${!opcional ? ' (*)' : ''}`}</Form.Label>
        <Form.Control
          type="date"
          autoComplete="new-custom-value"
          isInvalid={!!errors[name]}
          {...register(name, {
            required: {
              value: !opcional,
              message: 'La fecha es obligatoria',
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
