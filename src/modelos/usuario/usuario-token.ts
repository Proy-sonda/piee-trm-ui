import jwt_decode from 'jwt-decode';
import { TokenAutenticacion } from './token-autenticacion';

export class UsuarioToken {
  private constructor(private tokenAuth: TokenAutenticacion) {}
  static fromToken(token: string) {
    return new UsuarioToken(jwt_decode<TokenAutenticacion>(token));
  }

  get rut() {
    return this.tokenAuth.user.rutusuario;
  }

  get nombres() {
    return this.tokenAuth.user.nombres;
  }

  get apellidos() {
    return this.tokenAuth.user.apellidos;
  }

  nombreCompleto(): string {
    return `${this.nombres}  ${this.apellidos}`;
  }

  get ultimaconexion() {
    return this.tokenAuth.user.ultimaconexion;
  }

  get rutsuper() {
    return this.tokenAuth.user.rutsuper;
  }

  /**
   * @returns
   * Por cuantos segundos es valido el token, desde la emisión de este;
   */
  vigenciaToken(): number {
    return this.tokenAuth.exp - this.tokenAuth.iat;
  }

  /**
   * @returns
   * Cuanto tiempo (en milisegundos) desde este instante le queda de vigencia al token.
   */
  tiempoRestanteDeSesion(): number {
    /* Nota: El punto de referencia tiene que ser Date.now() y no datosUsuario.iat para que al
     * ingresar por URL despues de creada la sesion muestre la alerta antes de que venza la
     * sesion, es posible que muestre la alerta una vez que la sesion haya vencido y la cookie
     * eliminada del navegador. */
    return this.tokenAuth.exp * 1000 - Date.now();
  }

  iniciales(): string {
    const nombres = this.nombres.trim();
    const apellidos = this.apellidos.trim();

    const inicialNombre = nombres === '' ? '' : nombres[0].toUpperCase();
    const inicialApellido = apellidos === '' ? '' : apellidos[0].toUpperCase();

    return inicialNombre + inicialApellido;
  }
}
