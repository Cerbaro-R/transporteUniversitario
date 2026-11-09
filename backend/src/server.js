require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3333;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // cria as tabelas que ainda não existem
    console.log('Banco de dados conectado.');
  } catch (err) {
    console.error('Falha ao conectar no banco:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}/api`);
  });
}

start();
