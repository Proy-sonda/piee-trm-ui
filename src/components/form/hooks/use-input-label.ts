import { useEffect, useState } from 'react';

export type InputLabelHookParams = {
  texto?: string;
  opcional?: boolean;
  omitirSignoObligatorio?: boolean;
};

export const useInputLabel = ({
  texto,
  opcional,
  omitirSignoObligatorio,
}: InputLabelHookParams) => {
  const [labelFinal, setLabelFinal] = useState<string | undefined>();

  useEffect(() => {
    if (texto === undefined) {
      setLabelFinal(undefined);
      return;
    }

    if (omitirSignoObligatorio) {
      setLabelFinal(texto);
      return;
    }

    setLabelFinal(opcional ? `${texto}` : `${texto} (*)`);
  }, [texto, opcional, omitirSignoObligatorio]);

  return labelFinal;
};
