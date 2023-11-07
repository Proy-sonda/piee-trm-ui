import { InputReciclableBase } from '@/components/form';
import { useInputReciclable } from '@/components/form/hooks';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

interface InputNombreFantasiaProps extends InputReciclableBase {}

const InputNombreFantasia: React.FC<InputNombreFantasiaProps> = ({ name, label, className }) => {
  const { register, setValue } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    name,
    prefijoId: 'nombreFantasia',
    label: { texto: label, opcional: true },
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
          {mensajeError}
        </Form.Control.Feedback>
      </FormGroup>
    </>
  );
};

export default InputNombreFantasia;
