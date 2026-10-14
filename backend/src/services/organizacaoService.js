const { sql, getPool } = require('../config/db')

const SELECT_BASE = `
  SELECT o.id, o.nome, o.descricao, o.logo, o.email, o.telefone, o.site, o.endereco, o.data_cadastro,
         c.id AS categoria_id, c.nome AS categoria_nome
  FROM dbo.organizacoes o
  JOIN dbo.categorias c ON c.id = o.categoria_id
`

async function listar({ categoriaId, busca } = {}) {
  const pool = await getPool()
  const request = pool.request()
  const condicoes = []

  if (categoriaId) {
    request.input('categoriaId', sql.Int, categoriaId)
    condicoes.push('o.categoria_id = @categoriaId')
  }
  if (busca) {
    request.input('busca', sql.NVarChar, `%${busca}%`)
    condicoes.push('(o.nome LIKE @busca OR o.descricao LIKE @busca)')
  }

  const where = condicoes.length ? `WHERE ${condicoes.join(' AND ')}` : ''
  const result = await request.query(`${SELECT_BASE} ${where} ORDER BY o.nome`)
  return result.recordset
}

async function buscarAcoes(organizacaoId) {
  const pool = await getPool()
  const result = await pool.request()
    .input('organizacaoId', sql.Int, organizacaoId)
    .query(`
      SELECT id, titulo, descricao, data_inicio, data_fim
      FROM dbo.acoes_organizacao
      WHERE organizacao_id = @organizacaoId
      ORDER BY data_inicio DESC
    `)
  return result.recordset
}

async function buscarPorId(id) {
  const pool = await getPool()
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`${SELECT_BASE} WHERE o.id = @id`)
  const organizacao = result.recordset[0]
  if (!organizacao) return null

  organizacao.acoes = await buscarAcoes(id)
  return organizacao
}

async function criar({ nome, descricao, logo, categoriaId, email, telefone, site, endereco, criadoPor }) {
  const pool = await getPool()
  const result = await pool.request()
    .input('nome', sql.NVarChar, nome)
    .input('descricao', sql.NVarChar, descricao)
    .input('logo', sql.NVarChar, logo || null)
    .input('categoriaId', sql.Int, categoriaId)
    .input('email', sql.NVarChar, email || null)
    .input('telefone', sql.NVarChar, telefone || null)
    .input('site', sql.NVarChar, site || null)
    .input('endereco', sql.NVarChar, endereco || null)
    .input('criadoPor', sql.Int, criadoPor)
    .query(`
      INSERT INTO dbo.organizacoes (nome, descricao, logo, categoria_id, email, telefone, site, endereco, criado_por)
      OUTPUT INSERTED.id
      VALUES (@nome, @descricao, @logo, @categoriaId, @email, @telefone, @site, @endereco, @criadoPor)
    `)
  return buscarPorId(result.recordset[0].id)
}

async function atualizar(id, { nome, descricao, logo, categoriaId, email, telefone, site, endereco }) {
  const pool = await getPool()
  await pool.request()
    .input('id', sql.Int, id)
    .input('nome', sql.NVarChar, nome)
    .input('descricao', sql.NVarChar, descricao)
    .input('logo', sql.NVarChar, logo || null)
    .input('categoriaId', sql.Int, categoriaId)
    .input('email', sql.NVarChar, email || null)
    .input('telefone', sql.NVarChar, telefone || null)
    .input('site', sql.NVarChar, site || null)
    .input('endereco', sql.NVarChar, endereco || null)
    .query(`
      UPDATE dbo.organizacoes
      SET nome = @nome, descricao = @descricao, logo = @logo, categoria_id = @categoriaId,
          email = @email, telefone = @telefone, site = @site, endereco = @endereco
      WHERE id = @id
    `)
  return buscarPorId(id)
}

async function excluir(id) {
  const pool = await getPool()
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM dbo.organizacoes WHERE id = @id')
  return result.rowsAffected[0] > 0
}

async function adicionarAcao(organizacaoId, { titulo, descricao, dataInicio, dataFim }) {
  const pool = await getPool()
  const result = await pool.request()
    .input('organizacaoId', sql.Int, organizacaoId)
    .input('titulo', sql.NVarChar, titulo)
    .input('descricao', sql.NVarChar, descricao)
    .input('dataInicio', sql.Date, dataInicio || null)
    .input('dataFim', sql.Date, dataFim || null)
    .query(`
      INSERT INTO dbo.acoes_organizacao (organizacao_id, titulo, descricao, data_inicio, data_fim)
      OUTPUT INSERTED.id, INSERTED.titulo, INSERTED.descricao, INSERTED.data_inicio, INSERTED.data_fim
      VALUES (@organizacaoId, @titulo, @descricao, @dataInicio, @dataFim)
    `)
  return result.recordset[0]
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir, adicionarAcao }
