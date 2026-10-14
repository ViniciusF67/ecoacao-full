const express = require('express')
const controller = require('../controllers/userController')
const { requireAuth, requirePermission } = require('../middleware/auth')

const router = express.Router()

// Perfil próprio — qualquer usuário autenticado
router.get('/me', requireAuth, controller.meuPerfil)
router.put('/me', requireAuth, controller.atualizarMeuPerfil)
router.put('/me/senha', requireAuth, controller.alterarMinhaSenha)

// Administração — exige permissões específicas
router.get('/', requireAuth, requirePermission('users.read'), controller.listar)
router.get('/:id', requireAuth, requirePermission('users.read'), controller.buscarPorId)
router.put('/:id/role', requireAuth, requirePermission('role.manage'), controller.alterarRole)
router.put('/:id/status', requireAuth, requirePermission('users.update'), controller.alterarStatus)
router.delete('/:id', requireAuth, requirePermission('users.delete'), controller.excluir)

module.exports = router
