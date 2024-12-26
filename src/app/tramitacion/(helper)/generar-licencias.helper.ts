import { format } from "date-fns";
import { LicenciaTramitar } from "../(modelos)";
import exportFromJSON from "export-from-json";
import { AlertaConfirmacion, strIncluye } from "@/utilidades";
import { Empleador } from "@/modelos/empleador";



export const generarCSVLicencias = async (licencias:LicenciaTramitar[], empleador:Empleador[]) => {
    const { isConfirmed } = await AlertaConfirmacion.fire({
      html: `¿Desea exportar las licencias?`,
    });

    if (!isConfirmed) {
      return;
    }

    const data = licencias.map((licencia) => ({
      'Código Operador': licencia.operador.idoperador,
      Operador: licencia.operador.operador,
      'Folio Licencia': licencia.foliolicencia,
      'Entidad de Salud': licencia.entidadsalud.nombre,
      'Código Estado': licencia.estadolicencia.idestadolicencia,
      'Estado Licencia': licencia.estadolicencia.estadolicencia,
      'RUT Entidad Empleadora': licencia.rutempleador,
      'Entidad Empleadora': nombreEmpleador(empleador, licencia),
      'RUN persona trabajadora': licencia.runtrabajador,
      'Nombre Persona Trabajadora': `${licencia.nombres} ${licencia.apellidopaterno} ${licencia.apellidopaterno}`,
      'Tipo Reposo': licencia.tiporeposo.tiporeposo,
      'Días Reposo': licencia.diasreposo,
      'Inicio Reposo': format(new Date(licencia.fechainicioreposo), 'dd-MM-yyyy'),
      'Fecha de Emisión': format(new Date(licencia.fechaemision), 'dd-MM-yyyy'),
      'Tipo Licencia': licencia.tipolicencia.tipolicencia,
    }));

    exportFromJSON({
      data,
      fileName: `licencias_${format(Date.now(), 'dd_MM_yyyy_HH_mm_ss')}`,
      exportType: exportFromJSON.types.csv,
      delimiter: ';',
      withBOM: true,
    });
  };

  const nombreEmpleador = (empleador:Empleador[] ,licencia: LicenciaTramitar) => {
    // prettier-ignore
    return (empleador).find((e) => strIncluye(licencia.rutempleador, e.rutempleador))?.razonsocial ?? '';
  };