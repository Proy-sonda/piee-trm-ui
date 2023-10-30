import { BaseProps } from '@/components/form';
import { useInputReciclable } from '@/components/form/hooks';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

interface InputIdentificadorUnidadRRHHProps extends BaseProps {}

export const InputIdentificadorUnidadRRHH: React.FC<InputIdentificadorUnidadRRHHProps> = ({
  name,
  label,
  className,
}) => {
  const { register, setValue } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    name,
    prefijoId: 'identificadorUnidadRRHH',
    label: { texto: label },
  });

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        <Form.Label>{textoLabel}</Form.Label>
        <Form.Control
          type="text"
          autoComplete="new-custom-value"
          isInvalid={tieneError}
          {...register(name, {
            required: {
              value: true,
              message: 'Este campo es obligatorio',
            },
            minLength: {
              value: 2,
              message: 'Debe tener al menos 2 caracteres',
            },
            maxLength: {
              value: 80,
              message: 'No puede tener más de 80 caracteres',
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
          {mensajeError}
        </Form.Control.Feedback>
      </FormGroup>
    </>
  );
};
