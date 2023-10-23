import { useRandomId } from '@/hooks/use-random-id';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { BaseProps } from './base-props';

type Comuna = {
  idcomuna: string;
  nombre: string;
  region: {
    idregion: string;
    nombre: string;
  };
};

interface ComboComunaProps extends BaseProps {
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
  const idInput = useRandomId('comuna');

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        <Form.Label>{`${label} (*)`}</Form.Label>

        <Form.Select
          autoComplete="new-custom-value"
          isInvalid={!!errors[name]}
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
          {errors[name]?.message?.toString()}
        </Form.Control.Feedback>
      </FormGroup>
    </>
  );
};
