import { InputReciclableBase } from '@/components/form';
import { useInputReciclable } from '@/components/form/hooks';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

interface InputFrecuenciaCronProps extends InputReciclableBase {}

export const InputFrecuenciaCron: React.FC<InputFrecuenciaCronProps> = ({
  name,
  label,
  opcional,
  className,
}) => {
  const { register, setValue } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    name,
    prefijoId: 'frecuenciaCron',
    label: { texto: label, opcional },
  });

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        <Form.Label>{textoLabel}</Form.Label>
        <Form.Control
          type="text"
          autoComplete="new-custom-value"
          className="font-monospace"
          isInvalid={tieneError}
          {...register(name, {
            required: {
              value: !opcional,
              message: 'La frecuencia del proceso es obligatoria',
            },
            maxLength: {
              value: 30,
              message: 'No puede tener más de 30 caracteres',
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
