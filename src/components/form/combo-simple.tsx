import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { InputReciclableBase, UnibleConFormArray } from './base-props';
import { useInputReciclable } from './hooks';

const VALOR_POR_DEFECTO_EN_TIPO_NUMBER = -99999999;

const VALOR_POR_DEFECTO_EN_TIPO_STRING = '';

type TipoValorComboSimple = 'number' | 'string';

export const esElValorPorDefecto = (value: number | string) => {
  if (typeof value === 'number') {
    return value === VALOR_POR_DEFECTO_EN_TIPO_NUMBER;
  } else {
    return value === VALOR_POR_DEFECTO_EN_TIPO_STRING;
  }
};

interface ComboSimpleProps<T> extends InputReciclableBase, UnibleConFormArray {
  /** Datos para rellenar el combo */
  datos?: T[];

  /**
   * Propiedad de un elemento de los datos para usar en las propiedades `key` y `value` del tag
   * `<option>`.
   *
   * Tambien se puede usar un callback para generar el ID a partir de un elemento caso de que no
   * se pueda usar una sola propiedad.
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
  tipoValor?: TipoValorComboSimple;

  /**
   * Solo llamar para cosas que no se puedan hacer dentro del input mismo. Para cosas como
   * validaciones o formatear el valor del input hacerlo dentro del componente mismo.
   */
  onBlur?: (value: number | string) => Promise<void> | void;
}

/**
 * Para ver si se selecciono el valor por defecto del combo usar la funcion {@link esElValorPorDefecto}
 */
export const ComboSimple = <T extends Record<string, any>>({
  name,
  label,
  className,
  deshabilitado,
  datos,
  idElemento,
  descripcion,
  textoOpcionPorDefecto,
  tipoValor,
  opcional,
  unirConFieldArray,
  onBlur: onBlurHandler,
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
          disabled={deshabilitado}
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

                if (esElValorPorDefecto(valor)) {
                  return 'Este campo es obligatorio';
                }
              },
            },
            onBlur: (event) => {
              const value = event.target.value;
              onBlurHandler?.(!tipoValor || tipoValor === 'number' ? parseInt(value, 10) : value);
            },
          })}>
          <option
            value={
              !tipoValor || tipoValor === 'number'
                ? VALOR_POR_DEFECTO_EN_TIPO_NUMBER
                : VALOR_POR_DEFECTO_EN_TIPO_STRING
            }>
            {textoOpcionPorDefecto ?? 'Seleccionar'}
          </option>
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
