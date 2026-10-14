const express = require('express')
const controller = require('../controllers/categoriaController')
const { requireAuth, requirePermission } = require('../middleware/auth')

const router = express.Router()

router.get('/', controller.listar)
router.get('/:id', controller.buscarPorId)
router.post('/', requireAuth, requirePermission('category.create'), controller.criar)
router.put('/:id', requireAuth, requirePermission('category.update'), controller.atualizar)
router.delete('/:id', requireAuth, requirePermission('category.delete'), controller.excluir)

module.exports = router
