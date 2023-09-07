import CargaCombos from '@/helpers/adscripcion/carga-combos';
import { apiUrl } from '@/servicios/environment';
import { useEffect, useState } from 'react';

const useCombo = (url: string) => {
  let datos: any = [];

  const [data, setdata] = useState(datos);

  useEffect(() => {
    const cargaData = async () => {
      let resp = await CargaCombos(apiUrl() + url);

      setdata(resp);
    };

    cargaData();
  }, []);

  return data;
};

export default useCombo;
