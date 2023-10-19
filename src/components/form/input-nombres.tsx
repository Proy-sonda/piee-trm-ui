import { useRandomId } from '@/hooks/use-random-id';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { BaseProps } from './base-props';

interface InputNombresProps extends BaseProps {}

export const InputNombres: React.FC<InputNombresProps> = ({ name, label, className }) => {
  const idInput = useRandomId('nombres');

  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        <Form.Label>{`${label} (*)`}</Form.Label>
        <Form.Control
          type="text"
          autoComplete="new-custom-value"
          isInvalid={!!errors[name]}
          {...register(name, {
            required: {
              message: 'Este campo es obligatorio',
              value: true,
            },
            minLength: {
              value: 4,
              message: 'Debe tener al menos 4 caracteres',
            },
            maxLength: {
              value: 80,
              message: 'Debe tener a lo más 80 caracteres',
            },
            onBlur: (event: any) => {
              const value = event.target.value;

              if (typeof value === 'string') {
                setValue(name, value.trim(), { shouldValidate: true });
              }
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
