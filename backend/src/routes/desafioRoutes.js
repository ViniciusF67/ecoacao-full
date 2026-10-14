const express = require('express')
const controller = require('../controllers/desafioController')
const { requireAuth, requirePermission } = require('../middleware/auth')

const router = express.Router()

router.get('/', controller.listar)
router.get('/:id', controller.buscarPorId)
router.post('/', requireAuth, requirePermission('challenge.create'), controller.criar)
router.put('/:id', requireAuth, requirePermission('challenge.update'), controller.atualizar)
router.delete('/:id', requireAuth, requirePermission('challenge.delete'), controller.excluir)

// Participação — qualquer usuário autenticado pode participar (não exige permissão especial)
router.get('/:id/participacao', requireAuth, controller.minhaParticipacao)
router.post('/:id/participar', requireAuth, controller.participar)
router.post('/:id/concluir', requireAuth, controller.concluir)

module.exports = router
