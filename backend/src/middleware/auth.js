const jwt = require('jsonwebtoken')

/**
 * requireAuth: exige um token JWT válido no header Authorization.
 * Formato esperado: "Authorization: Bearer <token>"
 *
 * O payload do token contém { id, nome, email, role, permissions },
 * definido no momento do login (ver authController.login).
 * Isso evita consultar o banco a cada requisição só para checar permissão.
 * Trade-off: se o papel do usuário mudar, isso só reflete no próximo login
 * (ou quando o token expirar). Documentado no README.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const [tipo, token] = header.split(' ')

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Token de autenticação ausente.' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = payload // { id, nome, email, role, permissions }
    next()
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' })
  }
}

/**
 * requirePermission(chave): exige que o usuário autenticado possua a
 * permissão informada (ex.: "news.create"). Deve ser usado DEPOIS de
 * requireAuth na cadeia de middlewares da rota.
 */
function requirePermission(chave) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ erro: 'Não autenticado.' })
    }
    const permissoes = req.usuario.permissions || []
    if (!permissoes.includes(chave)) {
      return res.status(403).json({
        erro: `Acesso negado: esta ação requer a permissão "${chave}".`,
      })
    }
    next()
  }
}

/**
 * requireAnyPermission: variante que aceita qualquer uma das permissões
 * informadas (útil quando mais de um papel pode acessar a mesma rota).
 */
function requireAnyPermission(...chaves) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ erro: 'Não autenticado.' })
    }
    const permissoes = req.usuario.permissions || []
    const temAlguma = chaves.some((c) => permissoes.includes(c))
    if (!temAlguma) {
      return res.status(403).json({
        erro: `Acesso negado: esta ação requer uma das permissões: ${chaves.join(', ')}.`,
      })
    }
    next()
  }
}

module.exports = { requireAuth, requirePermission, requireAnyPermission }
