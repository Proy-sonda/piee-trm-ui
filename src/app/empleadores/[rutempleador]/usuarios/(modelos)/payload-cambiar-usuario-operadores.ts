export interface PayloadCambiarUsuarioOperadores {
  RunUsuario: string;
  usuario: {
    /**
     * - `1`: Crear
     * - `2`: Modificar
     * - `3`: Eliminar
     * - `4`: Cambio de Clave
     */
    accion: 1 | 2 | 3 | 4;
    rutempleador: string;
    runusuario: string;
    apellidosusuario: string;
    nombresusuario: string;
    rolusuario: number;
    telefono: string;
    telefonomovil: string;
    correoelectronicousuario: string;
  };
}
