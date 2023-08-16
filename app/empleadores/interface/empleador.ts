export interface Empleador {
    idempleador:         number;
    rutempleador:        string;
    razonsocial:         string;
    nombrefantasia:      string;
    estadoempleador:     Estadoempleador;
    ccaf:                Ccaf;
    tipoempleador:       Tipoempleador;
    sistemaremuneracion: Sistemaremuneracion;
    direccionempleador:  Direccionempleador;
    actividadlaboral:    Actividadlaboral;
    tamanoempresa:       Tamanoempresa;
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
    iddireccionempleador: number;
    calle:                string;
    numero:               string;
    depto:                string;
    comuna:               Comuna;
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

export interface Estadoempleador {
    idestadoempleador: number;
    estadoempleador:   string;
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
