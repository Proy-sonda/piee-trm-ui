import { UsuarioToken } from '@/modelos/usuario';
import { esTokenValido } from '@/servicios/auth';
import { NextResponse, type NextRequest } from 'next/server';

export const config = {
  matcher: ['/empleadores/:path*', '/tramitacion', '/consultas', '/licencias-tramitadas'],
};

export async function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get('token');

  // Verificar que hay cookie
  if (!tokenCookie) {
    return redirigirAlLogin(request);
  }

  // Verificar que token sea valido
  let tokenFueValidado = false;
  try {
    tokenFueValidado = await esTokenValido(tokenCookie.value);
  } catch (error) {
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
}

function redirigirAlLogin(request: NextRequest) {
  const rutaSolicitada = request.nextUrl.href.replace(request.nextUrl.origin, '');

  const searchParams = new URLSearchParams({
    redirectTo: rutaSolicitada,
  });

  return NextResponse.redirect(new URL(`/?${searchParams.toString()}`, request.url));
}
