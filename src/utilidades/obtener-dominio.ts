import isIp from 'validator/lib/isIP';

export const obtenerDominio = (location: Location) => {
  if (location.hostname === 'localhost' || isIp(location.hostname)) {
    return location.hostname;
  }

  const hostnameDividido = location.hostname.split('.');
  const extension = hostnameDividido.pop();
  const hostname = hostnameDividido.pop();

  return `${hostname}.${extension}`;
};
