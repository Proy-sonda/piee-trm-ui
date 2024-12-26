'use client';

import React from 'react';
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { formatRut, validateRut } from 'rutlib';
import IfContainer from '../if-container';
import { ErroresEditables, InputReciclableBase } from './base-props';
import { useInputReciclable } from './hooks';

interface InputRutProps
  extends InputReciclableBase,
    ErroresEditables<'obligatorio' | 'rutInvalido'> {
  /** Define si usar RUT o RUN en los mensajes de error (defecto: `rut`) */
  tipo?: 'rut' | 'run';

  omitirSignoObligatorio?: boolean;

  /** Solo se va a llamar si el RUT es valido */
  onBlur?: (rut: string) => Promise<void> | void;

  /** Si se debe ocultar el tooltip de ayuda (default: `false`) */
  ocultarTooltip?: boolean;

  /** Si permitir el autocompletado o no (default: `true`) */
  autocompletar?: boolean;
}

export const InputRut: React.FC<InputRutProps> = ({
  name,
  className,
  label,
  tipo,
  deshabilitado,
  opcional,
  omitirSignoObligatorio,
  onBlur: onBlurInterno,
  errores,
  ocultarTooltip,
  autocompletar,
}) => {
  const MAXIMO_CARACTERES_EN_RUT = 12;

  const { register, setValue } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    name,
    prefijoId: 'rut',
    label: {
      texto: label,
      opcional,
      omitirSignoObligatorio,
    },
  });

  const tipoInput = () => (!tipo || tipo === 'rut' ? 'RUT' : 'RUN');

  return (
    <>
      <Form.Group className={`${className ?? ''} position-relative`} controlId={idInput}>
        <IfContainer show={textoLabel}>
          <Form.Label>
            <span>{textoLabel}</span>
            {!ocultarTooltip && (
              <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={(props) => (
                  <Tooltip id="button-tooltip" {...props}>
                    {'Se debe ingresar sin puntos y con guión (Ej: 12345678-9)'}
                  </Tooltip>
                )}>
                <i className="ms-2 text-primary bi bi-info-circle" style={{ fontSize: '16px' }}></i>
              </OverlayTrigger>
            )}
          </Form.Label>
        </IfContainer>

        <Form.Control
          type="text"
          autoComplete={!autocompletar ? 'off' : 'new-custom-value'}
          isInvalid={tieneError}
          disabled={deshabilitado}
          {...register(name, {
            required: {
              value: !opcional,
              message: errores?.obligatorio ?? `El ${tipoInput()} es obligatorio`,
            },
            minLength: {
              value: 4,
              message: 'Debe tener al menos 4 caracteres',
            },
            validate: {
              esRut: (rut) => {
                if (opcional && rut === '') {
                  return;
                }

                if (!validateRut(rut)) {
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

              setValue(name, rut.length > 2 ? formatRut(rut, false) : rut);
            },
            onBlur: (event) => {
              const rut = event.target.value ?? '';

              if (validateRut(rut) && rut.length > 3) {
                setValue(name, formatRut(rut, false));
                onBlurInterno?.(rut);
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
