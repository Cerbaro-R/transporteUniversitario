const { Router } = require('express');
const autenticar = require('../middlewares/autenticar');
const permitir = require('../middlewares/permitir');
const HealthController = require('../controllers/HealthController');
const AuthController = require('../controllers/AuthController');
const UsuarioController = require('../controllers/UsuarioController');

const routes = Router();

routes.get('/health', HealthController.show);

// Autenticação (públicas, exceto /auth/eu)
routes.post('/auth/cadastro', AuthController.cadastrar);
routes.post('/auth/login', AuthController.login);
routes.get('/auth/eu', autenticar, AuthController.eu);

// Usuários
routes.post(
  '/usuarios/organizadores',
  autenticar,
  permitir('organizador'),
  UsuarioController.cadastrarOrganizador
);

module.exports = routes;
