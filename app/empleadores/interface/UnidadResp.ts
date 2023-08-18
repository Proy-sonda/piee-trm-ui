export interface UnidadResp {
    idunidad:         number;
    unidad:           string;
    identificador:    string;
    email:            string;
    telefono:         string;
    empleador:        Empleador;
    estadounidadrrhh: Estadounidadrrhh;
    direccionunidad:  Direccionunidad;
}

export interface Direccionunidad {
    iddireccionunidad: number;
    numero:            string;
    depto:             string;
    comuna:            Comuna;
}

export interface Comuna {
    idcomuna: string;
    nombre:   string;
    region:   Region;
}

export interface Region {
    idregion: string;
    nombre:   string;
}

export interface Empleador {
    idempleador:      number;
    rutempleador:     string;
    razonsocial:      string;
    nombrefantasia:   string;
    telefonohabitual: string;
    telefonomovil:    string;
    email:            string;
    holding:          string;
    usuarioempleador: Usuarioempleador;
}

export interface Usuarioempleador {
}

export interface Estadounidadrrhh {
    idestadounidadrrhh: number;
    descripcion:        string;
}