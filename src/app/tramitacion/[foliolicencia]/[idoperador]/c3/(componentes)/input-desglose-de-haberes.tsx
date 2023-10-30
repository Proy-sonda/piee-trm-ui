import { BaseProps, UnibleConFormArray } from '@/components/form';
import { useInputReciclable } from '@/components/form/hooks';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { DesgloseDeHaberes } from '../(modelos)/desglose-de-haberes';
import { tieneDesglose } from '../(modelos)/formulario-c3';

interface InputDesgloseDeHaberes extends Omit<BaseProps, 'label'>, UnibleConFormArray {
  opcional?: boolean;

  /**
   * Nombre de la propiedad `name` usada en el campo de monto imponible para validar que el
   * desglose coincida con este.
   */
  montoImponibleName: string;
}

export const InputDesgloseDeHaberes: React.FC<InputDesgloseDeHaberes> = ({
  name,
  opcional,
  unirConFieldArray,
  montoImponibleName,
}) => {
  const { register, getValues } = useFormContext();

  const { idInput, tieneError, mensajeError } = useInputReciclable({
    name,
    prefijoId: 'desgloseHaberes',
    label: {},
    unirConFieldArray,
  });

  return (
    <>
      <FormGroup controlId={idInput} className="position-relative">
        <Form.Control
          type="hidden"
          isInvalid={tieneError}
          {...register(name, {
            required: {
              value: !opcional,
              message: 'El desglose de haberes es obligatorio',
            },
            validate: {
              coincideConMontoImponible: (desglose: DesgloseDeHaberes | Record<string, never>) => {
                if (!tieneDesglose(desglose)) {
                  return;
                }

                const montoImponibleEnBruto = getValues(montoImponibleName);
                const montoImponible = isNaN(montoImponibleEnBruto)
                  ? 0
                  : getValues(montoImponibleName);

                const totalDesglose = Object.values(desglose).reduce(
                  (total, monto: number) => total + monto,
                  0,
                );

                if (totalDesglose !== montoImponible) {
                  return 'No coincide con monto imponible';
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
