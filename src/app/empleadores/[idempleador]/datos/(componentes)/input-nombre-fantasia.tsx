import { BaseProps } from '@/components/form';
import { useRandomId } from '@/hooks/use-random-id';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

interface InputNombreFantasiaProps extends BaseProps {}

const InputNombreFantasia: React.FC<InputNombreFantasiaProps> = ({ name, label, className }) => {
  const idInput = useRandomId('nombreFantasia');

  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        <Form.Label>{`${label}`}</Form.Label>
        <Form.Control
          type="text"
          autoComplete="new-custom-value"
          isInvalid={!!errors[name]}
          {...register(name, {
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

export default InputNombreFantasia;
