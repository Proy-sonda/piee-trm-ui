import { InputReciclableBase, UnibleConFormArray } from '@/components/form';
import { esFechaInvalida } from '@/utilidades/es-fecha-invalida';
import { endOfDay, getYear, isAfter, isBefore } from 'date-fns';
import { default as es } from 'date-fns/locale/es';
import React from 'react';
import { Form, FormGroup, InputGroup } from 'react-bootstrap';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, useFormContext } from 'react-hook-form';
import IfContainer from '../if-container';
import { useInputReciclable } from './hooks';

registerLocale('es', es);
setDefaultLocale('es');

interface InputMesAnoProps extends InputReciclableBase, UnibleConFormArray {}

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
}) => {
  const { control } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    prefijoId: 'mesano',
    name,
    label: { texto: label, opcional },
    unirConFieldArray,
  });

  return (
    <>
      <FormGroup className={className}>
        {textoLabel && <Form.Label>{textoLabel}</Form.Label>}

        <InputGroup className="flex-nowrap" style={{ minWidth: '120px' }}>
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
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <DatePicker
                id={idInput}
                className={`form-control cursor-pointer position-relative border rounded-end-0 border-end-0  ${
                  tieneError ? 'is-invalid border-danger' : ''
                }`}
                showMonthYearPicker
                showTwoColumnMonthYearPicker
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
            className={`bg-white border border-start-0 border-top border-end border-bottom ${
              tieneError ? 'border-danger' : ''
            }`}>
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
