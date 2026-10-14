const { sql, getPool } = require('../config/db')

const SELECT_BASE = `
  SELECT n.id, n.titulo, n.resumo, n.conteudo, n.imagem, n.status, n.data_publicacao,
         c.id AS categoria_id, c.nome AS categoria_nome,
         u.id AS autor_id, u.nome AS autor_nome
  FROM dbo.noticias n
  JOIN dbo.categorias c ON c.id = n.categoria_id
  JOIN dbo.usuarios u ON u.id = n.autor_id
`

async function listar({ categoriaId, busca } = {}) {
  const pool = await getPool()
  const request = pool.request()
  const condicoes = ["n.status = 'publicado'"]

  if (categoriaId) {
    request.input('categoriaId', sql.Int, categoriaId)
    condicoes.push('n.categoria_id = @categoriaId')
  }
  if (busca) {
    request.input('busca', sql.NVarChar, `%${busca}%`)
    condicoes.push('(n.titulo LIKE @busca OR n.resumo LIKE @busca)')
  }

  const where = condicoes.length ? `WHERE ${condicoes.join(' AND ')}` : ''
  const result = await request.query(`${SELECT_BASE} ${where} ORDER BY n.data_publicacao DESC`)
  return result.recordset
}

async function buscarPorId(id) {
  const pool = await getPool()
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`${SELECT_BASE} WHERE n.id = @id`)
  return result.recordset[0] || null
}

async function criar({ titulo, resumo, conteudo, imagem, categoriaId, autorId }) {
  const pool = await getPool()
  const result = await pool.request()
    .input('titulo', sql.NVarChar, titulo)
    .input('resumo', sql.NVarChar, resumo)
    .input('conteudo', sql.NVarChar(sql.MAX), conteudo)
    .input('imagem', sql.NVarChar, imagem || null)
    .input('categoriaId', sql.Int, categoriaId)
    .input('autorId', sql.Int, autorId)
    .query(`
      INSERT INTO dbo.noticias (titulo, resumo, conteudo, imagem, categoria_id, autor_id)
      OUTPUT INSERTED.id
      VALUES (@titulo, @resumo, @conteudo, @imagem, @categoriaId, @autorId)
    `)
  return buscarPorId(result.recordset[0].id)
}

async function atualizar(id, { titulo, resumo, conteudo, imagem, categoriaId }) {
  const pool = await getPool()
  await pool.request()
    .input('id', sql.Int, id)
    .input('titulo', sql.NVarChar, titulo)
    .input('resumo', sql.NVarChar, resumo)
    .input('conteudo', sql.NVarChar(sql.MAX), conteudo)
    .input('imagem', sql.NVarChar, imagem || null)
    .input('categoriaId', sql.Int, categoriaId)
    .query(`
      UPDATE dbo.noticias
      SET titulo = @titulo, resumo = @resumo, conteudo = @conteudo,
          imagem = @imagem, categoria_id = @categoriaId
      WHERE id = @id
    `)
  return buscarPorId(id)
}

async function excluir(id) {
  const pool = await getPool()
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM dbo.noticias WHERE id = @id')
  return result.rowsAffected[0] > 0
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir }
