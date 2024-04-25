import { InputReciclableBase, UnibleConFormArray } from '@/components/form';
import { useInputReciclable } from '@/components/form/hooks';
import { useFetch } from '@/hooks';
import { ENUM_CONFIGURACION } from '@/modelos/enum/configuracion';
import { BuscarConfiguracion } from '@/servicios/buscar-configuracion';
import React, { useEffect, useState } from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

interface InputMontoImponibleProps extends InputReciclableBase, UnibleConFormArray {
  /** (defecto: `0`) */
  montoMinimo?: number;

  /** (defecto: lo definido por la función {@link montoMaximoPorDefecto} ) */
  montoMaximo?: number;

  /**
   * Solo llamar para cosas que no se puedan hacer dentro del input mismo. Para cosas como
   * validaciones o formatear el valor del input hacerlo dentro del componente mismo.
   */
  onBlur?: (monto: number) => Promise<void> | void;
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
  onBlur: onBlurHandler,
}) => {
  const montoMinimoFinal = montoMinimo ?? 0;
  const [, configuracion] = useFetch(BuscarConfiguracion());
  const [montoMaximoFinal, setmontoMaximoFinal] = useState(montoMaximo ?? 5000000);
  useEffect(() => {
    if (configuracion) {
      const fechaActual = new Date();
      if (name === 'remuneracionImponiblePrevisional') {
        const fechavigencia = new Date(
          configuracion.find(
            (c) => c.codigoparametro === ENUM_CONFIGURACION.MONTO_MAXIMO_ULTIMA_RENTA,
          )!?.fechavigencia,
        );
        if (fechaActual > fechavigencia) return;
        return setmontoMaximoFinal(
          Number(
            configuracion.find(
              (c) => c.codigoparametro === ENUM_CONFIGURACION.MONTO_MAXIMO_ULTIMA_RENTA,
            )?.valor,
          ),
        );
      }

      const fechaVigencia = new Date(
        configuracion.find((c) => c.codigoparametro === ENUM_CONFIGURACION.MONTO_MAXIMO_RENTA)!
          ?.fechavigencia,
      );
      if (fechaActual > fechaVigencia) return;
      setmontoMaximoFinal(
        Number(
          configuracion.find((c) => c.codigoparametro === ENUM_CONFIGURACION.MONTO_MAXIMO_RENTA)
            ?.valor,
        ),
      );
    }
  }, [configuracion]);

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
          style={{ textAlign: 'right' }}
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
              if (event.target.value.length > 9) {
                event.target.value = event.target.value.slice(0, 9);
              }
              const regex = /[^0-9-]/g; // Solo numeros enteros
              let montoImponible = event.target.value as string;

              if (regex.test(montoImponible)) {
                montoImponible = montoImponible.replaceAll(regex, '');
                setValue(name, montoImponible === '' ? undefined : parseInt(montoImponible), {
                  shouldValidate: true,
                });
              }
            },
            onBlur: (event) => {
              const monto = event.target.valueAsNumber ?? NaN;
              onBlurHandler?.(monto);
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
