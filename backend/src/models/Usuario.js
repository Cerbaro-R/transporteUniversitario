const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const PERFIS = ['aluno', 'organizador'];

const Usuario = sequelize.define(
  'Usuario',
  {
    nome: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(160), allowNull: false, unique: true },
    senhaHash: { type: DataTypes.STRING, allowNull: false },
    perfil: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'aluno',
      validate: { isIn: [PERFIS] },
    },
    telefone: { type: DataTypes.STRING(20) },
    instituicao: { type: DataTypes.STRING(120) },
    curso: { type: DataTypes.STRING(120) },
    cidadeOrigem: { type: DataTypes.STRING(120) },
  },
  {
    tableName: 'usuarios',
    // Por padrão o hash da senha nunca sai do banco.
    // Use Usuario.scope('comSenha') só onde precisa conferir a senha (login).
    defaultScope: { attributes: { exclude: ['senhaHash'] } },
    scopes: { comSenha: { attributes: { include: ['senhaHash'] } } },
  }
);

Usuario.PERFIS = PERFIS;

Usuario.gerarHash = (senha) => bcrypt.hash(senha, 10);

Usuario.prototype.confereSenha = function confereSenha(senha) {
  return bcrypt.compare(senha, this.senhaHash);
};

// Garante que o hash não vaze ao devolver o usuário como JSON
Usuario.prototype.toJSON = function toJSON() {
  const { senhaHash, ...dados } = this.get();
  return dados;
};

module.exports = Usuario;
