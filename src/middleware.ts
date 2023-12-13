import { NextResponse, type NextRequest } from 'next/server';
import { LicenciaC0 } from './app/tramitacion/[foliolicencia]/[idoperador]/c1/(modelos)';
import { urlBackendTramitacion } from './servicios';

export const config = {
  matcher: ['/empleadores/:path*', '/tramitacion/:path*', '/consultas', '/licencias-tramitadas'],
};

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/tramitacion/')) {
    const tokenCookie = request.cookies.get('token');

    const licencia = request.nextUrl.pathname.split('/')[2];
    const idoperador: number = Number(request.nextUrl.pathname.split('/')[3]);

    const resp = await fetch(`${urlBackendTramitacion()}/licencia/zona0/operadorfolio`, {
      method: 'POST',
      headers: {
        Authorization: tokenCookie!?.value,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        foliolicencia: licencia,
        idoperador: idoperador,
      }),
    });
    const zona0: LicenciaC0 = await resp.json();

    if (zona0.estadolicencia.idestadolicencia !== 1)
      return NextResponse.rewrite(new URL(`/tramitacion/error`, request.url));
  }

  /*const tokenCookie = request.cookies.get('token');

  // Verificar que hay cookie
  if (!tokenCookie) {
    return redirigirAlLogin(request);
  }
  console.log(tokenCookie);
  
  // Verificar que token sea valido
  let tokenFueValidado = false;
  try {
    tokenFueValidado = await esTokenValido(tokenCookie.value);
    console.log(tokenFueValidado);
    console.log("OK");
  } catch (error) {
    console.log("NO");
    tokenFueValidado = false;
  }

  if (!tokenFueValidado) {
    return redirigirAlLogin(request);
  }

  // Verificar que tenga permisos
  const usuario = UsuarioToken.fromToken(tokenCookie.value);

  if (!usuario.tieneRol('admin') && request.nextUrl.pathname.startsWith('/empleadores')) {
    return NextResponse.rewrite(new URL(`/errores/403`, request.url));
  }

  // OK
  return NextResponse.next();
  */
}

function redirigirAlLogin(request: NextRequest) {
  const rutaSolicitada = request.nextUrl.href.replace(request.nextUrl.origin, '');

  const searchParams = new URLSearchParams({
    redirectTo: rutaSolicitada,
  });

  return NextResponse.redirect(new URL(`/?${searchParams.toString()}`, request.url));
}
