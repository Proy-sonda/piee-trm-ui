import { InputReciclableBase, UnibleConFormArray } from '@/components/form';
import { useInputReciclable } from '@/components/form/hooks';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

interface InputMontoImponibleProps extends InputReciclableBase, UnibleConFormArray {
  /** (defecto: `0`) */
  montoMinimo?: number;

  /** (defecto: lo definido por la función {@link montoMaximoPorDefecto} ) */
  montoMaximo?: number;
}

export const InputMonto: React.FC<InputMontoImponibleProps> = ({
  name,
  label,
  className,
  opcional,
  montoMinimo,
  montoMaximo,
  deshabilitado,
  unirConFieldArray,
}) => {
  const montoMinimoFinal = montoMinimo ?? 0;
  const montoMaximoFinal = montoMaximo ?? 5_000_000;

  const { register, setValue } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    name,
    prefijoId: 'monto',
    label: { texto: label },
    unirConFieldArray,
  });

  return (
    <>
      <FormGroup controlId={idInput} className={`${className ?? ''} position-relative`}>
        {textoLabel && <Form.Label>{textoLabel}</Form.Label>}

        <Form.Control
          type="number"
          inputMode="numeric"
          disabled={deshabilitado}
          isInvalid={tieneError}
          {...register(name, {
            valueAsNumber: true,
            required: {
              value: !opcional,
              message: 'Este campo es obligatorio',
            },
            min: {
              value: montoMinimoFinal,
              message: `No puede ser menor a $${montoMinimoFinal.toLocaleString()}`,
            },
            max: {
              value: montoMaximoFinal,
              message: `No puede ser mayor a $${montoMaximoFinal.toLocaleString()}`,
            },
            onChange: (event: any) => {
              const regex = /[^0-9-]/g; // Solo numeros enteros
              let montoImponible = event.target.value as string;

              if (regex.test(montoImponible)) {
                montoImponible = montoImponible.replaceAll(regex, '');
                setValue(name, montoImponible === '' ? undefined : parseInt(montoImponible), {
                  shouldValidate: true,
                });
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
