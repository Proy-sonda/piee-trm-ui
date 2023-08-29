import CargaCombos from '@/helpers/adscripcion/carga-combos';
import { useEffect, useState } from 'react';

const useCombo = (url: string) => {
  let datos: any = [];

  const [data, setdata] = useState(datos);

  useEffect(() => {
    const cargaData = async () => {
      let resp = await CargaCombos('http://10.153.106.88:3000' + url);

      setdata(resp);
    };

    cargaData();
  }, []);

  return data;
};

export default useCombo;
