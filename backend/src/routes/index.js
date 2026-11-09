const { Router } = require('express');
const HealthController = require('../controllers/HealthController');

const routes = Router();

routes.get('/health', HealthController.show);

module.exports = routes;
