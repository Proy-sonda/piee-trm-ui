import { BaseProps } from '@/components/form';
import { useRandomId } from '@/hooks/use-random-id';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

export interface OpcionInputRadioButton {
  value: string;
  label: string;
}

interface InputRadioButtonsProps extends Omit<BaseProps, 'label'> {
  opcional?: boolean;

  /**
   * - `vertical`: Para colocar los radios buttons hacia abajo
   * - `horizontal`: Para colocar los radio buttons hacia el lado
   *
   * (default: `vertical`) */
  direccion?: 'vertical' | 'horizontal';

  /** Para sobreescribir los mensajes de error */
  errores?: {
    obligatorio?: string;
  };

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
  const idInput = useRandomId('radioButtons');

  const {
    register,
    formState: { errors },
  } = useFormContext();

  const mensajeObligatorio = errores?.obligatorio ?? 'Debe elegir una opción';

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
              isInvalid={!!errors[name]}
              label={opcion.label}
              value={opcion.value}
              {...register(name, {
                required: {
                  value: !opcional,
                  message: mensajeObligatorio,
                },
              })}
            />
          ))}
        </FormGroup>

        {/* Sirve para que se muestre el en los radio buttons */}
        <FormGroup className="mt-1 position-relative">
          <Form.Control type="hidden" isInvalid={!!errors[name]} />

          <Form.Control.Feedback type="invalid" tooltip>
            {errors[name]?.message?.toString()}
          </Form.Control.Feedback>
        </FormGroup>
      </div>
    </>
  );
};

export default InputRadioButtons;
