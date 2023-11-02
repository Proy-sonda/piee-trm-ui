import { InputReciclableBase, UnibleConFormArray } from '@/components/form';
import { esFechaInvalida } from '@/utilidades/es-fecha-invalida';
import { endOfDay, isAfter, isBefore } from 'date-fns';
import { default as es } from 'date-fns/locale/es';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
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
 * sea invalida el valor del input va a ser `Invalid Date`, que se puede revisar con la funcion
 * `esFechaInvalida` de las utilidades.
 *
 * Se tiene que parchar con un string en formato `yyyy-MM` o usar un string vacio `''` para dejarlo
 * en blanco.
 */
export const InputMesAno: React.FC<InputMesAnoProps> = ({
  name,
  label,
  className,
  opcional,
  unirConFieldArray,
}) => {
  const { register, control } = useFormContext();

  // const { ref, ...resto } = register(name, {
  //   setValueAs: (dateStr: string) => {
  //     /** Situa la fecha con respecto al inicio de hoy */
  //     const date = parse(dateStr, 'yyyy-MM', startOfMonth(new Date()));

  //     setTextoFecha(
  //       !dateStr || dateStr.trim() === ''
  //         ? '--- ----'
  //         : capitalizar(format(date, 'MMM yyyy', { locale: esLocale })),
  //     );

  //     return date;
  //   },
  //   required: {
  //     value: !opcional,
  //     message: 'La fecha es obligatoria',
  //   },
  //   validate: {
  //     esFechaValida: (fecha: Date) => {
  //       if (!opcional && esFechaInvalida(fecha)) {
  //         return 'La fecha es inválida';
  //       }
  //     },
  //     despuesDe1920: (fecha: Date) => {
  //       if (isBefore(fecha, new Date(1920, 11, 31))) {
  //         return 'Debe ser mayor o igual a enero de 1921';
  //       }
  //     },
  //     noMayorQueHoy: (fecha: Date) => {
  //       if (isAfter(fecha, endOfDay(Date.now()))) {
  //         return 'No puede ser posterior a hoy';
  //       }
  //     },
  //   },
  // });

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

        {tieneError && <div className="invalid-feedback">{mensajeError}</div>}

        {/* <InputGroup className="flex-nowrap" style={{ minWidth: '100px' }}> */}
        <div style={{ minWidth: '100px' }}>
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
                className={`form-control cursor-pointer position-relative ${
                  tieneError ? 'is-invalid' : ''
                }`}
                showMonthYearPicker
                showFullMonthYearPicker
                showFourColumnMonthYearPicker
                dateFormat="MMM yyyy"
                onChange={onChange}
                onBlur={onBlur}
                selected={value}
              />
            )}
          />
        </div>
      </FormGroup>
      {/* <InputGroup.Text className="bg-white border border-start-0 border-top border-end border-bottom">
            <i className="bi bi-calendar" style={{ fontSize: '14px' }}></i>
          </InputGroup.Text>
        </InputGroup> */}

      {/* <InputGroup
  className="position-absolute top-0 start-0 end-0"
  onClick={() => {
    if (inputRef.current) {
      inputRef.current.showPicker();
    }
  }}>
  <Form.Control
    type="text"
    readOnly
    isInvalid={tieneError()}
    value={textoFecha}
    className="cursor-pointer border border-end-0"
    style={{ minWidth: '100px' }}
  />
  <InputGroup.Text className="bg-white border border-start-0 border-top border-end border-bottom">
    <Form.Control
      type="month"
      tabIndex={-1}
      className="p-0 m-0 cursor-pointer border border-0"
      style={{
        width: '20px',
        height: '100%',
      }}
      onClick={(e) => e.preventDefault()}
    />
  </InputGroup.Text>
</InputGroup>

<Form.Control
  type="month"
  ref={(e: any) => {
    ref(e);
    inputRef.current = e;
  }}
  {...resto}
/> */}
      <IfContainer show={tieneError}>
        <div className="position-relative">
          <div className="form-control is-invalid"></div>
          <div className="invalid-tooltip">{mensajeError}</div>
        </div>
      </IfContainer>

      {/* <Form.Control.Feedback type="invalid" tooltip>
          {mensajeDeError()}
        </Form.Control.Feedback> */}
    </>
  );
};
