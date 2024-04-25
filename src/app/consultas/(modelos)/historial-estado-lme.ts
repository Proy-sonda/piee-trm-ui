export interface HistorialEstadoLME {
  foliolicencia: string;
  operador: Operador;
  listaestados: ListaEstado[];
}

interface ListaEstado {
  fechaevento: string;
  idestadolicencia: number;
  estadolicencia: string;
}

interface Operador {
  idoperador: number;
  operador: string;
}
