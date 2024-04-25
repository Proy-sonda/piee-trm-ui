import { useEffect, useState } from 'react';

type UrlProps = {
  /** Toda la url sin la parte del protocolo, host y puerto. Incluye `/` inicial. */
  fullPath: string;
};

export const useUrl = () => {
  const [url, setUrl] = useState<UrlProps>({
    fullPath: '',
  });

  useEffect(() => {
    setUrl({
      fullPath: window.location.href.replace(window.location.origin, ''),
    });
  }, []);

  return url;
};
