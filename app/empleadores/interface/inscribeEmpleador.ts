export interface inscribeEmpleador {
    rutempleador:        string;
    razonsocial:         string;
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
    comuna: Comuna;
}

export interface Comuna {
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
