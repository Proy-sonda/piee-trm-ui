import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { InputReciclableBase } from './base-props';
import { useInputReciclable } from './hooks';

type Comuna = {
  idcomuna: string;
  nombre: string;
  region: {
    idregion: string;
    nombre: string;
  };
};

interface ComboComunaProps extends InputReciclableBase {
  /** Datos para rellenar el combo */
  comunas?: Comuna[];

  regionSeleccionada: string;

  /** Texto para incluir como la opción nula (default: `'Seleccionar'`). */
  textoOpcionPorDefecto?: string;
}

export const ComboComuna: React.FC<ComboComunaProps> = ({
  name,
  label,
  className,
  comunas,
  regionSeleccionada,
  textoOpcionPorDefecto,
}) => {
  const { register } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    prefijoId: 'comuna',
    name,
    label: {
      texto: label,
    },
  });

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        {textoLabel && <Form.Label>{textoLabel}</Form.Label>}

        <Form.Select
          autoComplete="new-custom-value"
          isInvalid={tieneError}
          {...register(name, {
            validate: {
              comboObligatorio: (valor: string) => {
                if (typeof valor === 'string' && valor === '') {
                  return 'Este campo es obligatorio';
                }
              },
            },
          })}>
          <option value={''}>{textoOpcionPorDefecto ?? 'Seleccionar'}</option>
          {(comunas ?? [])
            .filter(({ region: { idregion } }) => idregion == regionSeleccionada)
            .map(({ idcomuna, nombre }) => (
              <option key={idcomuna} value={idcomuna}>
                {nombre}
              </option>
            ))}
        </Form.Select>

        <Form.Control.Feedback type="invalid" tooltip>
          {mensajeError}
        </Form.Control.Feedback>
      </FormGroup>
    </>
  );
};
