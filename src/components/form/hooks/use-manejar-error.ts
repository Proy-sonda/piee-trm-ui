import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { UnibleConFormArray } from '..';

export type ManejarErrorHookParams = { name: string } & UnibleConFormArray;

export const useManejarError = ({
  name,
  unirConFieldArray,
}: ManejarErrorHookParams): [boolean, string | undefined] => {
  const {
    formState: { errors },
  } = useFormContext();

  const [tieneError, setTieneError] = useState(false);
  const [mensajeDeError, setMensajeDeError] = useState<string | undefined>();

  useEffect(() => {
    if (!unirConFieldArray) {
      setTieneError(!!errors[name]);
      setMensajeDeError(errors[name]?.message?.toString());
      return;
    }

    const { fieldArrayName, index, campo } = unirConFieldArray;

    setTieneError(!!(errors[fieldArrayName] as any)?.at?.(index)?.[campo]);
    setMensajeDeError((errors[fieldArrayName] as any)?.at?.(index)?.[campo]?.message?.toString());
  }, [errors[unirConFieldArray ? unirConFieldArray.fieldArrayName : name]]);

  return [tieneError, mensajeDeError];
};
