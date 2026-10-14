const express = require('express')
const { getPool } = require('../config/db')
const { requireAuth, requirePermission } = require('../middleware/auth')

const router = express.Router()

/** GET /api/admin/roles — lista os papéis existentes (para dropdowns no painel admin). */
router.get('/roles', requireAuth, requirePermission('role.manage'), async (req, res, next) => {
  try {
    const pool = await getPool()
    const result = await pool.request().query('SELECT id, nome, descricao FROM dbo.roles ORDER BY id')
    res.json(result.recordset)
  } catch (err) { next(err) }
})

/** GET /api/admin/permissions — lista todas as permissões e quais roles as possuem. */
router.get('/permissions', requireAuth, requirePermission('role.manage'), async (req, res, next) => {
  try {
    const pool = await getPool()
    const result = await pool.request().query(`
      SELECT p.chave, p.descricao, r.nome AS role
      FROM dbo.role_permissions rp
      JOIN dbo.permissions p ON p.id = rp.permission_id
      JOIN dbo.roles r ON r.id = rp.role_id
      ORDER BY p.chave, r.id
    `)
    res.json(result.recordset)
  } catch (err) { next(err) }
})

/** GET /api/admin/resumo — números gerais para o dashboard do painel administrativo. */
router.get('/resumo', requireAuth, requirePermission('admin.access'), async (req, res, next) => {
  try {
    const pool = await getPool()
    const result = await pool.request().query(`
      SELECT
        (SELECT COUNT(*) FROM dbo.usuarios) AS totalUsuarios,
        (SELECT COUNT(*) FROM dbo.noticias) AS totalNoticias,
        (SELECT COUNT(*) FROM dbo.conteudos) AS totalConteudos,
        (SELECT COUNT(*) FROM dbo.quizzes) AS totalQuizzes,
        (SELECT COUNT(*) FROM dbo.desafios) AS totalDesafios,
        (SELECT COUNT(*) FROM dbo.organizacoes) AS totalOrganizacoes
    `)
    res.json(result.recordset[0])
  } catch (err) { next(err) }
})

module.exports = router
