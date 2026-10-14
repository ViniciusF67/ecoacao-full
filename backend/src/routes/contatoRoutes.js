const express = require('express')
const { sql, getPool } = require('../config/db')

const router = express.Router()

router.post('/', async (req, res, next) => {
  try {
    const { nome, email, assunto, mensagem } = req.body

    if (!nome?.trim() || !email?.trim() || !assunto?.trim() || !mensagem?.trim()) {
      return res.status(400).json({ erro: 'Nome, e-mail, assunto e mensagem são obrigatórios.' })
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ erro: 'E-mail inválido.' })
    }

    const pool = await getPool()
    await pool.request()
      .input('nome', sql.NVarChar, nome.trim())
      .input('email', sql.NVarChar, email.trim())
      .input('assunto', sql.NVarChar, assunto.trim())
      .input('mensagem', sql.NVarChar, mensagem.trim())
      .query(`
        INSERT INTO dbo.mensagens_contato (nome, email, assunto, mensagem)
        VALUES (@nome, @email, @assunto, @mensagem)
      `)

    res.status(201).json({ mensagem: 'Mensagem enviada com sucesso.' })
  } catch (err) { next(err) }
})

module.exports = router
