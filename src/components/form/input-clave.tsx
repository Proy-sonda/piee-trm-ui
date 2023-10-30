'use client';

import React, { useState } from 'react';
import { Form, FormGroup, InputGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { BaseProps } from './base-props';
import { useInputReciclable } from './hooks';

interface InputClaveProps extends BaseProps {
  /**
   * Propiedad `name` del `InputClave` con el que este input debe coincidir.
   *
   * Si los valores no coindiden, el error se muestra en el input que define la propiedad
   * `debeCoincidirCon`.
   *
   * @example
   *  ```typescriptreact
   *  <InputClave name="pwd" />
   *
   *  // Se valida en este input que el valor coincida con el valor que tiene el input con la
   *  // propiedad name="pwd".
   *  <InputClave name="pwdConfirma" debeCoincidirCon="pwd" />
   *  ```
   */
  debeCoincidirCon?: string;

  omitirSignoObligatorio?: boolean;

  errores?: {
    requerida?: string;
    clavesNoCoinciden?: string;
  };

  opcional?: boolean;
}

export const InputClave: React.FC<InputClaveProps> = ({
  name,
  label,
  opcional,
  className,
  debeCoincidirCon,
  omitirSignoObligatorio,
  errores,
}) => {
  const [verClave, setVerClave] = useState(false);

  const { register, getValues } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    prefijoId: 'pwd',
    name,
    label: { texto: label, opcional, omitirSignoObligatorio },
  });

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        <Form.Label>{textoLabel}</Form.Label>

        <InputGroup>
          <Form.Control
            type={verClave ? 'text' : 'password'}
            autoComplete="new-custom-value"
            isInvalid={tieneError}
            {...register(name, {
              required: {
                value: !opcional,
                message: errores?.requerida ?? 'La clave es obligatoria',
              },
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
            {mensajeError}
          </Form.Control.Feedback>
        </InputGroup>
      </FormGroup>
    </>
  );
};
