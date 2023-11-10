import { ErroresEditables, InputReciclableBase } from '@/components/form';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { useInputReciclable } from './hooks';

export interface OpcionInputRadioButton {
  value: string;
  label: string;
}

interface InputRadioButtonsProps extends InputReciclableBase, ErroresEditables<'obligatorio'> {
  /**
   * - `vertical`: Para colocar los radios buttons hacia abajo
   * - `horizontal`: Para colocar los radio buttons hacia el lado
   *
   * (default: `vertical`) */
  direccion?: 'vertical' | 'horizontal';

  opciones: OpcionInputRadioButton[];
}

export const InputRadioButtons: React.FC<InputRadioButtonsProps> = ({
  name,
  className,
  opcional,
  direccion,
  errores,
  opciones,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const { idInput, tieneError, mensajeError } = useInputReciclable({
    prefijoId: 'radioButtons',
    name,
    label: {},
  });

  return (
    <>
      <div className={className}>
        <FormGroup controlId={idInput}>
          {opciones.map((opcion, index) => (
            <Form.Check
              inline={direccion === 'horizontal'}
              key={index}
              id={`${idInput}_${index}`}
              type="radio"
              isInvalid={tieneError}
              label={opcion.label}
              value={opcion.value}
              {...register(name, {
                required: {
                  value: !opcional,
                  message: errores?.obligatorio ?? 'Debe elegir una opción',
                },
              })}
            />
          ))}
        </FormGroup>

        {/* Sirve para que se muestre el tooltip en los radio buttons */}
        <FormGroup className="mt-1 position-relative">
          <Form.Control type="hidden" isInvalid={!!errors[name]} />

          <Form.Control.Feedback type="invalid" tooltip>
            {mensajeError}
          </Form.Control.Feedback>
        </FormGroup>
      </div>
    </>
  );
};

export default InputRadioButtons;
