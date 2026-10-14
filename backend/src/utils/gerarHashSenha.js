/**
 * Utilitário para gerar um hash bcrypt de uma senha, usado para criar
 * o usuário administrador inicial no seed.sql (veja database/seed.sql).
 *
 * Uso (dentro da pasta backend/, depois de `npm install`):
 *   node src/utils/gerarHashSenha.js SuaSenhaAqui
 */
const bcrypt = require('bcrypt')

const senha = process.argv[2]

if (!senha) {
  console.error('Uso: node src/utils/gerarHashSenha.js <senha>')
  process.exit(1)
}

bcrypt.hash(senha, 10).then((hash) => {
  console.log('\nHash gerado (copie e cole no lugar de @HASH_ADMIN@ em database/seed.sql):\n')
  console.log(hash)
  console.log('')
})
