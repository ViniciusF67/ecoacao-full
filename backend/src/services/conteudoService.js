const { sql, getPool } = require('../config/db')

const SELECT_BASE = `
  SELECT c.id, c.titulo, c.descricao, c.conteudo, c.imagem, c.status, c.data_publicacao,
         cat.id AS categoria_id, cat.nome AS categoria_nome,
         u.id AS autor_id, u.nome AS autor_nome
  FROM dbo.conteudos c
  JOIN dbo.categorias cat ON cat.id = c.categoria_id
  JOIN dbo.usuarios u ON u.id = c.autor_id
`

async function listar({ categoriaId, busca } = {}) {
  const pool = await getPool()
  const request = pool.request()
  const condicoes = ["c.status = 'publicado'"]

  if (categoriaId) {
    request.input('categoriaId', sql.Int, categoriaId)
    condicoes.push('c.categoria_id = @categoriaId')
  }
  if (busca) {
    request.input('busca', sql.NVarChar, `%${busca}%`)
    condicoes.push('(c.titulo LIKE @busca OR c.descricao LIKE @busca)')
  }

  const where = condicoes.length ? `WHERE ${condicoes.join(' AND ')}` : ''
  const result = await request.query(`${SELECT_BASE} ${where} ORDER BY c.data_publicacao DESC`)
  return result.recordset
}

async function buscarPorId(id) {
  const pool = await getPool()
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`${SELECT_BASE} WHERE c.id = @id`)
  return result.recordset[0] || null
}

async function criar({ titulo, descricao, conteudo, imagem, categoriaId, autorId }) {
  const pool = await getPool()
  const result = await pool.request()
    .input('titulo', sql.NVarChar, titulo)
    .input('descricao', sql.NVarChar, descricao)
    .input('conteudo', sql.NVarChar(sql.MAX), conteudo)
    .input('imagem', sql.NVarChar, imagem || null)
    .input('categoriaId', sql.Int, categoriaId)
    .input('autorId', sql.Int, autorId)
    .query(`
      INSERT INTO dbo.conteudos (titulo, descricao, conteudo, imagem, categoria_id, autor_id)
      OUTPUT INSERTED.id
      VALUES (@titulo, @descricao, @conteudo, @imagem, @categoriaId, @autorId)
    `)
  return buscarPorId(result.recordset[0].id)
}

async function atualizar(id, { titulo, descricao, conteudo, imagem, categoriaId }) {
  const pool = await getPool()
  await pool.request()
    .input('id', sql.Int, id)
    .input('titulo', sql.NVarChar, titulo)
    .input('descricao', sql.NVarChar, descricao)
    .input('conteudo', sql.NVarChar(sql.MAX), conteudo)
    .input('imagem', sql.NVarChar, imagem || null)
    .input('categoriaId', sql.Int, categoriaId)
    .query(`
      UPDATE dbo.conteudos
      SET titulo = @titulo, descricao = @descricao, conteudo = @conteudo,
          imagem = @imagem, categoria_id = @categoriaId
      WHERE id = @id
    `)
  return buscarPorId(id)
}

async function excluir(id) {
  const pool = await getPool()
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM dbo.conteudos WHERE id = @id')
  return result.rowsAffected[0] > 0
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir }
