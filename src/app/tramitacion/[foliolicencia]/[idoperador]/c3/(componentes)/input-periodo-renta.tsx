import { BaseProps, UnibleConFormArray } from '@/components/form';
import { useInputReciclable } from '@/components/form/hooks';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

interface InputPeriodoRentaProps extends Omit<BaseProps, 'label'>, UnibleConFormArray {
  opcional?: boolean;

  readOnly?: boolean;
}

const InputPeriodoRenta: React.FC<InputPeriodoRentaProps> = ({
  name,
  className,
  opcional,
  readOnly,
  unirConFieldArray,
}) => {
  const { register, setValue } = useFormContext();

  const { idInput, tieneError, mensajeError } = useInputReciclable({
    name,
    prefijoId: 'periodoRenta',
    label: {},
    unirConFieldArray,
  });

  return (
    <>
      <FormGroup controlId={idInput} className={`${className ?? ''} position-relative`}>
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
