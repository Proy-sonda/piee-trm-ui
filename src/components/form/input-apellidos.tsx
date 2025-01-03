import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { InputReciclableBase } from './base-props';
import { useInputReciclable } from './hooks';

interface InputApellidosProps extends InputReciclableBase {}

export const InputApellidos: React.FC<InputApellidosProps> = ({
  name,
  label,
  className,
  opcional,
}) => {
  const { register, setValue } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    prefijoId: 'apellidos',
    name,
    label: {
      texto: label,
      opcional,
    },
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
              value: !opcional,
              message: 'Este campo es obligatorio',
            },
            minLength: {
              value: 2,
              message: 'Debe tener al menos 2 caracteres',
            },
            maxLength: {
              value: 80,
              message: 'Debe tener a lo más 80 caracteres',
            },
            pattern: {
              value: /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\-'\s]+$/,
              message: "Solo puede contener letras, guiones y/o apóstrofo ( ' )",
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
