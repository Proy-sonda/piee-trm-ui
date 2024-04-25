import { ErroresEditables, InputReciclableBase, UnibleConFormArray } from '@/components/form';
import { existe } from '@/utilidades';
import { esFechaInvalida } from '@/utilidades/es-fecha-invalida';
import {
  endOfDay,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  parse,
  startOfDay,
  startOfMonth,
} from 'date-fns';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { useInputReciclable } from './hooks';

interface InputFechaProps
  extends InputReciclableBase,
    UnibleConFormArray,
    ErroresEditables<'anteriorADesde'> {
  /**
   * Propiedad `name` del `InputFecha` tal que la fecha de este input no sea anterior que el input
   * indicado.
   *
   * > IMPORTANTE: Si se incluye un valor para `noAnteriorA`, este input se vuelve obligatorio.
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
   * > IMPORTANTE: Si se incluye un valor para `noPosteriorA`, este input se vuelve obligatorio.
   *
   * @example
   *  ```typescriptreact
   *  // Se valida que la fecha de este input no sea posterior al del input "hasta"
   *  <InputFecha name="desde" noPosteriorA="hasta" />
   *
   *  <InputFecha name="hasta"  />
   *  ```
   */
  noPosteriorA?: string;

  /**
   * String en formato `yyyy-MM-dd` que indica la minima fecha posible (inclusivo).
   *
   * No puede ser anterior a `1920-11-31`.
   *
   * @default 1920-11-31
   */
  minDate?: string;

  /**
   * String en formato `yyyy-MM-dd` que indica la fecha maxima  (inclusivo).
   *
   * No puede ser anterior a `1920-11-31`.
   *
   * @default Hoy
   */
  maxDate?: string;
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
  deshabilitado,
  unirConFieldArray,
  errores,
  minDate,
  maxDate,
}) => {
  const FECHA_MINIMA_POR_DEFECTO = new Date(1920, 11, 31);

  const fechaMinima = existe(minDate)
    ? parse(minDate, 'yyyy-MM-dd', startOfMonth(new Date()))
    : undefined;
  const fechaMaxima = existe(maxDate)
    ? parse(maxDate, 'yyyy-MM-dd', endOfMonth(new Date()))
    : undefined;

  if (fechaMinima && fechaMinima < FECHA_MINIMA_POR_DEFECTO) {
    throw new Error('InputFecha: La fecha minima no puede ser inferior a 1920');
  }

  if (fechaMaxima && fechaMaxima < FECHA_MINIMA_POR_DEFECTO) {
    throw new Error('InputFecha: La fecha maxima no puede ser inferior a 1920');
  }

  const { register, getValues, clearErrors } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    prefijoId: 'fecha',
    name,
    label: { texto: label, opcional },
    unirConFieldArray,
  });

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        {textoLabel && <Form.Label>{textoLabel}</Form.Label>}

        <Form.Control
          type="date"
          autoComplete="new-custom-value"
          disabled={deshabilitado === true}
          isInvalid={tieneError}
          min={minDate}
          max={maxDate}
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
              posteriorAFechaMinima: (fecha: Date) => {
                if (!fechaMinima && isBefore(fecha, FECHA_MINIMA_POR_DEFECTO)) {
                  return 'Debe ser mayor o igual al 31/12/1920';
                }

                if (fechaMinima && isBefore(fecha, fechaMinima)) {
                  return `Debe ser mayor o igual a ${format(fechaMinima, 'dd/MM/yyyy')}`;
                }
              },
              anteriorAFechaMaxima: (fecha: Date) => {
                if (!fechaMaxima && isAfter(fecha, endOfDay(Date.now()))) {
                  return 'No puede ser posterior a hoy';
                }

                if (fechaMaxima && isAfter(fecha, fechaMaxima)) {
                  return `Debe ser menor o igual a ${format(fechaMaxima, 'dd/MM/yyyy')}`;
                }
              },
              obligatorioSiHayFechaHasta: (fecha: Date) => {
                // Este input es de "tipo desde"
                if (noPosteriorA === name) {
                  throw new Error(`No se puede validar InputFecha "${name}" contra si mismo`);
                }

                if (!noPosteriorA) {
                  return;
                }

                const hasta: Date = getValues(noPosteriorA);
                if (esFechaInvalida(fecha) && !esFechaInvalida(hasta)) {
                  return 'Debe incluir la fecha desde';
                }
              },
              noPosteriorAHasta: (fecha: Date) => {
                // Este input es de "tipo desde". Se asume que la fecha de este input es valida
                if (noPosteriorA === name) {
                  throw new Error(`No se puede validar InputFecha "${name}" contra si mismo`);
                }

                if (!noPosteriorA) {
                  return;
                }

                const hasta: Date = getValues(noPosteriorA);
                if (!esFechaInvalida(hasta) && isAfter(fecha, hasta)) {
                  return 'No puede ser posterior a hasta';
                }

                if (!esFechaInvalida(hasta) && isBefore(fecha, hasta)) {
                  clearErrors(noPosteriorA);
                }
              },
              obligatorioSiHayFechaDesde: (fecha: Date) => {
                // Este input es de "tipo hasta"
                if (noAnteriorA === name) {
                  throw new Error(`No se puede validar InputFecha "${name}" contra si mismo`);
                }

                if (!noAnteriorA) {
                  return;
                }

                const desde: Date = getValues(noAnteriorA);

                if (esFechaInvalida(fecha) && !esFechaInvalida(desde)) {
                  return 'Debe incluir la fecha hasta';
                }
              },
              noAnteriorADesde: (fecha: Date) => {
                // Este input es de tipo "hasta". Se asume que la fecha de este input es valida
                if (noAnteriorA === name) {
                  throw new Error(`No se puede validar InputFecha "${name}" contra si mismo`);
                }

                if (!noAnteriorA) {
                  return;
                }

                const desde: Date = getValues(noAnteriorA);
                if (!esFechaInvalida(desde) && isBefore(fecha, desde)) {
                  return errores?.anteriorADesde ?? 'No puede ser anterior a desde';
                }

                if (!esFechaInvalida(desde) && isAfter(fecha, desde)) {
                  clearErrors(noPosteriorA);
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
