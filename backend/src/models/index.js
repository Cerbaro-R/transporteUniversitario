// Ponto central dos models: importe cada model aqui e defina as associações.
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

module.exports = {
  sequelize,
  Usuario,
};
