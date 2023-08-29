const CargaCombos = async (path: string) => {
  const consulta = await fetch(path);
  const data = await consulta.json();

  return data;
};

export default CargaCombos;
