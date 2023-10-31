import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { InputReciclableBase, UnibleConFormArray } from './base-props';
import { useInputReciclable } from './hooks';

interface ComboSimpleProps<T> extends InputReciclableBase, UnibleConFormArray {
  /** Datos para rellenar el combo */
  datos?: T[];

  /**
   * Propiedad de un elemento de los datos para usar en las propiedades `key` y `value` del tag
   * `<option>`.
   *
   * Se puede usar un callback para generar el ID a partir de un elemento del elemento en caso de
   * que no se pueda usar una sola propiedad.
   */
  idElemento: keyof T | ((elemento: T) => number | string);

  /**
   * Propiedad de un elemento de los datos para usar como texto de tag `<option />`
   *
   * Se puede usar un callback para generar la descripcion a partir de un elemento del elemento en
   * caso de  que no se pueda usar una sola propiedad.
   */
  descripcion: keyof T | ((elemento: T) => string);

  /** Texto para incluir como la opción nula (default: `'Seleccionar'`). */
  textoOpcionPorDefecto?: string;

  /**
   * Si parsear la propiedad `value` del tag `<option />` a numero o dejarla como string
   * (default: `number`).
   * */
  tipoValor?: 'number' | 'string';
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
        {textoLabel && <Form.Label>{textoLabel}</Form.Label>}

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
