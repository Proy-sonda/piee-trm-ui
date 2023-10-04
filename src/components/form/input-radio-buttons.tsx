import { BaseProps } from '@/components/form';
import IfContainer from '@/components/if-container';
import { useRandomId } from '@/hooks/use-random-id';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

export interface OpcionInputRadioButton {
  value: string | number;
  label: string;
}

interface InputRadioButtonsProps extends Omit<BaseProps, 'label'> {
  opcional?: boolean;

  errores?: {
    obligatorio?: string;
  };

  opciones: OpcionInputRadioButton[];
}

export const InputRadioButtons: React.FC<InputRadioButtonsProps> = ({
  name,
  className,
  opcional,
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
      <FormGroup controlId={idInput} className={className}>
        {opciones.map((opcion, index) => (
          <Form.Check
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

        <IfContainer show={!!errors[name]}>
          <div className="mt-2 small text-danger">* {errors[name]?.message?.toString()}</div>
        </IfContainer>
      </FormGroup>
    </>
  );
};

export default InputRadioButtons;
