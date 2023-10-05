import { useRandomId } from '@/hooks/use-random-id';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { BaseProps } from './base-props';

interface InputRazonSocialProps extends BaseProps {}

const InputRazonSocial: React.FC<InputRazonSocialProps> = ({
  name,
  label,
  className,
  deshabilitado,
}) => {
  const idInput = useRandomId('razonSocial');

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
          disabled={deshabilitado}
          {...register(name, {
            required: {
              value: true,
              message: 'Este campo es obligatorio',
            },
            minLength: {
              value: 4,
              message: 'Debe tener al menos 4 caracteres',
            },
            maxLength: {
              value: 120,
              message: 'No puede tener más de 120 caracteres',
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

export default InputRazonSocial;
