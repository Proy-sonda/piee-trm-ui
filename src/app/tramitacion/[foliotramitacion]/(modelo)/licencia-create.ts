export interface LicenciaCreate {
  licencia: {
    foliolicencia: string;
    operador: {
      idoperador: number;
      operador: string;
    };
    ruttrabajador: string;
    fechaemision: string;
    ndias: number;
    tipolicencia: {
      idtipolicencia: number;
      tipolicencia: string;
    };
    estadolicencia?: {
      idestadolicencia: number;
      estadolicencia: string;
    };
    motivodevolucion: {
      idmotivodevolucion: number;
      motivodevolucion: string;
    };
    estadotramitacion: {
      idestadotramitacion: number;
      estadotramitacion: string;
    };
  };
  licenciazc1: {
    foliolicencia: string;
    operador: {
      idoperador: number;
      operador: string;
    };
    rutempleador: string;
    direccion: string;
    numero: string;
    depto: string;
    telefono: string;
    comuna: {
      idcomuna: string;
      nombre: string;
    };
    tipocalle: {
      idtipocalle: number;
      tipocalle: string;
    };
    ocupacion: {
      idocupacion: number;
      ocupacion: string;
    };
    actividadlaboral: {
      idactividadlaboral: number;
      actividadlaboral: string;
    };
  };
  licenciazc2: {
    foliolicencia: string;
    operador: {
      idoperador: number;
      operador: string;
    };
    fecharecepcionccaf: string;
    codigoletracaja: string;
    codigoseguroafc: number;
    codigocontratoindef: number;
    fechaafiliacion: string;
    fechacontrato: string;
    nombrepagador: string;
    regimenprevisional: {
      idregimenprevisional: number;
      regimenprevisional: string;
    };
    prevision: {
      idprevision: number;
      prevision: string;
      descripcion: string;
    };
    calidadtrabajador: {
      idcalidadtrabajador: number;
      calidadtrabajador: string;
    };
    entidadpagadora: {
      identidadpagadora: number;
      entidadpagadora: string;
    };
  };
}
