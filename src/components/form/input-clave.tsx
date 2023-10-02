'use client';

import { useRandomId } from '@/hooks/use-random-id';
import React, { useState } from 'react';
import { Form, FormGroup, InputGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { BaseProps } from './base-props';

interface InputClaveProps extends BaseProps {
  /**
   * Propiedad `name` del `ClaveInput` con el que este input debe coincidir.
   *
   * Si los valores no coindiden, el error se muestra en el input que define la propiedad
   * `debeCoincidirCon`.
   *
   * @example
   *  ```typescriptreact
   *  <ClaveInput name="pwd" />
   *
   *  // Se valida en este input que el valor coincida con el valor que tiene el input con la
   *  // propiedad name="pwd".
   *  <ClaveInput name="pwdConfirma" debeCoincidirCon="pwd" />
   *  ```
   */
  debeCoincidirCon?: string;

  omitirSignoObligatorio?: boolean;

  errores?: {
    requerida?: string;
    clavesNoCoinciden?: string;
  };
}

export const InputClave: React.FC<InputClaveProps> = ({
  name,
  label,
  className,
  debeCoincidirCon,
  omitirSignoObligatorio,
  errores,
}) => {
  const idInput = useRandomId('clave');

  const [verClave, setVerClave] = useState(false);

  const {
    register,
    formState: { errors },
    getValues,
  } = useFormContext();

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        <Form.Label>{omitirSignoObligatorio ? `${label}` : `${label} (*)`}</Form.Label>

        <InputGroup>
          <Form.Control
            type={verClave ? 'text' : 'password'}
            autoComplete="new-custom-value"
            isInvalid={!!errors[name]}
            {...register(name, {
              required: errores?.requerida ?? 'La clave es obligatoria',
              validate: {
                clavesCoinciden: (clave) => {
                  if (!debeCoincidirCon) {
                    return;
                  }

                  if (debeCoincidirCon === name) {
                    throw new Error('No se puede evaluar clave para que coincida consigo misma');
                  }

                  if (clave !== getValues(debeCoincidirCon)) {
                    return errores?.clavesNoCoinciden ?? 'Las contraseñas no coinciden';
                  }
                },
              },
            })}
          />

          <InputGroup.Text
            className="btn btn-primary"
            title={verClave ? 'Ocultar clave' : 'Ver clave'}
            onClick={() => setVerClave((x) => !x)}>
            <i className={`bi ${verClave ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
          </InputGroup.Text>

          <Form.Control.Feedback type="invalid" tooltip>
            {errors[name]?.message?.toString()}
          </Form.Control.Feedback>
        </InputGroup>
      </FormGroup>
    </>
  );
};
