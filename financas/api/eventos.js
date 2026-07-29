import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM eventos ORDER BY id DESC`;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { action, Evento, Cliente, Data, Hora, Status, Valor } = req.body;

      if (action === 'create') {
        await sql`
          INSERT INTO eventos (evento, cliente, data, hora, status, valor)
          VALUES (${Evento}, ${Cliente}, ${Data}, ${Hora}, ${Status}, ${Valor})
        `;
        return res.status(200).json({ ok: true });
      }

      if (action === 'update') {
        // aqui você precisa de um identificador único — recomendo trocar
        // pra usar o "id" da linha em vez de Evento+Data+Hora (veja nota abaixo)
        await sql`
          UPDATE eventos SET status = ${Status}
          WHERE evento = ${Evento} AND data = ${Data} AND hora = ${Hora}
        `;
        return res.status(200).json({ ok: true });
      }

      if (action === 'delete') {
        await sql`
          DELETE FROM eventos
          WHERE evento = ${Evento} AND data = ${Data} AND hora = ${Hora}
        `;
        return res.status(200).json({ ok: true });
      }

      return res.status(400).json({ error: 'Ação inválida' });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
}