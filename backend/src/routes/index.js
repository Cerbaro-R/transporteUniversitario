const { Router } = require('express');
const autenticar = require('../middlewares/autenticar');
const permitir = require('../middlewares/permitir');
const HealthController = require('../controllers/HealthController');
const AuthController = require('../controllers/AuthController');
const UsuarioController = require('../controllers/UsuarioController');
const AvisoController = require('../controllers/AvisoController');
const PassageiroController = require('../controllers/PassageiroController');
const RotaPainelController = require('../controllers/RotaPainelController');

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

// Avisos
routes.post('/avisos', autenticar, permitir('organizador'), AvisoController.criar);
routes.get('/avisos', autenticar, AvisoController.listar);

// Painel do organizador
routes.get('/passageiros/rotas', autenticar, permitir('organizador'), RotaPainelController.listar);
routes.get('/passageiros', autenticar, permitir('organizador'), PassageiroController.listar);

module.exports = routes;
