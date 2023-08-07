

import { UsuarioLogin } from "@/app/contexts/interfaces/types";
import { respLogin } from "@/app/interface/adscripcion";



let respuesta:respLogin = {
    data:[],
    message:'',
    statusCode:0
}


export const LoginUsuario = async (usuario: UsuarioLogin) => {

    let resp:respLogin;


    try {
        const data = await fetch('http://10.153.106.88:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario),
        })

        resp = await data.json();
        


        return {

            resp
    
        }
        

    } catch (error) {

    }

    


}