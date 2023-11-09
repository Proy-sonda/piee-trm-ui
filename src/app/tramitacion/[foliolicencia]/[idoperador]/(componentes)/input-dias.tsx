import { InputReciclableBase, UnibleConFormArray } from '@/components/form';
import { useInputReciclable } from '@/components/form/hooks';
import { esFechaInvalida } from '@/utilidades';
import { differenceInDays } from 'date-fns';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

interface InputDiasProps extends InputReciclableBase, UnibleConFormArray {
  /** Número mínimo de días (default: 0) */
  minDias?: number;

  /** Numero maximo de dias (default: `31`) */
  maxDias?: number;

  coincideConRango?: {
    /** Nombre del input en la función `register` para la fecha desde */
    desde: string;

    /** Nombre del input en la función `register` para la fecha hasta */
    hasta: string;
  };
}

export const InputDias: React.FC<InputDiasProps> = ({
  name,
  label,
  className,
  opcional,
  minDias,
  maxDias,
  deshabilitado,
  unirConFieldArray,
  coincideConRango,
}) => {
  const minDiasFinal = minDias ?? 0;
  const maxDiasFinal = maxDias ?? 31;

  const { register, setValue, getValues } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    name,
    prefijoId: 'dias',
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
          disabled={deshabilitado === true}
          isInvalid={tieneError}
          {...register(name, {
            valueAsNumber: true,
            required: {
              value: !opcional,
              message: 'Este campo es obligatorio',
            },
            min: {
              value: minDiasFinal,
              message: `No puede ingresar menos de ${minDiasFinal} días`,
            },
            max: {
              value: maxDiasFinal,
              message: `No puede ingresar más de ${maxDiasFinal} días`,
            },
            validate: {
              estaEnRango: (dias) => {
                if (!coincideConRango) {
                  return;
                }

                const desde = getValues(coincideConRango.desde);
                const hasta = getValues(coincideConRango.hasta);

                if (!esFechaInvalida(desde) && !esFechaInvalida(hasta)) {
                  /* `differenceInDays` cuenta los dias completos, el "+1" es para que considere
                   * el mismo dia que se emite la licencia */
                  const diasEnRango = differenceInDays(hasta, desde) + 1;

                  if (dias !== diasEnRango) {
                    return 'Los días no coinciden con el rango indicado';
                  }
                }
              },
            },
            onChange: (event: any) => {
              const regex = /[^0-9-]/g; // solo números enteros
              let dias = event.target.value as string;

              if (regex.test(dias)) {
                dias = dias.replaceAll(regex, '');
                setValue(name, dias === '' ? undefined : parseInt(dias), { shouldValidate: true });
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
