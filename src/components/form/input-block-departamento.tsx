import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { InputReciclableBase } from './base-props';
import { useInputReciclable } from './hooks';

interface InputBlockDepartamentoProps extends InputReciclableBase {}

export const InputBlockDepartamento: React.FC<InputBlockDepartamentoProps> = ({
  name,
  label,
  opcional,
  className,
}) => {
  const { register, setValue } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    prefijoId: 'deptoBlock',
    name,
    label: {
      texto: label,
      opcional: opcional,
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
              message: 'Este campo es obligatoio',
            },
            maxLength: {
              value: 20,
              message: 'No puede tener más de 20 carcateres',
            },
            pattern: {
              value: /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s\d#&]+$/,
              message: 'Solo puede contener letras, números, # y/o &',
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
