export interface UpdateUnidad {
    idunidad:         number | undefined;
    unidad:           string;
    identificador:    string;
    email:            string;
    telefono:         string;
    direccionunidad:  Direccionunidad;
    estadounidadrrhh: Estadounidadrrhh;
    empleador:        Empleador;
}

export interface Direccionunidad {
    calle:  string;
    numero: string;
    depto:  string;
    comuna: Comuna;
}

export interface Comuna {
    idcomuna: string;
    nombre:   string;
}

export interface Empleador {
    idempleador: number;
}

export interface Estadounidadrrhh {
    idestadounidadrrhh: number;
    descripcion:        string;
}