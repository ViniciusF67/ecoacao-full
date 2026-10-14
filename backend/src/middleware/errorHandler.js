/**
 * Middleware final de tratamento de erros. Qualquer `next(err)` chamado
 * nos controllers cai aqui, evitando vazar stack traces para o cliente
 * e padronizando o formato de resposta de erro.
 */
function errorHandler(err, req, res, _next) {
  console.error('[erro]', err)

  const status = err.status || 500
  const mensagem = status === 500
    ? 'Erro interno do servidor.'
    : err.message || 'Erro na requisição.'

  res.status(status).json({ erro: mensagem })
}

function notFoundHandler(req, res) {
  res.status(404).json({ erro: `Rota não encontrada: ${req.method} ${req.originalUrl}` })
}

module.exports = { errorHandler, notFoundHandler }
