import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { InputReciclableBase } from './base-props';
import { useInputReciclable } from './hooks';

interface InputCalleProps extends InputReciclableBase {}

export const InputCalle: React.FC<InputCalleProps> = ({ name, label, className }) => {
  const { register, setValue } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    prefijoId: 'calle',
    name,
    label: { texto: label },
  });

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        {textoLabel && <Form.Label>{textoLabel}</Form.Label>}

        <Form.Control
          type="text"
          autoComplete="new-custom-value"
          isInvalid={tieneError}
          {...register(name, {
            required: {
              message: 'Este campo es obligatorio',
              value: true,
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
