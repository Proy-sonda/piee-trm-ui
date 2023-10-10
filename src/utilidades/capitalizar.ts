/**
 * Convierte la primera letra del string a mayúscula y deja el resto en minúscula
 */
export const capitalizar = (str: string) => {
  if (str === '') {
    return '';
  }

  return str[0].toUpperCase() + str.substring(1).toLowerCase();
};
