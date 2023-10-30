import { UnibleConFormArray } from '../base-props';
import { InputLabelHookParams, useInputLabel } from './use-input-label';
import { useManejarError } from './use-manejar-error';
import { useRandomId } from './use-random-id';

export type InputReciclableHookParams = UnibleConFormArray & {
  prefijoId: string;
  name: string;
  label: InputLabelHookParams;
};

export type InputReciclableReturn = {
  idInput: string;
  textoLabel?: string;
  tieneError: boolean;
  mensajeError?: string;
};

/**
 * Utilidad que combina los hooks para creaer un ID del input, el label y manejar los errores en un
 * solo hook.
 */
export const useInputReciclable = ({
  prefijoId,
  name,
  label,
  unirConFieldArray,
}: InputReciclableHookParams): InputReciclableReturn => {
  const idInput = useRandomId(prefijoId);

  const textoLabel = useInputLabel(label);

  const [tieneError, mensajeError] = useManejarError({ name, unirConFieldArray });

  return { idInput, textoLabel, tieneError, mensajeError };
};
