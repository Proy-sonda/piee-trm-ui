import { InputReciclableBase, UnibleConFormArray } from '@/components/form';
import { useInputReciclable } from '@/components/form/hooks';
import { useFetch } from '@/hooks';
import { ENUM_CONFIGURACION } from '@/modelos/enum/configuracion';
import { BuscarConfiguracion } from '@/servicios/buscar-configuracion';
import React, { useEffect, useState } from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { DesgloseDeHaberes, existeDesglose, totalDesglose } from '../(modelos)';

interface InputDesgloseDeHaberes extends InputReciclableBase, UnibleConFormArray {
  /**
   * Nombre de la propiedad `name` usada en el campo de monto imponible para validar que el
   * desglose coincida con este.
   */
  montoImponibleName: string;
  montoMinimo?: number;

  /** (defecto: lo definido por la función {@link montoMaximoPorDefecto} ) */
  montoMaximo?: number;
}

export const InputDesgloseDeHaberes: React.FC<InputDesgloseDeHaberes> = ({
  name,
  opcional,
  unirConFieldArray,
  montoImponibleName,
  montoMinimo,
}) => {
  const montoMinimoFinal = montoMinimo ?? 0;

  const [, configuracion] = useFetch(BuscarConfiguracion());
  const [montoMaximoFinal, setmontoMaximoFinal] = useState(5000000);
  const { register, getValues } = useFormContext();

  const { idInput, tieneError, mensajeError } = useInputReciclable({
    name,
    prefijoId: 'desgloseHaberes',
    label: {},
    unirConFieldArray,
  });

  useEffect(() => {
    if (configuracion) {
      setmontoMaximoFinal(
        Number(
          configuracion.find((c) => c.codigoparametro === ENUM_CONFIGURACION.MONTO_MAXIMO_RENTA)
            ?.valor,
        ),
      );
    }
  }, [configuracion]);

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
            min: {
              value: montoMinimoFinal,
              message: `No puede ser menor a $${montoMinimoFinal.toLocaleString()}`,
            },
            max: {
              value: montoMaximoFinal,
              message: `No puede ser mayor a $${montoMaximoFinal.toLocaleString()}`,
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
