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

  /**
   * Solo llamar para cosas que no se puedan hacer dentro del input mismo. Para cosas como
   * validaciones o formatear el valor del input hacerlo dentro del componente mismo.
   */
  onBlur?: (dias: number) => Promise<void> | void;
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
  onBlur: onBlurHandler,
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

  const transformarDias = (dias: string | number | undefined) => {
    if (typeof dias === 'number' && !isNaN(dias)) {
      return dias;
    } else if (typeof dias === 'number' && isNaN(dias)) {
      return undefined;
    } else if (typeof dias === 'string' && dias === '') {
      return undefined;
    } else if (typeof dias === 'string') {
      return parseInt(dias, 10);
    } else {
      return undefined;
    }
  };

  return (
    <>
      <FormGroup controlId={idInput} className={`${className ?? ''} position-relative`}>
        {textoLabel && <Form.Label>{textoLabel}</Form.Label>}

        <Form.Control
          type="text"
          inputMode="numeric"
          maxLength={2}
          disabled={deshabilitado === true}
          style={{ textAlign: 'right' }}
          isInvalid={tieneError}
          {...register(name, {
            setValueAs: transformarDias,
            required: {
              value: !opcional,
              message: 'Este campo es obligatorio',
            },
            min: {
              value: minDiasFinal,
              message: `No puede ingresar menos de ${minDiasFinal} día${
                minDiasFinal > 1 ? 's' : ''
              }`,
            },
            max: {
              value: maxDiasFinal,
              message: `No puede ingresar más de ${maxDiasFinal} día${maxDiasFinal > 1 ? 's' : ''}`,
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
              if (event.target.value.length > 2) {
                event.target.value = event.target.value.slice(0, 2);
              }
              const regex = /[^0-9]/g; // solo números enteros positivos
              let dias = event.target.value as string;

              if (regex.test(dias)) {
                dias = dias.replaceAll(regex, '');
                setValue(name, dias === '' ? undefined : parseInt(dias), { shouldValidate: true });
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
