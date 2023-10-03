import { useRandomId } from '@/hooks/use-random-id';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { BaseProps } from './base-props';

interface ComboSimpleProps<T> extends BaseProps {
  /** Datos para rellenar el combo */
  datos?: T[];

  /**
   * Propiedad de un elemento de los datos para usar en las propiedades `key` y `value` del tag
   * `<option>`.
   */
  idElemento: keyof T;

  /** Propiedad de un elemento de los datos para usar como texto de tag `<option />` */
  descripcion: keyof T;

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
 * El valor en caso de ser opcional es un string vacío cuando el combo es tipo `string` o `isNan`
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
}: ComboSimpleProps<T>) => {
  const idInput = useRandomId('combo');

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        <Form.Label>{`${label}${!opcional ? ' (*)' : ''}`}</Form.Label>

        <Form.Select
          autoComplete="new-custom-value"
          isInvalid={!!errors[name]}
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
            <option key={dato[idElemento] as any} value={dato[idElemento] as any}>
              {dato[descripcion] as any}
            </option>
          ))}
        </Form.Select>

        <Form.Control.Feedback type="invalid" tooltip>
          {errors[name]?.message?.toString()}
        </Form.Control.Feedback>
      </FormGroup>
    </>
  );
};
