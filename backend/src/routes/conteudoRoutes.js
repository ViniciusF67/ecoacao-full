const express = require('express')
const controller = require('../controllers/conteudoController')
const { requireAuth, requirePermission } = require('../middleware/auth')

const router = express.Router()

router.get('/', controller.listar)
router.get('/:id', controller.buscarPorId)
router.post('/', requireAuth, requirePermission('content.create'), controller.criar)
router.put('/:id', requireAuth, requirePermission('content.update'), controller.atualizar)
router.delete('/:id', requireAuth, requirePermission('content.delete'), controller.excluir)

module.exports = router
