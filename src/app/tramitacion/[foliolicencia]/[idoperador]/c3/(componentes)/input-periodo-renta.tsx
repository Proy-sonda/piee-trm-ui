import { InputReciclableBase, UnibleConFormArray } from '@/components/form';
import { useInputReciclable } from '@/components/form/hooks';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

interface InputPeriodoRentaProps extends InputReciclableBase, UnibleConFormArray {
  readOnly?: boolean;
}

const InputPeriodoRenta: React.FC<InputPeriodoRentaProps> = ({
  name,
  label,
  className,
  opcional,
  readOnly,
  unirConFieldArray,
}) => {
  const { register, setValue } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    name,
    prefijoId: 'periodoRenta',
    label: { texto: label },
    unirConFieldArray,
  });

  return (
    <>
      <FormGroup controlId={idInput} className={`${className ?? ''} position-relative`}>
        {textoLabel && <Form.Label>{textoLabel}</Form.Label>}

        <Form.Control
          type="text"
          readOnly={readOnly !== undefined && readOnly}
          isInvalid={tieneError}
          {...register(name, {
            required: {
              value: !opcional,
              message: 'Este campo es obligatorio',
            },
            onBlur: (event: any) => {
              const value = event.target.value;

              if (typeof value === 'string') {
                setValue(name, value.trim(), { shouldValidate: true });
              }
            },
          })}
        />

        <Form.Control.Feedback type="invalid" tooltip>
          {mensajeError}
        </Form.Control.Feedback>
      </FormGroup>
    </>
  );
};

export default InputPeriodoRenta;
