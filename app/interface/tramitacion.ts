export interface Unidadrhh {
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

export interface ActualizaEmpleador {
    idempleador:         number;
    rutempleador:        string;
    razonsocial:         string;
    nombrefantasia:      string;
    telefonohabitual:    string;
    telefonomovil:       string;
    email:               string;
    emailconfirma:       string;
    tipoempleador:       Tipoempleador;
    ccaf:                Ccaf;
    actividadlaboral:    Actividadlaboral;
    tamanoempresa:       Tamanoempresa;
    sistemaremuneracion: Sistemaremuneracion;
    direccionempleador:  Direccionempleador;
}

export interface Actividadlaboral {
    idactividadlaboral: number;
    actividadlaboral:   string;
}

export interface Ccaf {
    idccaf: number;
    nombre: string;
}

export interface Direccionempleador {
    calle:  string;
    numero: string;
    depto:  string;
    comuna: Comuna2;
}

export interface Comuna2 {
    idcomuna: string;
    nombre:   string;
}

export interface Sistemaremuneracion {
    idsistemaremuneracion: number;
    descripcion:           string;
}

export interface Tamanoempresa {
    idtamanoempresa: number;
    nrotrabajadores: number;
    descripcion:     string;
}

export interface Tipoempleador {
    idtipoempleador: number;
    tipoempleador:   string;
}
