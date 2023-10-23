import { useRandomId } from '@/hooks/use-random-id';
import React from 'react';
import { Form, FormGroup, InputGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { BaseProps } from './base-props';

interface InputTelefonoProps extends BaseProps {
  opcional?: boolean;
  errores?: {
    requerido?: string;
  };
}

export const InputTelefono: React.FC<InputTelefonoProps> = ({
  name,
  label,
  className,
  opcional,
  errores,
}) => {
  const idInput = useRandomId('telefono');

  const {
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext();

  const trimInput = () => {
    const value = getValues(name);

    if (typeof value === 'string') {
      setValue(name, value.trim(), { shouldValidate: true });
    }
  };

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        <Form.Label>{`${label}${!opcional ? ' (*)' : ''}`}</Form.Label>

        <InputGroup>
          <InputGroup.Text>+56</InputGroup.Text>

          <Form.Control
            type="text"
            autoComplete="new-custom-value"
            isInvalid={!!errors[name]}
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
            {errors[name]?.message?.toString()}
          </Form.Control.Feedback>
        </InputGroup>
      </FormGroup>
    </>
  );
};
