import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import IfContainer from '../if-container';
import { BaseProps, UnibleConFormArray } from './base-props';
import { useInputReciclable } from './hooks';

interface ComboSimpleProps<T> extends Omit<BaseProps, 'label'>, UnibleConFormArray {
  label?: string;

  /** Datos para rellenar el combo */
  datos?: T[];

  /**
   * Propiedad de un elemento de los datos para usar en las propiedades `key` y `value` del tag
   * `<option>`.
   */
  idElemento: keyof T | ((elemento: T) => number | string);

  /** Propiedad de un elemento de los datos para usar como texto de tag `<option />` */
  descripcion: keyof T | ((elemento: T) => string);

  /** Texto para incluir como la opción nula (default: `'Seleccionar'`). */
  textoOpcionPorDefecto?: string;

  /**
   * Si parsear la propiedad `value` del tag `<option />` a numero o dejarla como string
   * (default: `number`).
   * */
  tipoValor?: 'number' | 'string';

  opcional?: boolean;
}

/**
 * El valor en caso de ser opcional es un string vacío cuando el combo es tipo `string` o `NaN`
 * cuando es un combo tipo `number`.
 */
export const ComboSimple = <T extends Record<string, any>>({
  name,
  label,
  className,
  datos,
  idElemento,
  descripcion,
  textoOpcionPorDefecto,
  tipoValor,
  opcional,
  unirConFieldArray,
}: ComboSimpleProps<T>) => {
  const { register } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    name,
    prefijoId: 'combo',
    label: {
      texto: label,
      opcional,
      omitirSignoObligatorio: false,
    },
    unirConFieldArray,
  });

  const calcularId = (x: T) => {
    return typeof idElemento === 'function' ? idElemento(x) : (x[idElemento] as any);
  };

  const calcularDescripcion = (x: T) => {
    return typeof descripcion === 'function' ? descripcion(x) : (x[descripcion] as any);
  };

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        <IfContainer show={textoLabel}>
          <Form.Label>{textoLabel}</Form.Label>
        </IfContainer>

        <Form.Select
          autoComplete="new-custom-value"
          isInvalid={tieneError}
          {...register(name, {
            setValueAs: (value) => {
              if (!tipoValor || tipoValor === 'number') {
                return parseInt(value, 10);
              } else {
                return value;
              }
            },
            validate: {
              comboObligatorio: (valor: number | string) => {
                if (opcional) {
                  return;
                }

                if (Number.isNaN(valor)) {
                  return 'Este campo es obligatorio';
                }

                if (typeof valor === 'string' && valor === '') {
                  return 'Este campo es obligatorio';
                }
              },
            },
          })}>
          <option value={''}>{textoOpcionPorDefecto ?? 'Seleccionar'}</option>
          {(datos ?? []).map((dato) => (
            <option key={calcularId(dato)} value={calcularId(dato)}>
              {calcularDescripcion(dato)}
            </option>
          ))}
        </Form.Select>

        <Form.Control.Feedback type="invalid" tooltip>
          {mensajeError}
        </Form.Control.Feedback>
      </FormGroup>
    </>
  );
};
