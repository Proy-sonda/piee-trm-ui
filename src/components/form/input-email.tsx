import { existe } from '@/utilidades';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import isEmail from 'validator/lib/isEmail';
import { InputReciclableBase } from './base-props';
import { useInputReciclable } from './hooks';

interface InputEmailProps extends InputReciclableBase {
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
  const { register, getValues, clearErrors } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    prefijoId: 'email',
    name,
    label: { texto: label },
  });

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        {textoLabel && <Form.Label>{textoLabel}</Form.Label>}

        <Form.Control
          type="email"
          isInvalid={tieneError}
          className="text-uppercase"
          autoComplete="new-custom-value"
          placeholder="ejemplo@ejemplo.cl"
          onPaste={(e) => e.preventDefault()}
          onCopy={(e) => e.preventDefault()}
          {...register(name, {
            setValueAs: (email: string) => (existe(email) ? email.toUpperCase() : ''),
            required: 'Este campo es obligatorio',
            validate: {
              esEmail: (email) => {
                if (!isEmail(email)) {
                  return 'Correo inválido';
                }
              },
              emailCoinciden: (email: string) => {
                if (!debeCoincidirCon) {
                  return;
                }

                if (email === debeCoincidirCon) {
                  throw new Error('No se puede evaluar email para que coincida consigo mismo');
                }

                const otroEmail = getValues(debeCoincidirCon) as string;
                if (email.toUpperCase() !== otroEmail.toUpperCase()) {
                  return 'Correos no coinciden';
                }

                clearErrors(debeCoincidirCon);
              },
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
