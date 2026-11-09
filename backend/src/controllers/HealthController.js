const { sequelize } = require('../models');

class HealthController {
  async show(req, res) {
    try {
      await sequelize.authenticate();
      return res.json({ status: 'ok', database: 'conectado' });
    } catch (err) {
      return res.status(503).json({ status: 'erro', database: 'desconectado' });
    }
  }
}

module.exports = new HealthController();
