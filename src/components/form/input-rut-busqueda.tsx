'use client';

import { useRandomId } from '@/hooks/use-random-id';
import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { formatRut, validateRut } from 'rutlib';
import { BaseProps } from './base-props';

interface InputRutBusquedaProps extends BaseProps {
  /** Define si usar RUT o RUN en los mensajes de error (defecto: `rut`) */
  tipo?: 'rut' | 'run';
  opcional?: boolean;
}

/**
 * Como un `InputRut`, pero que solo valida y formatea cuando se ingresan mas de 8 caracteres
 */
export const InputRutBusqueda: React.FC<InputRutBusquedaProps> = ({
  label,
  name,
  className,
  tipo,
  opcional,
}) => {
  const largoRutValidar = 8;

  const idInput = useRandomId('rut');

  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  const tipoInput = () => (!tipo || tipo === 'rut' ? 'RUT' : 'RUN');

  return (
    <>
      <Form.Group className={`${className ?? ''} position-relative`} controlId={idInput}>
        <Form.Label>{`${label}${!opcional ? ' (*)' : ''}`}</Form.Label>

        <Form.Control
          type="text"
          autoComplete="new-custom-value"
          isInvalid={!!errors[name]}
          {...register(name, {
            required: {
              value: !opcional,
              message: `El ${tipoInput()} es obligatorio`,
            },
            validate: {
              esRut: (rut) => {
                if (opcional && rut === '') {
                  return;
                }

                if (rut.length > largoRutValidar && !validateRut(rut)) {
                  return `El ${tipoInput()} es inválido`;
                }
              },
            },
            onChange: (event: any) => {
              const regex = /[^0-9kK\-]/g; // solo números, guiones y la letra K
              let rut = event.target.value as string;

              if (regex.test(rut)) {
                rut = rut.replaceAll(regex, '');
              }

              if (rut.length > 10) {
                rut = rut.substring(0, 10);
              }

              setValue(name, rut.length > 8 ? formatRut(rut, false) : rut);
            },
            onBlur: (event) => {
              const rut = event.target.value;
              if (validateRut(rut) && rut.length > largoRutValidar) {
                setValue(name, formatRut(rut, false));
              }
            },
          })}
        />

        <Form.Control.Feedback type="invalid" tooltip>
          {errors[name]?.message?.toString()}
        </Form.Control.Feedback>
      </Form.Group>
    </>
  );
};
