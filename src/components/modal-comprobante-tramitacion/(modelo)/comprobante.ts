export interface ComprobanteTramitacion {
    foliolicencia:         string;
    rutempleador:          string;
    operador:              Operador;
    ruttrabajador:         string;
    apellidopaterno:       string;
    apellidomaterno:       string;
    nombres:               string;
    fechaemision:          string;
    fechainicioreposo:     string;
    ndias:                 number;
    fechaestado:           string;
    estadolicencia:        Estadolicencia;
    fechaterminorelacion:  string;
    otromotivonorecepcion: string;
    licenciasanteriores:   number;
    fechatramitacion:      string;
    ruttramitacion:        string;
    fechaultdiatramita:    string;
    zc1:                   Zc1;
    zc2:                   Zc2;
    zc3:                   Zc3;
    zc3rentas:             Zc3Rentas;
    zc3adjuntos:           Zc3Adjuntos;
    zc3haberes:            Zc3Haberes;
    zc4:                   Zc4;
    empleador:             Empleador;
}

export interface Empleador {
    idempleador:      number;
    rutempleador:     string;
    razonsocial:      string;
    telefonohabitual: string;
}

export interface Estadolicencia {
    idestadolicencia: number;
    estadolicencia:   string;
}

export interface Operador {
    idoperador: number;
    operador:   string;
}

export interface Zc1 {
    foliolicencia:      string;
    operador:           number;
    rutempleador:       string;
    direccion:          string;
    numero:             string;
    depto:              string;
    telefono:           string;
    fecharecepcion:     string;
    comuna:             Comuna;
    actividadlaboral:   Actividadlaboral;
    tipocalle:          Tipocalle;
    ocupacion:          Ocupacion;
    glosaotraocupacion: string;
}

export interface Actividadlaboral {
    idactividadlaboral: number;
    actividadlaboral:   string;
}

export interface Comuna {
    idcomuna: number;
    nombre:   string;
}

export interface Ocupacion {
    idocupacion: number;
    ocupacion:   string;
}

export interface Tipocalle {
    idtipocalle: number;
    tipocalle:   string;
}

export interface Zc2 {
    foliolicencia:       string;
    operador:            number;
    fecharecepcionccaf:  string;
    codigoseguroafc:     number;
    codigocontratoindef: number;
    fechaafiliacion:     string;
    fechacontrato:       string;
    nombrepagador:       string;
}

export interface Zc3 {
    foliolicencia:   string;
    operador:        number;
    porcendesahucio: string;
    montoimponible:  number;
}

export interface Zc3Adjuntos {
    codigooperador:             number;
    foliolicencia:              string;
    urladjunto:                 string;
    idadjunto:                  string;
    nombrelocal:                string;
    nombreremoto:               string;
    repositorio:                string;
    idtipoadjunto:              number;
    idpiielicenciaszc3adjuntos: number;
}

export interface Zc3Haberes {
    foliolicencia:    string;
    operador:         number;
    correlativorenta: number;
    correlativohaber: string;
    tipohaber:        string;
    montohaber:       string;
}

export interface Zc3Rentas {
    foliolicencia:    string;
    operador:         number;
    correlativorenta: number;
    tiporenta:        number;
    periodorenta:     number;
    nrodias:          number;
    montoimponible:   number;
    totalrem:         number;
    montoincapacidad: number;
    ndiasincapacidad: number;
}

export interface Zc4 {
    foliolicencia: string;
    operador:      number;
    correlativo:   number;
    lmandias:      number;
    lmafechadesde: string;
    lmafechahasta: string;
}
