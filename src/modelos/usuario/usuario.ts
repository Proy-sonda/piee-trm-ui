import { MapaRolesUsuario, RolUsuario } from './mapa-roles-usuario';
import { TokenAutenticacion } from './token-autenticacion';

export class Usuario {
  private constructor(private token: TokenAutenticacion) {}

  static fromToken(token: TokenAutenticacion) {
    return new Usuario(token);
  }

  get exp() {
    return this.token.exp;
  }

  get iat() {
    return this.token.iat;
  }

  get user() {
    return this.token.user;
  }

  nombreCompleto() {
    return `${this.token.user.nombres}  ${this.token.user.apellidos}`;
  }

  tieneRol(rol: RolUsuario): boolean {
    return MapaRolesUsuario[rol] === this.token.user.rol.idrol;
  }

  /** Retorna `true` si el usuario tiene al menos uno de los roles indicados. */
  tieneRoles(roles: RolUsuario[]): boolean {
    return roles.some((rol) => this.tieneRol(rol));
  }
}
