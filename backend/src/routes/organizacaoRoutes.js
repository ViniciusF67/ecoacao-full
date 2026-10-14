const express = require('express')
const controller = require('../controllers/organizacaoController')
const { requireAuth, requirePermission } = require('../middleware/auth')

const router = express.Router()

router.get('/', controller.listar)
router.get('/:id', controller.buscarPorId)
router.post('/', requireAuth, requirePermission('organization.create'), controller.criar)
router.put('/:id', requireAuth, requirePermission('organization.update'), controller.atualizar)
router.delete('/:id', requireAuth, requirePermission('organization.delete'), controller.excluir)
router.post('/:id/acoes', requireAuth, requirePermission('organization.update'), controller.adicionarAcao)

module.exports = router
