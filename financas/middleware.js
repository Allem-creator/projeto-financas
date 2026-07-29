// Middleware da Vercel: roda antes de qualquer página ou API ser servida.
// Verifica se existe um cookie de sessão válido; se não, redireciona pro login.

export const config = {
  matcher: ['/((?!api/login|api/logout|login.html|favicon.ico).*)'],
};

async function verificarToken(token, secret) {
  if (!token || !secret) return false;
  const partes = token.split('.');
  if (partes.length !== 2) return false;
  const [expStr, assinatura] = partes;

  const exp = parseInt(expStr, 10);
  if (isNaN(exp) || Date.now() > exp) return false;

  const encoder = new TextEncoder();
  const chave = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const bufferAssinatura = await crypto.subtle.sign('HMAC', chave, encoder.encode(expStr));
  const assinaturaCalculada = Array.from(new Uint8Array(bufferAssinatura))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return assinaturaCalculada === assinatura;
}

export default async function middleware(request) {
  const secret = process.env.AUTH_SECRET;
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/session=([^;]+)/);
  const token = match ? decodeURIComponent(match[1]) : null;

  const valido = await verificarToken(token, secret);

  if (!valido) {
    const loginUrl = new URL('/login.html', request.url);
    return Response.redirect(loginUrl, 302);
  }
}