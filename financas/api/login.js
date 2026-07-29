import { webcrypto as crypto } from 'node:crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { usuario, senha } = req.body || {};
  const USUARIO_CORRETO = process.env.AUTH_USER;
  const SENHA_CORRETA = process.env.AUTH_PASS;
  const SECRET = process.env.AUTH_SECRET;

  if (!USUARIO_CORRETO || !SENHA_CORRETA || !SECRET) {
    return res.status(500).json({ error: 'Autenticação não configurada no servidor' });
  }

  if (usuario !== USUARIO_CORRETO || senha !== SENHA_CORRETA) {
    return res.status(401).json({ error: 'Usuário ou senha inválidos' });
  }

  const exp = Date.now() + 1000 * 60 * 60 * 24 * 7;

  const encoder = new TextEncoder();
  const chave = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const bufferAssinatura = await crypto.subtle.sign('HMAC', chave, encoder.encode(String(exp)));
  const assinatura = Array.from(new Uint8Array(bufferAssinatura))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const token = `${exp}.${assinatura}`;

  res.setHeader(
    'Set-Cookie',
    `session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`
  );

  return res.status(200).json({ ok: true });
}