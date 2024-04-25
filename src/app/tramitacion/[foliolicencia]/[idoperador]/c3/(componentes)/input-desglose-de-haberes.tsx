import { InputReciclableBase, UnibleConFormArray } from '@/components/form';
import { useInputReciclable } from '@/components/form/hooks';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { DesgloseDeHaberes, existeDesglose, totalDesglose } from '../(modelos)';

interface InputDesgloseDeHaberes extends InputReciclableBase, UnibleConFormArray {
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
              coincideConMontoTotal: (desglose: DesgloseDeHaberes) => {
                if (!opcional && !existeDesglose(desglose)) {
                  return 'El desglose de haberes es obligatorio';
                }
                if (!existeDesglose(desglose)) {
                  return;
                }

                const montoTotalEnBruto = getValues(montoImponibleName);
                const montoTotal = isNaN(montoTotalEnBruto) ? 0 : getValues(montoImponibleName);
                if (totalDesglose(desglose) !== montoTotal) {
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
