import { obtenerToken, runFetchAbortable, urlBackendTramitacion } from "@/servicios"
import { TipoLicencia } from "../(modelos)/tipo-licencia"


export const BuscarTipoLicencia = () => {

    return runFetchAbortable<TipoLicencia[]>(`${urlBackendTramitacion()}/tipolicencia/all`,{
        
        headers: {
            Authorization: obtenerToken(),
            'Content-Type': 'application/json',
          },
    });
}