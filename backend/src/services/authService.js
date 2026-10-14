const bcrypt = require('bcrypt')
const { sql, getPool } = require('../config/db')

/** Busca um usuário completo (com hash de senha) pelo e-mail. */
async function buscarUsuarioPorEmail(email) {
  const pool = await getPool()
  const result = await pool.request()
    .input('email', sql.NVarChar, email)
    .query(`
      SELECT u.id, u.nome, u.email, u.senha_hash, u.foto, u.bio, u.status,
             u.data_cadastro, r.id AS role_id, r.nome AS role_nome
      FROM dbo.usuarios u
      JOIN dbo.roles r ON r.id = u.role_id
      WHERE u.email = @email
    `)
  return result.recordset[0] || null
}

/** Retorna a lista de chaves de permissão (ex.: "news.create") de um role. */
async function buscarPermissoesDoRole(roleId) {
  const pool = await getPool()
  const result = await pool.request()
    .input('roleId', sql.Int, roleId)
    .query(`
      SELECT p.chave
      FROM dbo.role_permissions rp
      JOIN dbo.permissions p ON p.id = rp.permission_id
      WHERE rp.role_id = @roleId
    `)
  return result.recordset.map((r) => r.chave)
}

/** Cria um novo usuário com papel padrão "usuario". Retorna o usuário criado (sem hash). */
async function criarUsuario({ nome, email, senha }) {
  const pool = await getPool()

  const existente = await pool.request()
    .input('email', sql.NVarChar, email)
    .query('SELECT id FROM dbo.usuarios WHERE email = @email')

  if (existente.recordset.length > 0) {
    const erro = new Error('Já existe uma conta com este e-mail.')
    erro.status = 409
    throw erro
  }

  const roleResult = await pool.request()
    .query("SELECT id FROM dbo.roles WHERE nome = 'usuario'")

  if (roleResult.recordset.length === 0) {
    const erro = new Error('Papel padrão "usuario" não encontrado. Rode database/seed.sql.')
    erro.status = 500
    throw erro
  }

  const roleId = roleResult.recordset[0].id
  const senhaHash = await bcrypt.hash(senha, 10)

  const insercao = await pool.request()
    .input('nome', sql.NVarChar, nome)
    .input('email', sql.NVarChar, email)
    .input('senhaHash', sql.NVarChar, senhaHash)
    .input('roleId', sql.Int, roleId)
    .query(`
      INSERT INTO dbo.usuarios (nome, email, senha_hash, role_id)
      OUTPUT INSERTED.id, INSERTED.nome, INSERTED.email, INSERTED.data_cadastro
      VALUES (@nome, @email, @senhaHash, @roleId)
    `)

  return { ...insercao.recordset[0], role: 'usuario' }
}

async function verificarSenha(senhaTextoPuro, senhaHash) {
  return bcrypt.compare(senhaTextoPuro, senhaHash)
}

module.exports = {
  buscarUsuarioPorEmail,
  buscarPermissoesDoRole,
  criarUsuario,
  verificarSenha,
}
