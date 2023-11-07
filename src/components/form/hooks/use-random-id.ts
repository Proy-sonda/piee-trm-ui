import { useEffect, useState } from 'react';

export const useRandomId = (inputName: string) => {
  const [idInput, setIdInput] = useState(inputName);

  useEffect(() => {
    setIdInput(`${inputName}_${Math.round(Math.random() * 1_000_000)}`);
  }, []);

  return idInput;
};
