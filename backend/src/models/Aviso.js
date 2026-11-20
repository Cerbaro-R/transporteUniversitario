const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Aviso = sequelize.define(
  'Aviso',
  {
    autorId: { type: DataTypes.INTEGER, allowNull: false },
    // rotaId vazio = aviso para todas as rotas
    rotaId: { type: DataTypes.INTEGER },
    mensagem: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
    },
  },
  { tableName: 'avisos' }
);

module.exports = Aviso;
