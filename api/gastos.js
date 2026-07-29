import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM gastos ORDER BY id DESC`;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { action, Data, Descricao, Categoria, Valor, Status } = req.body;

      if (action === 'create') {
        await sql`
          INSERT INTO gastos (data, descricao, categoria, valor, status)
          VALUES (${Data}, ${Descricao}, ${Categoria}, ${Valor}, ${Status})
        `;
        return res.status(200).json({ ok: true });
      }

      if (action === 'update') {
        await sql`
          UPDATE gastos SET status = ${Status}
          WHERE data = ${Data} AND descricao = ${Descricao}
        `;
        return res.status(200).json({ ok: true });
      }

      if (action === 'delete') {
        await sql`
          DELETE FROM gastos
          WHERE data = ${Data} AND descricao = ${Descricao}
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