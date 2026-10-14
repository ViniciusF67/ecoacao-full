const express = require('express')
const controller = require('../controllers/quizController')
const { requireAuth, requirePermission } = require('../middleware/auth')

const router = express.Router()

router.get('/', controller.listar)
router.get('/historico/me', requireAuth, controller.meuHistorico)
router.get('/:id', controller.buscarParaResponder)
router.post('/:id/responder', requireAuth, controller.responder)
router.post('/', requireAuth, requirePermission('quiz.create'), controller.criar)
router.delete('/:id', requireAuth, requirePermission('quiz.delete'), controller.excluir)

module.exports = router
