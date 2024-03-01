export type TokenAutenticacion = {
  exp: number;
  iat: number;
  user: {
    apellidos: string;
    nombres: string;
    rutusuario: string;
    ultimaconexion: string;
    rutsuper: string;
  };
};
