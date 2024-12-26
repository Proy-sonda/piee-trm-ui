import React, { useEffect } from 'react';
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
  const COMUNA_POR_DEFECTO = '';

  const { register, setValue, getValues } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    prefijoId: 'comuna',
    name,
    label: {
      texto: label,
    },
  });

  const comunasRegionSeleccionada = (comunas ?? []).filter(
    ({ region: { idregion } }) => idregion === regionSeleccionada,
  );

  useEffect(() => {
    const comunaSeleccionada = getValues(name);
    if (!comunasRegionSeleccionada.some((c) => c.idcomuna === comunaSeleccionada)) {
      setValue(name, COMUNA_POR_DEFECTO);
    }
  }, [regionSeleccionada]);

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
                if (typeof valor === 'string' && valor === COMUNA_POR_DEFECTO) {
                  return 'Este campo es obligatorio';
                }
              },
            },
          })}>
          <option value={COMUNA_POR_DEFECTO}>{textoOpcionPorDefecto ?? 'SELECCIONAR...'}</option>
          {comunasRegionSeleccionada.map(({ idcomuna, nombre }) => (
            <option key={idcomuna} value={idcomuna}>
              {nombre.toUpperCase()}
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
