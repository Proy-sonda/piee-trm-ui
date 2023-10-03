import { BaseProps } from '@/components/form';
import { useRandomId } from '@/hooks/use-random-id';
import { esFechaInvalida } from '@/utilidades/es-fecha-invalida';
import { endOfDay, isAfter, isBefore, parse, startOfDay } from 'date-fns';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

interface InputFechaProps extends BaseProps {
  opcional?: boolean;

  /**
   * Propiedad `name` del `InputFecha` tal que la fecha de este input no sea anterior que el input
   * indicado.
   *
   * Si los valores no coindiden, el error se muestra en el input que define la propiedad
   * `noAnteriorA`.
   *
   * @example
   *  ```typescriptreact
   *  <InputFecha name="desde" />
   *
   *  // Se valida que la fecha de este input no sea anterior al del input "desde"
   *  <InputFecha name="hasta" noAnteriorA="desde" />
   *  ```
   */
  noAnteriorA?: string;

  /**
   * Propiedad `name` del `InputFecha` tal que la fecha de este input no sea posterior a la del
   * input indicado.
   *
   * Si los valores no coindiden, el error se muestra en el input que define la propiedad
   * `noPosteriorA`.
   *
   * @example
   *  ```typescriptreact
   *  // Se valida que la fecha de este input no sea posterior al del input "hasta"
   *  <InputFecha name="desde" noPosteriorA="desde" />
   *
   *  <InputFecha name="hasta"  />
   *  ```
   */
  noPosteriorA?: string;
}

/**
 * El valor del input va a ser un objeto `Date` con la fecha seleccionada. En caso de que la fecha
 * sea invalida el valor del input va a ser `Invalid Date`, que se puede revisar con la funcion
 * `esFechaInvalida` de las utilidades.
 */
export const InputFecha: React.FC<InputFechaProps> = ({
  name,
  label,
  className,
  opcional,
  noAnteriorA,
  noPosteriorA,
}) => {
  const idInput = useRandomId('fecha');

  const {
    register,
    formState: { errors },
    getValues,
  } = useFormContext();

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        <Form.Label>{`${label}${!opcional ? ' (*)' : ''}`}</Form.Label>
        <Form.Control
          type="date"
          autoComplete="new-custom-value"
          isInvalid={!!errors[name]}
          {...register(name, {
            setValueAs: (date: string) => {
              /** Situa la fecha con respecto al inicio de hoy */
              return parse(date, 'yyyy-MM-dd', startOfDay(new Date()));
            },
            required: {
              value: !opcional,
              message: 'La fecha es obligatoria',
            },
            validate: {
              esFechaValida: (fecha: Date) => {
                if (!opcional && esFechaInvalida(fecha)) {
                  return 'La fecha es inválida';
                }
              },
              despuesDe1920: (fecha: Date) => {
                if (isBefore(fecha, new Date(1920, 0, 1))) {
                  return 'Debe ser posterior al 01/01/1920';
                }
              },
              noMayorQueHoy: (fecha: Date) => {
                if (isAfter(fecha, endOfDay(Date.now()))) {
                  return 'No puede ser posterior a hoy';
                }
              },
              noAnteriorADesde: (fecha: Date) => {
                if (noAnteriorA === name) {
                  throw new Error("No se puede validar 'fechaDesde' contra si mismo");
                }

                if (!noAnteriorA) {
                  return;
                }

                const desde: Date = getValues(noAnteriorA);
                if (!esFechaInvalida(desde) && isBefore(fecha, desde)) {
                  return 'No puede ser anterior a desde';
                }
              },
              noPosteriorAHasta: (fecha: Date) => {
                if (noPosteriorA === name) {
                  throw new Error("No se puede validar 'fechaHasta' contra si mismo");
                }

                if (!noPosteriorA) {
                  return;
                }

                const hasta: Date = getValues(noPosteriorA);
                if (!esFechaInvalida(hasta) && isAfter(fecha, hasta)) {
                  return 'No puede ser posterior a hasta';
                }
              },
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
