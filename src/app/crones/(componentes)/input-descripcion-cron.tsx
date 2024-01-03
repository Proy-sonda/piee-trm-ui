import { InputReciclableBase } from '@/components/form';
import { useInputReciclable } from '@/components/form/hooks';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

interface InputDescripcionCronProps extends InputReciclableBase {}

export const InputDescripcionCron: React.FC<InputDescripcionCronProps> = ({
  name,
  label,
  opcional,
  className,
}) => {
  const { register, setValue } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    name,
    prefijoId: 'descripcionCron',
    label: { texto: label, opcional },
  });

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        <Form.Label>{textoLabel}</Form.Label>
        <Form.Control
          type="text"
          autoComplete="new-custom-value"
          as="textarea"
          rows={4}
          isInvalid={tieneError}
          {...register(name, {
            required: {
              value: !opcional,
              message: 'La descripción del proceso es obligatoria',
            },
            maxLength: {
              value: 250,
              message: 'No puede tener más de 250 caracteres',
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
