import { obtenerToken, runFetchConThrow, urlBackendTramitacion } from "@/servicios";


export const buscarCCAFwebservices = async (rutpersona:string) => {
    const rutsinDV = rutpersona.substring(0, rutpersona.length - 1).replaceAll('-','');
    const DV= rutpersona.substring(rutpersona.length - 1, rutpersona.length);
    
    return await runFetchConThrow<number>(`${urlBackendTramitacion()}/licencia/obtenerccafwebservices`,{
        method: 'POST',
        headers: {
            Authorization: obtenerToken(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ruttrabajador: rutsinDV,
            DV: DV
        })
    })


}