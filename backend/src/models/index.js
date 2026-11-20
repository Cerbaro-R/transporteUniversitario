// Ponto central dos models: importe cada model aqui e defina as associações.
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Aviso = require('./Aviso');

Aviso.belongsTo(Usuario, { as: 'autor', foreignKey: 'autorId' });

module.exports = {
  sequelize,
  Usuario,
  Aviso,
};
