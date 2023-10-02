import { useRandomId } from '@/hooks/use-random-id';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { BaseProps } from './base-props';

interface InputBlockDepartamentoProps extends BaseProps {}

export const InputBlockDepartamento: React.FC<InputBlockDepartamentoProps> = ({
  name,
  label,
  className,
}) => {
  const idInput = useRandomId('block');

  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type="text"
          autoComplete="new-custom-value"
          isInvalid={!!errors[name]}
          {...register(name, {
            maxLength: {
              value: 20,
              message: 'No puede tener más de 20 carcateres',
            },
            pattern: {
              value: /^[a-zA-Z0-9#\s]+$/g,
              message: 'Solo debe tener números, letras o #',
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
