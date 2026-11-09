const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: false,
    // As tabelas seguem database/schema.sql: nomes em snake_case
    // (senhaHash no JS <-> senha_hash no banco, createdAt <-> created_at)
    define: { underscored: true },
  }
);

module.exports = sequelize;
