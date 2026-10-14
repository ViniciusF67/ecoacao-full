const { sql, getPool } = require('../config/db')

async function listar() {
  const pool = await getPool()
  const result = await pool.request().query(`
    SELECT u.id, u.nome, u.email, u.foto, u.status, u.data_cadastro, r.nome AS role
    FROM dbo.usuarios u
    JOIN dbo.roles r ON r.id = u.role_id
    ORDER BY u.data_cadastro DESC
  `)
  return result.recordset
}

async function buscarPorId(id) {
  const pool = await getPool()
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT u.id, u.nome, u.email, u.foto, u.bio, u.status, u.data_cadastro, r.nome AS role
      FROM dbo.usuarios u
      JOIN dbo.roles r ON r.id = u.role_id
      WHERE u.id = @id
    `)
  return result.recordset[0] || null
}

/** Atualiza os próprios dados (nome, foto, bio) — nunca role ou status aqui. */
async function atualizarPerfilProprio(id, { nome, foto, bio }) {
  const pool = await getPool()
  await pool.request()
    .input('id', sql.Int, id)
    .input('nome', sql.NVarChar, nome)
    .input('foto', sql.NVarChar, foto || null)
    .input('bio', sql.NVarChar, bio || null)
    .query(`
      UPDATE dbo.usuarios SET nome = @nome, foto = @foto, bio = @bio
      WHERE id = @id
    `)
  return buscarPorId(id)
}

async function atualizarSenhaPropria(id, novaSenhaHash) {
  const pool = await getPool()
  await pool.request()
    .input('id', sql.Int, id)
    .input('senhaHash', sql.NVarChar, novaSenhaHash)
    .query('UPDATE dbo.usuarios SET senha_hash = @senhaHash WHERE id = @id')
}

async function buscarSenhaHash(id) {
  const pool = await getPool()
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT senha_hash FROM dbo.usuarios WHERE id = @id')
  return result.recordset[0]?.senha_hash || null
}

/** Admin: altera o papel (role) de um usuário. */
async function alterarRole(id, roleNome) {
  const pool = await getPool()
  const roleResult = await pool.request()
    .input('roleNome', sql.NVarChar, roleNome)
    .query('SELECT id FROM dbo.roles WHERE nome = @roleNome')

  if (roleResult.recordset.length === 0) {
    const erro = new Error(`Papel "${roleNome}" não existe.`)
    erro.status = 400
    throw erro
  }

  await pool.request()
    .input('id', sql.Int, id)
    .input('roleId', sql.Int, roleResult.recordset[0].id)
    .query('UPDATE dbo.usuarios SET role_id = @roleId WHERE id = @id')

  return buscarPorId(id)
}

/** Admin: ativa/desativa/bane um usuário. */
async function alterarStatus(id, status) {
  const pool = await getPool()
  await pool.request()
    .input('id', sql.Int, id)
    .input('status', sql.NVarChar, status)
    .query('UPDATE dbo.usuarios SET status = @status WHERE id = @id')
  return buscarPorId(id)
}

async function excluir(id) {
  const pool = await getPool()
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM dbo.usuarios WHERE id = @id')
  return result.rowsAffected[0] > 0
}

module.exports = {
  listar, buscarPorId, atualizarPerfilProprio, atualizarSenhaPropria,
  buscarSenhaHash, alterarRole, alterarStatus, excluir,
}
