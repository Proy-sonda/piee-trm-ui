import { BaseProps } from '@/components/form';
import { useRandomId } from '@/hooks/use-random-id';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

interface InputFolioProps extends BaseProps {
  opcional?: boolean;
}

export const InputFolio: React.FC<InputFolioProps> = ({ name, label, opcional, className }) => {
  const idInput = useRandomId('folio');

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        <Form.Label>{`${label}${!opcional ? ' (*)' : ''}`}</Form.Label>
        <Form.Control
          type="text"
          autoComplete="new-custom-value"
          isInvalid={!!errors[name]}
          {...register(name, {
            required: {
              value: !opcional,
              message: 'El folio es obligatorio',
            },
          })}
        />

        {/* <small id="rutHelp" className="form-text text-muted" style={{ fontSize: '10px' }}>
                Debe incluir el dígito verificador sin guion
              </small> */}

        <Form.Control.Feedback type="invalid" tooltip>
          {errors[name]?.message?.toString()}
        </Form.Control.Feedback>
      </FormGroup>
    </>
  );
};
