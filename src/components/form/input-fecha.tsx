import { InputReciclableBase, UnibleConFormArray } from '@/components/form';
import { esFechaInvalida } from '@/utilidades/es-fecha-invalida';
import { endOfDay, isAfter, isBefore, parse, startOfDay } from 'date-fns';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { useInputReciclable } from './hooks';

interface InputFechaProps extends InputReciclableBase, UnibleConFormArray {
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

  esEmision?: boolean;
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
  esEmision,
  deshabilitado,
  unirConFieldArray,
}) => {
  const { register, getValues } = useFormContext();

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
                if (isBefore(fecha, new Date(1920, 11, 31))) {
                  return 'Debe ser mayor o igual al 31/12/1920';
                }
              },
              noMayorQueHoy: (fecha: Date) => {
                if (isAfter(fecha, endOfDay(Date.now()))) {
                  return 'No puede ser posterior a hoy';
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
                // Este input es de "tipo desde"
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
              },
              obligatorioSiHayFechaDesde: (fecha: Date, otrosCampos: Record<string, any>) => {
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
                // Este input es de "tipo hasta"
                if (noAnteriorA === name) {
                  throw new Error(`No se puede validar InputFecha "${name}" contra si mismo`);
                }

                if (!noAnteriorA) {
                  return;
                }

                const desde: Date = getValues(noAnteriorA);
                if (!esFechaInvalida(desde) && isBefore(fecha, desde)) {
                  return esEmision
                    ? 'La fecha no puede ser menor a la emisión'
                    : 'No puede ser anterior a desde';
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
