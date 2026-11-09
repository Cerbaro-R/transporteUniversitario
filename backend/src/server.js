require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3333;

async function start() {
  try {
    // As tabelas são criadas pelo database/schema.sql, não pelo Sequelize
    await sequelize.authenticate();
    console.log('Banco de dados conectado.');
  } catch (err) {
    console.error('Falha ao conectar no banco:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}/api`);
  });
}

start();
