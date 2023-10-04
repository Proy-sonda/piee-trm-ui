import { BaseProps } from '@/components/form';
import { useRandomId } from '@/hooks/use-random-id';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

interface InputOtroMotivoDeRechazoProps extends BaseProps {
  opcional?: boolean;
}

const InputOtroMotivoDeRechazo: React.FC<InputOtroMotivoDeRechazoProps> = ({
  name,
  label,
  className,
  opcional,
}) => {
  const idInput = useRandomId('otroMotivoRechazo');

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type="text"
          autoComplete="new-custom-value"
          isInvalid={!!errors[name]}
          {...register(name, {
            required: {
              value: !opcional,
              message: 'Debe especificar el motivo de rechazo',
            },
          })}
        />
        <Form.Control.Feedback type="invalid" tooltip>
          {errors[name]?.message?.toString()}
        </Form.Control.Feedback>
      </FormGroup>
    </>
  );
};

export default InputOtroMotivoDeRechazo;
