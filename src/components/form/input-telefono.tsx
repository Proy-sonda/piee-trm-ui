import React from 'react';
import { Form, FormGroup, InputGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { ErroresEditables, InputReciclableBase } from './base-props';
import { useInputReciclable } from './hooks';

interface InputTelefonoProps extends InputReciclableBase, ErroresEditables<'requerido'> {}

export const InputTelefono: React.FC<InputTelefonoProps> = ({
  name,
  label,
  className,
  opcional,
  errores,
}) => {
  const { register, setValue, getValues } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    name,
    prefijoId: 'combo',
    label: {
      texto: label,
      opcional,
    },
  });

  const trimInput = () => {
    const value = getValues(name);

    if (typeof value === 'string') {
      setValue(name, value.trim(), { shouldValidate: true });
    }
  };

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        {textoLabel && <Form.Label>{textoLabel}</Form.Label>}

        <InputGroup>
          <InputGroup.Text>+56</InputGroup.Text>

          <Form.Control
            type="text"
            autoComplete="new-custom-value"
            isInvalid={tieneError}
            {...register(name, {
              required: {
                value: !opcional,
                message: errores?.requerido ?? 'El teléfono es obligatorio',
              },
              pattern: {
                value: /^[0-9]{9}$/, // Exactamente 9 digitos
                message: 'Debe tener 9 dígitos',
              },
              onChange: (event: any) => {
                const regex = /[^0-9]/g; // Hace match con cualquier caracter que no sea un numero
                let valorFinal = event.target.value as string;

                if (regex.test(valorFinal)) {
                  valorFinal = valorFinal.replaceAll(regex, '');
                }

                if (valorFinal.length > 9) {
                  valorFinal = valorFinal.substring(0, 9);
                }

                setValue(name, valorFinal);
              },
              onBlur: () => trimInput(),
            })}
          />
          <Form.Control.Feedback type="invalid" tooltip>
            {mensajeError}
          </Form.Control.Feedback>
        </InputGroup>
      </FormGroup>
    </>
  );
};
