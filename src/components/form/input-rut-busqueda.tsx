'use client';

import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { formatRut, validateRut } from 'rutlib';
import { ErroresEditables, InputReciclableBase } from './base-props';
import { useInputReciclable } from './hooks';

interface InputRutBusquedaProps
  extends InputReciclableBase,
    ErroresEditables<'obligatorio' | 'rutInvalido'> {
  /** Define si usar RUT o RUN en los mensajes de error (defecto: `rut`) */
  tipo?: 'rut' | 'run';

  noValidarRut?: boolean;
}

/**
 * Como un `InputRut`, pero que solo valida y formatea cuando se ingresan mas de 8 caracteres.
 */
export const InputRutBusqueda: React.FC<InputRutBusquedaProps> = ({
  label,
  name,
  className,
  tipo,
  opcional,
  noValidarRut,
  errores,
}) => {
  const LARGO_RUT_VALIDAR = 8;
  const MAXIMO_CARACTERES_EN_RUT = 12;

  const { register, setValue } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    name,
    prefijoId: 'rutBusqueda',
    label: {
      texto: label,
      opcional,
      omitirSignoObligatorio: false,
    },
  });

  const tipoInput = () => (!tipo || tipo === 'rut' ? 'RUT' : 'RUN');

  return (
    <>
      <Form.Group className={`${className ?? ''} position-relative`} controlId={idInput}>
        {textoLabel && <Form.Label>{textoLabel}</Form.Label>}

        <Form.Control
          type="text"
          autoComplete="new-custom-value"
          isInvalid={tieneError}
          {...register(name, {
            required: {
              value: !opcional,
              message: errores?.obligatorio ?? `El ${tipoInput()} es obligatorio`,
            },
            validate: {
              esRut: (rut) => {
                if (noValidarRut) {
                  return;
                }

                if (opcional && rut === '') {
                  return;
                }

                if (rut.length > LARGO_RUT_VALIDAR && !validateRut(rut)) {
                  return errores?.rutInvalido ?? `El ${tipoInput()} es inválido`;
                }
              },
            },
            onChange: (event: any) => {
              const regex = /[^0-9kK\-]/g; // solo números, guiones y la letra K
              let rut = event.target.value as string;

              if (regex.test(rut)) {
                rut = rut.replaceAll(regex, '');
              }

              if (rut.length > MAXIMO_CARACTERES_EN_RUT) {
                rut = rut.substring(0, MAXIMO_CARACTERES_EN_RUT);
              }

              setValue(name, rut.length > LARGO_RUT_VALIDAR ? formatRut(rut, false) : rut);
            },
            onBlur: (event) => {
              const rut = event.target.value;
              if (validateRut(rut) && rut.length > LARGO_RUT_VALIDAR) {
                setValue(name, formatRut(rut, false));
              }
            },
          })}
        />

        <Form.Control.Feedback type="invalid" tooltip>
          {mensajeError}
        </Form.Control.Feedback>
      </Form.Group>
    </>
  );
};
