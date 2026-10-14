const { sql, getPool } = require('../config/db')

async function listar() {
  const pool = await getPool()
  const result = await pool.request().query('SELECT id, nome, descricao FROM dbo.categorias ORDER BY nome')
  return result.recordset
}

async function buscarPorId(id) {
  const pool = await getPool()
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT id, nome, descricao FROM dbo.categorias WHERE id = @id')
  return result.recordset[0] || null
}

async function criar({ nome, descricao }) {
  const pool = await getPool()
  const result = await pool.request()
    .input('nome', sql.NVarChar, nome)
    .input('descricao', sql.NVarChar, descricao || null)
    .query(`
      INSERT INTO dbo.categorias (nome, descricao)
      OUTPUT INSERTED.id, INSERTED.nome, INSERTED.descricao
      VALUES (@nome, @descricao)
    `)
  return result.recordset[0]
}

async function atualizar(id, { nome, descricao }) {
  const pool = await getPool()
  const result = await pool.request()
    .input('id', sql.Int, id)
    .input('nome', sql.NVarChar, nome)
    .input('descricao', sql.NVarChar, descricao || null)
    .query(`
      UPDATE dbo.categorias SET nome = @nome, descricao = @descricao
      OUTPUT INSERTED.id, INSERTED.nome, INSERTED.descricao
      WHERE id = @id
    `)
  return result.recordset[0] || null
}

async function excluir(id) {
  const pool = await getPool()
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM dbo.categorias WHERE id = @id')
  return result.rowsAffected[0] > 0
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir }
