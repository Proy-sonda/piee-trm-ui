/** El token de autenticacion decodificado */
export type UserData = {
  exp: number;
  iat: number;
  user: {
    apellidos: string;
    email: string;
    nombres: string;
    rol: {
      idrol: number;
      rol: string;
    };
    rutusuario: string;
  };
};
