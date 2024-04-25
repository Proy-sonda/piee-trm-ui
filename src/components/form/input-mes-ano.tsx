import { InputReciclableBase, UnibleConFormArray } from '@/components/form';
import { existe } from '@/utilidades';
import { esFechaInvalida } from '@/utilidades/es-fecha-invalida';
import { endOfDay, endOfMonth, getYear, isAfter, isBefore, parse, startOfMonth } from 'date-fns';
import { default as es } from 'date-fns/locale/es';
import React, { useRef } from 'react';
import { Form, FormGroup, InputGroup } from 'react-bootstrap';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, useFormContext } from 'react-hook-form';
import IfContainer from '../if-container';
import { useInputReciclable } from './hooks';

registerLocale('es', es);
setDefaultLocale('es');

interface InputMesAnoProps extends InputReciclableBase, UnibleConFormArray {
  /** Fecha en formato `yyyy-MM-dd` */
  minDate?: string;

  /** Fecha en formato `yyyy-MM-dd` */
  maxDate?: string;
}

/**
 * El valor del input va a ser un objeto `Date` con la fecha seleccionada. En caso de que la fecha
 * sea invalida el valor del input va a ser `null`. Se tiene que parchar con un objeto `Date`.
 */
export const InputMesAno: React.FC<InputMesAnoProps> = ({
  name,
  label,
  className,
  opcional,
  unirConFieldArray,
  minDate,
  maxDate,
}) => {
  const FECHA_MINIMA_POR_DEFECTO = new Date(1920, 11, 31);

  const fechaMinima = existe(minDate)
    ? parse(minDate, 'yyyy-MM', startOfMonth(new Date()))
    : undefined;
  const fechaMaxima = existe(maxDate)
    ? parse(maxDate, 'yyyy-MM', endOfMonth(new Date()))
    : undefined;

  if (fechaMinima && fechaMinima < FECHA_MINIMA_POR_DEFECTO) {
    throw new Error('InputMesAno: La fecha minima no puede ser inferior a 1920');
  }

  if (fechaMaxima && fechaMaxima < FECHA_MINIMA_POR_DEFECTO) {
    throw new Error('InputMesAno: La fecha maxima no puede ser inferior a 1920');
  }

  const { control } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    prefijoId: 'mesano',
    name,
    label: { texto: label, opcional },
    unirConFieldArray,
  });

  const inputRef = useRef(null);

  return (
    <>
      <FormGroup className={className}>
        {textoLabel && <Form.Label>{textoLabel}</Form.Label>}

        <InputGroup className="flex-nowrap" style={{ minWidth: '100px' }}>
          <Controller
            control={control}
            name={name}
            rules={{
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
                    return 'Debe ser mayor o igual a enero de 1921';
                  }

                  if (fechaMinima && isBefore(fecha, fechaMinima)) {
                    return `Debe ser mayor o igual a ${minDate}`;
                  }
                },
                anteriorAfechaMaxima: (fecha: Date) => {
                  if (!fechaMaxima && isAfter(fecha, endOfDay(Date.now()))) {
                    return 'No puede ser posterior a hoy';
                  }

                  if (fechaMaxima && isAfter(fecha, fechaMaxima)) {
                    return `Debe ser menor o igual a ${maxDate}`;
                  }
                },
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <DatePicker
                ref={inputRef}
                id={idInput}
                className={
                  'form-control cursor-pointer position-relative border rounded-end-0 border-end-0 ' +
                  `${tieneError ? 'is-invalid border-danger background-img-none' : ''}`
                }
                minDate={fechaMinima}
                maxDate={fechaMaxima}
                showMonthYearPicker
                showFullMonthYearPicker
                showFourColumnMonthYearPicker
                dateFormat="MMM yyyy"
                onChange={onChange}
                onBlur={onBlur}
                selected={value}
                renderCustomHeader={({
                  date,
                  decreaseYear,
                  increaseYear,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => (
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ backgroundColor: 'var(--color-blue)', color: 'white' }}>
                    <button
                      type="button"
                      onClick={decreaseYear}
                      disabled={prevMonthButtonDisabled}
                      className="btn btn-primary border-0 rounded-circle">
                      <i className="bi bi-chevron-left" style={{ fontSize: '14px' }}></i>
                    </button>

                    <div className="fs-6">{getYear(date)}</div>

                    <button
                      type="button"
                      onClick={increaseYear}
                      disabled={nextMonthButtonDisabled}
                      className="btn btn-primary border-0 rounded-circle">
                      <i className="bi bi-chevron-right" style={{ fontSize: '14px' }}></i>
                    </button>
                  </div>
                )}
                renderMonthContent={(_, shortMonthText, fullMonthText) => (
                  <span style={{ fontSize: '14px' }} title={fullMonthText}>
                    {shortMonthText}
                  </span>
                )}
                monthClassName={() => 'p-1'}
              />
            )}
          />
          <InputGroup.Text
            className={
              'bg-white border border-start-0 border-top border-end border-bottom cursor-pointer ' +
              `${tieneError ? 'border-danger' : ''}`
            }
            onClick={() => {
              // NOTA: Los nombres de estos metodos se obtuvieron al loguear a la consola el componente
              (inputRef.current as any)?.setOpen?.(true);
              (inputRef.current as any)?.setFocus?.(true);
            }}>
            <i className="bi bi-calendar" style={{ fontSize: '14px' }}></i>
          </InputGroup.Text>
        </InputGroup>

        <IfContainer show={tieneError}>
          {/* Parece que para mostrar el error, bootstrap necesita un form-control invalido al mismo nivel que el tooltip. */}
          <div className="position-relative">
            <div className="d-none form-control is-invalid"></div>
            <div className="invalid-tooltip">{mensajeError}</div>
          </div>
        </IfContainer>
      </FormGroup>
    </>
  );
};
