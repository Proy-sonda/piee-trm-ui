import { InputReciclableBase } from '@/components';
import { useInputReciclable } from '@/components/form/hooks';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

interface InputPorcentajeDesahucioProps extends InputReciclableBase {}

export const InputPorcentajeDesahucio: React.FC<InputPorcentajeDesahucioProps> = ({
  name,
  label,
  className,
  opcional,
  deshabilitado,
}) => {
  const { register } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    name,
    prefijoId: 'porcentajeDeshaucio',
    label: { texto: label },
  });

  return (
    <>
      <FormGroup controlId={idInput} className={`${className ?? ''} position-relative`}>
        {textoLabel && <Form.Label>{textoLabel}</Form.Label>}

        <Form.Control
          type="number"
          step={0.01}
          disabled={deshabilitado === true}
          style={{ textAlign: 'right' }}
          isInvalid={tieneError}
          {...register(name, {
            valueAsNumber: true,
            required: {
              value: !opcional,
              message: 'Este campo es obligatorio',
            },
            min: {
              value: 0,
              message: 'No puede ser menor a 0%',
            },
            max: {
              value: 100,
              message: 'No puede ser mayor a 100%',
            },
            validate: {
              precisionDelDecimal: (porcentaje: number) => {
                if (isNaN(porcentaje)) {
                  return;
                }

                const [, parteDecimal] = porcentaje.toString().split('.');
                if (parteDecimal && parteDecimal.length > 2) {
                  return 'Solo puede tener hasta 2 decimales';
                }
              },
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
