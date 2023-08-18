import Swal from "sweetalert2";
import { parseCookies } from 'nookies';
import { inscribeEmpleador } from "@/app/empleadores/interface/inscribeEmpleador";
import { ActualizaEmpleador } from "@/app/interface/tramitacion";
import { CrearUnidad } from "@/app/empleadores/interface/crearUnidad";
import { UpdateUnidad } from "@/app/empleadores/interface/UpdateUnidad";
let cookie = parseCookies();
let token = cookie.token;

const api_url= process.env.NEXT_PUBLIC_API_URL;


export const CargaEmpleadores = async (razon = "") => {

  const data = await fetch(`${api_url}empleador/razonsocial`, {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "razonsocial": razon
    }),

  });
  const resp = await data.json();
  return resp;
}

export const Desadscribir = async (rut: string) => {

  let data: Response;
  data = await fetch(`${api_url}empleador/desuscribir`, {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "rutempleador": rut
    })
  })
  return data;
}


export const ComboEntidadEmpleador = async () => {

  const data = await fetch(`${api_url}empleador/rutusuario`, {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-type': 'application/json'
    },
  });
  let resp = await data.json();
  return resp;
}

export const cargaUnidadrrhh = async (rutempleador: string) => {

  const data = await fetch(`${api_url}unidad/rutempleador`, {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      rutempleador: rutempleador
    })

  });
  let resp = await data.json();
  return resp;
}

export const InscribirEmpleador = async (empleador: inscribeEmpleador) => {

  const data = await fetch(`${api_url}empleador/inscribir`, {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-type': 'application/json'
    },
    body: JSON.stringify(empleador)
  });
  return data;
}

export const EliminarUnidad = async (idunidad: number) => {

  const data = await fetch(`${api_url}unidad/idunidad`, {
    method: 'DELETE',
    headers: {
      'Authorization': token,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      idunidad: idunidad
    })
  });
  return data;
}

export const datoEmpresa = async (rutempleador: string) => {
  const data = await fetch(`${api_url}empleador/rutempleador`, {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      rutempleador: rutempleador
    })
  })
  return data;
}

export const actualizaEmpleador = async (empleador: ActualizaEmpleador) => {
  const data = await fetch(`${api_url}empleador/actualizar`, {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-type': 'application/json'
    },
    body: JSON.stringify(empleador)
  })
  return data;
}

export const crearUnidad = async (unidad:CrearUnidad)=> {
  const data = await fetch(`${api_url}unidad/create`,{
    method:'POST',
    headers: {
      'Authorization': token,
      'Content-type': 'application/json'
    },
    body: JSON.stringify(unidad)
  });
  return data;
}

export const getDatoUnidad = async (idunidad:number)=> {

  const data = await fetch(`${api_url}unidad/idunidad`,{
    method:'POST',
    headers: {
      'Authorization': token,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      idunidad: idunidad
    })
  });
  return data;
}

export const putDatoUnidad = async(unidad:UpdateUnidad) => {

  const data = await fetch(`${api_url}unidad/update`,{
    method:'PUT',
    headers: {
      'Authorization': token,
      'Content-type': 'application/json'
    },
    body: JSON.stringify(unidad)
  });
  return data;
}

export const renovacionToken = async()=> {

  const data = await fetch(`${api_url}auth/refresh`,{
    headers: {
      'Authorization': token,
      'Content-type': 'application/json'
    },
  })
  return data;
}