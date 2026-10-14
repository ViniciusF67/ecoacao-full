const sql = require('mssql')

const config = {
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false',
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
}

let pool = null

/**
 * Retorna um pool de conexões reutilizável com o SQL Server.
 * Lança erro claro se a conexão falhar, em vez de deixar a aplicação
 * travada silenciosamente.
 */
async function getPool() {
  if (pool && pool.connected) return pool

  try {
    pool = await sql.connect(config)
    console.log(`[db] Conectado ao SQL Server (${config.server}:${config.port}/${config.database})`)
    return pool
  } catch (err) {
    console.error('[db] Falha ao conectar ao SQL Server:', err.message)
    throw new Error(
      'Não foi possível conectar ao SQL Server. Verifique se o serviço está rodando, ' +
      'se as credenciais em .env estão corretas e se o banco "EcoAcao" existe (rode database/schema.sql).'
    )
  }
}

module.exports = { sql, getPool }
