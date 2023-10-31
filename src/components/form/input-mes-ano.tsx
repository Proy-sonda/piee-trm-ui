import { InputReciclableBase, UnibleConFormArray } from '@/components/form';
import { esFechaInvalida } from '@/utilidades/es-fecha-invalida';
import { endOfDay, format, isAfter, isBefore, parse, startOfMonth } from 'date-fns';
import React, { useRef, useState } from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { useInputReciclable } from './hooks';

interface InputMesAnoProps extends InputReciclableBase, UnibleConFormArray {}

/**
 * El valor del input va a ser un objeto `Date` con la fecha seleccionada. En caso de que la fecha
 * sea invalida el valor del input va a ser `Invalid Date`, que se puede revisar con la funcion
 * `esFechaInvalida` de las utilidades.
 */
export const InputMesAno: React.FC<InputMesAnoProps> = ({
  name,
  label,
  className,
  opcional,
  unirConFieldArray,
}) => {
  const { register } = useFormContext();

  const [textoFecha, setTextoFecha] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { ref, ...resto } = register(name, {
    setValueAs: (date: string) => {
      /** Situa la fecha con respecto al inicio de hoy */
      const date2 = parse(date, 'yyyy-MM', startOfMonth(new Date()));

      if (!esFechaInvalida(date2)) {
        setTextoFecha(format(date2, 'MMMM - yyyy'));
      }

      return date2;
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
          return 'Debe ser mayor o igual a enero de 1921';
        }
      },
      noMayorQueHoy: (fecha: Date) => {
        if (isAfter(fecha, endOfDay(Date.now()))) {
          return 'No puede ser posterior a hoy';
        }
      },
    },
  });

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    prefijoId: 'mesano',
    name,
    label: { texto: label, opcional },
    unirConFieldArray,
  });

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        {textoLabel && <Form.Label>{textoLabel}</Form.Label>}

        <Form.Control
          type="text"
          readOnly
          value={textoFecha}
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.showPicker();
            }
          }}
        />

        <Form.Control
          type="month"
          style={{ display: 'none' }}
          autoComplete="new-custom-value"
          isInvalid={tieneError}
          ref={(e: any) => {
            ref(e);
            inputRef.current = e;
          }}
          {...resto}
        />

        <Form.Control.Feedback type="invalid" tooltip>
          {mensajeError}
        </Form.Control.Feedback>
      </FormGroup>
    </>
  );
};
