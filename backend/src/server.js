require('dotenv').config()

const express = require('express')
const cors = require('cors')

const { errorHandler, notFoundHandler } = require('./middleware/errorHandler')

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const categoriaRoutes = require('./routes/categoriaRoutes')
const noticiaRoutes = require('./routes/noticiaRoutes')
const conteudoRoutes = require('./routes/conteudoRoutes')
const quizRoutes = require('./routes/quizRoutes')
const desafioRoutes = require('./routes/desafioRoutes')
const organizacaoRoutes = require('./routes/organizacaoRoutes')
const adminRoutes = require('./routes/adminRoutes')
const contatoRoutes = require('./routes/contatoRoutes')

const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', servico: 'ECOAÇÃO API' })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/categorias', categoriaRoutes)
app.use('/api/noticias', noticiaRoutes)
app.use('/api/conteudos', conteudoRoutes)
app.use('/api/quizzes', quizRoutes)
app.use('/api/desafios', desafioRoutes)
app.use('/api/organizacoes', organizacaoRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/contato', contatoRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`[ECOAÇÃO API] rodando em http://localhost:${PORT}`)
  console.log(`[ECOAÇÃO API] CORS liberado para: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`)
})
