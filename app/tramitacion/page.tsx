'use client'

import { LoginComponent } from "../components/login/LoginComponent";
import jwt_decode from "jwt-decode";
import { useEffect, useContext } from 'react';
import { parseCookies } from 'nookies';
import { CompruebaToken } from "../helpers/adscripcion/LoginUsuario";
import Position from "../components/stage/Position";
import { AuthContext } from "../contexts";



const TramitacionPage = () => {

  const { CompletarUsuario } = useContext(AuthContext);

  let cookie = parseCookies();
  let token='';
  token = cookie.token;
  
  if(token == undefined) return <LoginComponent buttonText="Ingresar"/>
  
  token = token.replaceAll('Bearer ', '');
  let data: any = jwt_decode(token);
  
  CompruebaToken(token);
 
  

  return (
    <div className="bgads">

      <Position position={1}/>

    </div>
  )
}



export default TramitacionPage;
