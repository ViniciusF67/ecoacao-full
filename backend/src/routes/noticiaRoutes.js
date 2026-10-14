const express = require('express')
const controller = require('../controllers/noticiaController')
const { requireAuth, requirePermission } = require('../middleware/auth')

const router = express.Router()

router.get('/', controller.listar)
router.get('/:id', controller.buscarPorId)
router.post('/', requireAuth, requirePermission('news.create'), controller.criar)
router.put('/:id', requireAuth, requirePermission('news.update'), controller.atualizar)
router.delete('/:id', requireAuth, requirePermission('news.delete'), controller.excluir)

module.exports = router
