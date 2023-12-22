'use client';

import IfContainer from '@/components/if-container';
import { TextoBuenoMalo } from '@/components/texto-bueno-malo';
import { Options, Result, passwordStrength } from 'check-password-strength';
import React, { useState } from 'react';
import { Form, FormGroup, InputGroup, ProgressBar } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { ErroresEditables, InputReciclableBase } from './base-props';
import { useInputReciclable } from './hooks';

interface InputClaveProps
  extends InputReciclableBase,
    ErroresEditables<'requerida' | 'clavesNoCoinciden'> {
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

  validarFortaleza?: boolean;
}

export const InputClave: React.FC<InputClaveProps> = ({
  name,
  label,
  opcional,
  className,
  debeCoincidirCon,
  omitirSignoObligatorio,
  validarFortaleza,
  errores,
}) => {
  const opcionesPwd: Options<string> = [
    { id: 0, value: 'Muy Débil', minDiversity: 0, minLength: 0 },
    { id: 1, value: 'Débil', minDiversity: 2, minLength: 6 },
    { id: 2, value: 'Normal', minDiversity: 3, minLength: 8 },
    { id: 3, value: 'Fuerte', minDiversity: 4, minLength: 10 },
  ];

  const [verClave, setVerClave] = useState(false);

  const [mostrarRequerimientos, setMostrarRequerimientos] = useState(false);

  const [resultadoClave, setResultadoClave] = useState<Result<string>>();

  const { register, getValues } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    prefijoId: 'pwd',
    name,
    label: {
      texto: label,
      opcional,
      omitirSignoObligatorio,
    },
  });

  const porcentajeFortaleza = () => {
    if (!getValues(name)) {
      return 0;
    }

    switch (resultadoClave?.id) {
      case 0:
        return 25;
      case 1:
        return 50;
      case 2:
        return 75;
      case 3:
        return 100;
      default:
        return 0;
    }
  };

  const colorFortaleza = () => {
    switch (resultadoClave?.id) {
      case 0:
        return 'danger';
      case 1:
        return 'warning';
      case 2:
        return 'primary';
      case 3:
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        {textoLabel && <Form.Label>{textoLabel}</Form.Label>}

        <InputGroup>
          <Form.Control
            type={verClave ? 'text' : 'password'}
            autoComplete="new-custom-value"
            onPaste={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
            onFocus={() => setMostrarRequerimientos(!!validarFortaleza)}
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
                validarFortaleza: (clave) => {
                  if (!validarFortaleza) {
                    return;
                  }

                  const resultado = passwordStrength(clave);
                  if (resultado.id < 3 && resultado.length < 10) {
                    return 'La contraseña no cumple con los requisitos';
                  }
                },
              },
              onChange: (event) => {
                if (validarFortaleza) {
                  const clave: string = event.target.value ?? '';

                  setResultadoClave(passwordStrength(clave, opcionesPwd));
                }
              },
              onBlur: () => {
                setMostrarRequerimientos(false);
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

        <IfContainer show={validarFortaleza && mostrarRequerimientos}>
          <ProgressBar
            className={`mb-3 ${tieneError ? 'mt-5' : 'mt-3'}`}
            label={resultadoClave?.value}
            now={porcentajeFortaleza()}
            variant={colorFortaleza()}
          />

          <TextoBuenoMalo
            estaBueno={resultadoClave && resultadoClave.length >= 10}
            texto="Al menos 10 caracteres de largo"
          />

          <TextoBuenoMalo
            estaBueno={resultadoClave?.contains.includes('uppercase')}
            texto="Al menos una letra mayúscula"
          />

          <TextoBuenoMalo
            estaBueno={resultadoClave?.contains.includes('lowercase')}
            texto="Al menos una letra minúscula"
          />

          <TextoBuenoMalo
            estaBueno={resultadoClave?.contains.includes('number')}
            texto="Al menos un número"
          />

          <TextoBuenoMalo
            estaBueno={resultadoClave?.contains.includes('symbol')}
            texto="Al menos un símbolo"
          />
        </IfContainer>
      </FormGroup>
    </>
  );
};
