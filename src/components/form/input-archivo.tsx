import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { BaseProps } from '.';
import { useInputReciclable } from './hooks';

interface InputArchivoProps extends BaseProps {
  opcional?: boolean;

  multiple?: boolean;
}

/** El valor del input va a ser un  {@link FileList} */
export const InputArchivo: React.FC<InputArchivoProps> = ({
  name,
  label,
  className,
  opcional,
  multiple,
}) => {
  const { register } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    prefijoId: 'archivo',
    name,
    label: {
      texto: label,
      opcional,
    },
  });

  return (
    <>
      <FormGroup controlId={idInput} className={`${className ?? ''} position-relative`}>
        <Form.Label>{textoLabel}</Form.Label>

        <Form.Control
          type="file"
          isInvalid={tieneError}
          multiple={multiple !== undefined && multiple === true}
          {...register(name, {
            required: {
              value: !opcional,
              message: 'Debe adjuntar evidencia',
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
