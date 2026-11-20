const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

module.exports = {
  async listar(req, res) {
    try {
      const rotas = await sequelize.query(
        'SELECT id, nome FROM rotas WHERE ativa = TRUE ORDER BY nome',
        { type: QueryTypes.SELECT }
      );

      return res.json(rotas);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ message: 'Não foi possível listar as rotas.' });
    }
  },
};
