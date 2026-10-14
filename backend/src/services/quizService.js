const { sql, getPool } = require('../config/db')

async function listar({ categoriaId } = {}) {
  const pool = await getPool()
  const request = pool.request()
  const condicoes = ["q.status = 'publicado'"]

  if (categoriaId) {
    request.input('categoriaId', sql.Int, categoriaId)
    condicoes.push('q.categoria_id = @categoriaId')
  }

  const result = await request.query(`
    SELECT q.id, q.titulo, q.descricao, c.id AS categoria_id, c.nome AS categoria_nome,
           (SELECT COUNT(*) FROM dbo.perguntas p WHERE p.quiz_id = q.id) AS total_perguntas
    FROM dbo.quizzes q
    JOIN dbo.categorias c ON c.id = q.categoria_id
    WHERE ${condicoes.join(' AND ')}
    ORDER BY q.data_criacao DESC
  `)
  return result.recordset
}

/**
 * Busca um quiz para ser respondido. IMPORTANTE: não inclui qual
 * alternativa é a correta — isso só é revelado depois de responder,
 * via `responder()`.
 */
async function buscarParaResponder(quizId) {
  const pool = await getPool()

  const quizResult = await pool.request()
    .input('id', sql.Int, quizId)
    .query(`
      SELECT q.id, q.titulo, q.descricao, c.nome AS categoria_nome
      FROM dbo.quizzes q
      JOIN dbo.categorias c ON c.id = q.categoria_id
      WHERE q.id = @id
    `)
  const quiz = quizResult.recordset[0]
  if (!quiz) return null

  const perguntasResult = await pool.request()
    .input('quizId', sql.Int, quizId)
    .query(`
      SELECT id, enunciado, ordem FROM dbo.perguntas
      WHERE quiz_id = @quizId ORDER BY ordem
    `)

  const perguntas = []
  for (const pergunta of perguntasResult.recordset) {
    const altResult = await pool.request()
      .input('perguntaId', sql.Int, pergunta.id)
      .query(`
        SELECT id, texto, ordem FROM dbo.alternativas
        WHERE pergunta_id = @perguntaId ORDER BY ordem
      `)
    perguntas.push({ ...pergunta, alternativas: altResult.recordset })
  }

  quiz.perguntas = perguntas
  return quiz
}

/**
 * Recebe as respostas do usuário ({ perguntaId, alternativaId }) e calcula
 * o resultado NO BACKEND, consultando no banco qual alternativa é a
 * correta de cada pergunta — o frontend nunca envia a pontuação pronta.
 */
async function responder(quizId, usuarioId, respostas) {
  const pool = await getPool()

  const perguntasResult = await pool.request()
    .input('quizId', sql.Int, quizId)
    .query('SELECT id FROM dbo.perguntas WHERE quiz_id = @quizId')
  const perguntasDoQuiz = perguntasResult.recordset.map((p) => p.id)

  if (perguntasDoQuiz.length === 0) {
    const erro = new Error('Quiz sem perguntas cadastradas.')
    erro.status = 400
    throw erro
  }

  let acertos = 0
  for (const perguntaId of perguntasDoQuiz) {
    const resposta = respostas.find((r) => Number(r.perguntaId) === perguntaId)
    if (!resposta) continue // pergunta não respondida conta como erro

    const altResult = await pool.request()
      .input('perguntaId', sql.Int, perguntaId)
      .input('alternativaId', sql.Int, resposta.alternativaId)
      .query(`
        SELECT correta FROM dbo.alternativas
        WHERE pergunta_id = @perguntaId AND id = @alternativaId
      `)

    if (altResult.recordset[0]?.correta) acertos += 1
  }

  const total = perguntasDoQuiz.length
  const pontuacao = Number(((acertos / total) * 100).toFixed(2))

  await pool.request()
    .input('usuarioId', sql.Int, usuarioId)
    .input('quizId', sql.Int, quizId)
    .input('pontuacao', sql.Decimal(5, 2), pontuacao)
    .input('acertos', sql.Int, acertos)
    .input('total', sql.Int, total)
    .query(`
      INSERT INTO dbo.resultados_quiz (usuario_id, quiz_id, pontuacao, acertos, total)
      VALUES (@usuarioId, @quizId, @pontuacao, @acertos, @total)
    `)

  return { acertos, erros: total - acertos, total, pontuacao }
}

async function criar({ titulo, descricao, categoriaId, autorId, perguntas }) {
  const pool = await getPool()
  const transaction = new sql.Transaction(pool)

  try {
    await transaction.begin()

    const quizResult = await new sql.Request(transaction)
      .input('titulo', sql.NVarChar, titulo)
      .input('descricao', sql.NVarChar, descricao || null)
      .input('categoriaId', sql.Int, categoriaId)
      .input('autorId', sql.Int, autorId)
      .query(`
        INSERT INTO dbo.quizzes (titulo, descricao, categoria_id, autor_id)
        OUTPUT INSERTED.id
        VALUES (@titulo, @descricao, @categoriaId, @autorId)
      `)
    const quizId = quizResult.recordset[0].id

    for (let i = 0; i < perguntas.length; i++) {
      const pergunta = perguntas[i]
      const perguntaResult = await new sql.Request(transaction)
        .input('quizId', sql.Int, quizId)
        .input('enunciado', sql.NVarChar, pergunta.enunciado)
        .input('ordem', sql.Int, i + 1)
        .query(`
          INSERT INTO dbo.perguntas (quiz_id, enunciado, ordem)
          OUTPUT INSERTED.id
          VALUES (@quizId, @enunciado, @ordem)
        `)
      const perguntaId = perguntaResult.recordset[0].id

      for (let j = 0; j < pergunta.alternativas.length; j++) {
        const alt = pergunta.alternativas[j]
        await new sql.Request(transaction)
          .input('perguntaId', sql.Int, perguntaId)
          .input('texto', sql.NVarChar, alt.texto)
          .input('correta', sql.Bit, !!alt.correta)
          .input('ordem', sql.Int, j + 1)
          .query(`
            INSERT INTO dbo.alternativas (pergunta_id, texto, correta, ordem)
            VALUES (@perguntaId, @texto, @correta, @ordem)
          `)
      }
    }

    await transaction.commit()
    return buscarParaResponder(quizId)
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}

async function excluir(id) {
  const pool = await getPool()
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM dbo.quizzes WHERE id = @id') // CASCADE remove perguntas/alternativas/resultados
  return result.rowsAffected[0] > 0
}

async function historicoDoUsuario(usuarioId) {
  const pool = await getPool()
  const result = await pool.request()
    .input('usuarioId', sql.Int, usuarioId)
    .query(`
      SELECT r.id, r.pontuacao, r.acertos, r.total, r.data_realizacao,
             q.id AS quiz_id, q.titulo AS quiz_titulo
      FROM dbo.resultados_quiz r
      JOIN dbo.quizzes q ON q.id = r.quiz_id
      WHERE r.usuario_id = @usuarioId
      ORDER BY r.data_realizacao DESC
    `)
  return result.recordset
}

module.exports = { listar, buscarParaResponder, responder, criar, excluir, historicoDoUsuario }
