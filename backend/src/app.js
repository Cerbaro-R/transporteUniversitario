const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

// Rota inexistente
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
});

// Erros não tratados (o Express 5 já repassa os erros dos controllers async)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'JSON inválido no corpo da requisição.' });
  }
  console.error(err);
  return res.status(500).json({ message: 'Erro interno no servidor.' });
});

module.exports = app;
