import { useRandomId } from '@/hooks/use-random-id';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import isEmail from 'validator/lib/isEmail';
import { BaseProps } from './base-props';

interface InputEmailProps extends BaseProps {
  /**
   * Propiedad `name` del `EmailInput` con el que este input debe coincidir.
   *
   * Si los valores no coindiden, el error se muestra en el input que define la propiedad
   * `debeCoincidirCon`.
   *
   * @example
   *  ```typescriptreact
   *  <EmailInput name="email" />
   *
   *  // Se valida en este input que el valor coincida con el valor que tiene el input con la
   *  // propiedad name="email"
   *  <EmailInput name="emailConfirma" debeCoincidirCon="email" />
   *  ```
   */
  debeCoincidirCon?: string;
}

export const InputEmail: React.FC<InputEmailProps> = ({
  name,
  label,
  className,
  debeCoincidirCon,
}) => {
  const idInput = useRandomId('email');

  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        <Form.Label>{`${label} (*)`}</Form.Label>
        <Form.Control
          type="email"
          isInvalid={!!errors[name]}
          autoComplete="new-custom-value"
          placeholder="ejemplo@ejemplo.cl"
          onPaste={(e) => e.preventDefault()}
          onCopy={(e) => e.preventDefault()}
          {...register(name, {
            required: 'Este campo es obligatorio',
            validate: {
              esEmail: (email) => {
                if (!isEmail(email)) {
                  return 'Correo inválido';
                }
              },
              emailCoinciden: (email) => {
                if (!debeCoincidirCon) {
                  return;
                }

                if (email === debeCoincidirCon) {
                  throw new Error('No se puede evaluar email para que coincida consigo mismo');
                }

                if (email !== getValues(debeCoincidirCon)) {
                  return 'Correos no coinciden';
                }
              },
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
