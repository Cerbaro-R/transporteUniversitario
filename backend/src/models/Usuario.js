const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Model de exemplo (RF01/RF02). Ajustem os campos conforme o modelo de dados.
const Usuario = sequelize.define(
  'Usuario',
  {
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    senhaHash: { type: DataTypes.STRING, allowNull: false },
    perfil: {
      type: DataTypes.ENUM('aluno', 'organizador'),
      allowNull: false,
      defaultValue: 'aluno',
    },
  },
  { tableName: 'usuarios' }
);

module.exports = Usuario;
