'use client';

import { useRandomId } from '@/hooks/use-random-id';
import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { formatRut, validateRut } from 'rutlib';
import IfContainer from '../if-container';
import { BaseProps } from './base-props';

interface InputRutProps extends Omit<BaseProps, 'label'> {
  label?: string;

  omitirLabel?: boolean;

  /** Define si usar RUT o RUN en los mensajes de error (defecto: `rut`) */
  tipo?: 'rut' | 'run';

  deshabilitado?: boolean;

  omitirSignoObligatorio?: boolean;
}

export const InputRut: React.FC<InputRutProps> = ({
  name,
  className,
  label,
  omitirLabel,
  tipo,
  deshabilitado,
  omitirSignoObligatorio,
}) => {
  const idInput = useRandomId('rut');

  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  const tipoInput = () => (!tipo || tipo === 'rut' ? 'RUT' : 'RUN');

  const determinarLabel = () => {
    if (label === undefined || label === null) {
      return '';
    }

    return omitirSignoObligatorio ? `${label}` : `${label} (*)`;
  };

  return (
    <>
      <Form.Group className={`${className ?? ''} position-relative`} controlId={idInput}>
        <IfContainer show={!omitirLabel}>
          <Form.Label>{determinarLabel()}</Form.Label>
        </IfContainer>

        <Form.Control
          type="text"
          autoComplete="new-custom-value"
          isInvalid={!!errors[name]}
          disabled={deshabilitado}
          {...register('rut', {
            required: `El ${tipoInput()} es obligatorio`,
            validate: {
              esRut: (rut) => {
                if (!validateRut(rut)) {
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

              setValue('rut', rut.length > 2 ? formatRut(rut, false) : rut);
            },
            onBlur: (event) => {
              const rut = event.target.value;
              if (validateRut(rut)) {
                setValue('rut', formatRut(rut, false));
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
