const { sql, getPool } = require('../config/db')

const SELECT_BASE = `
  SELECT d.id, d.titulo, d.descricao, d.instrucoes, d.imagem, d.dificuldade, d.status, d.data_criacao,
         c.id AS categoria_id, c.nome AS categoria_nome
  FROM dbo.desafios d
  JOIN dbo.categorias c ON c.id = d.categoria_id
`

async function listar({ categoriaId, dificuldade } = {}) {
  const pool = await getPool()
  const request = pool.request()
  const condicoes = ["d.status = 'publicado'"]

  if (categoriaId) {
    request.input('categoriaId', sql.Int, categoriaId)
    condicoes.push('d.categoria_id = @categoriaId')
  }
  if (dificuldade) {
    request.input('dificuldade', sql.NVarChar, dificuldade)
    condicoes.push('d.dificuldade = @dificuldade')
  }

  const where = `WHERE ${condicoes.join(' AND ')}`
  const result = await request.query(`${SELECT_BASE} ${where} ORDER BY d.data_criacao DESC`)
  return result.recordset
}

async function buscarPorId(id) {
  const pool = await getPool()
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`${SELECT_BASE} WHERE d.id = @id`)
  return result.recordset[0] || null
}

async function criar({ titulo, descricao, instrucoes, imagem, categoriaId, dificuldade, autorId }) {
  const pool = await getPool()
  const result = await pool.request()
    .input('titulo', sql.NVarChar, titulo)
    .input('descricao', sql.NVarChar, descricao)
    .input('instrucoes', sql.NVarChar(sql.MAX), instrucoes)
    .input('imagem', sql.NVarChar, imagem || null)
    .input('categoriaId', sql.Int, categoriaId)
    .input('dificuldade', sql.NVarChar, dificuldade || 'Fácil')
    .input('autorId', sql.Int, autorId)
    .query(`
      INSERT INTO dbo.desafios (titulo, descricao, instrucoes, imagem, categoria_id, dificuldade, autor_id)
      OUTPUT INSERTED.id
      VALUES (@titulo, @descricao, @instrucoes, @imagem, @categoriaId, @dificuldade, @autorId)
    `)
  return buscarPorId(result.recordset[0].id)
}

async function atualizar(id, { titulo, descricao, instrucoes, imagem, categoriaId, dificuldade }) {
  const pool = await getPool()
  await pool.request()
    .input('id', sql.Int, id)
    .input('titulo', sql.NVarChar, titulo)
    .input('descricao', sql.NVarChar, descricao)
    .input('instrucoes', sql.NVarChar(sql.MAX), instrucoes)
    .input('imagem', sql.NVarChar, imagem || null)
    .input('categoriaId', sql.Int, categoriaId)
    .input('dificuldade', sql.NVarChar, dificuldade)
    .query(`
      UPDATE dbo.desafios
      SET titulo = @titulo, descricao = @descricao, instrucoes = @instrucoes,
          imagem = @imagem, categoria_id = @categoriaId, dificuldade = @dificuldade
      WHERE id = @id
    `)
  return buscarPorId(id)
}

async function excluir(id) {
  const pool = await getPool()
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM dbo.desafios WHERE id = @id')
  return result.rowsAffected[0] > 0
}

/* ---------- Participação ---------- */

async function buscarParticipacao(usuarioId, desafioId) {
  const pool = await getPool()
  const result = await pool.request()
    .input('usuarioId', sql.Int, usuarioId)
    .input('desafioId', sql.Int, desafioId)
    .query(`
      SELECT id, status, data_inicio, data_conclusao
      FROM dbo.participacoes_desafio
      WHERE usuario_id = @usuarioId AND desafio_id = @desafioId
    `)
  return result.recordset[0] || null
}

async function participar(usuarioId, desafioId) {
  const existente = await buscarParticipacao(usuarioId, desafioId)
  if (existente) return existente

  const pool = await getPool()
  const result = await pool.request()
    .input('usuarioId', sql.Int, usuarioId)
    .input('desafioId', sql.Int, desafioId)
    .query(`
      INSERT INTO dbo.participacoes_desafio (usuario_id, desafio_id, status)
      OUTPUT INSERTED.id, INSERTED.status, INSERTED.data_inicio, INSERTED.data_conclusao
      VALUES (@usuarioId, @desafioId, 'em_andamento')
    `)
  return result.recordset[0]
}

async function concluir(usuarioId, desafioId) {
  const pool = await getPool()
  const result = await pool.request()
    .input('usuarioId', sql.Int, usuarioId)
    .input('desafioId', sql.Int, desafioId)
    .query(`
      UPDATE dbo.participacoes_desafio
      SET status = 'concluido', data_conclusao = SYSUTCDATETIME()
      OUTPUT INSERTED.id, INSERTED.status, INSERTED.data_inicio, INSERTED.data_conclusao
      WHERE usuario_id = @usuarioId AND desafio_id = @desafioId
    `)
  return result.recordset[0] || null
}

module.exports = {
  listar, buscarPorId, criar, atualizar, excluir,
  buscarParticipacao, participar, concluir,
}
