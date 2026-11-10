const { Usuario } = require('../models');
const { lerDadosCadastro } = require('../utils/usuarioDados');
const { gerarToken } = require('../utils/token');

class AuthController {
  // RF02 — cadastro público: sempre cria um ALUNO
  async cadastrar(req, res) {
    const { dados, erros } = lerDadosCadastro(req.body);
    if (Object.keys(erros).length) {
      return res.status(400).json({ message: 'Dados inválidos.', erros });
    }

    const existente = await Usuario.findOne({ where: { email: dados.email } });
    if (existente) {
      return res.status(409).json({
        message: 'Já existe um usuário com este e-mail.',
        erros: { email: 'E-mail já cadastrado.' },
      });
    }

    const { senha, ...resto } = dados;
    const usuario = await Usuario.create({
      ...resto,
      perfil: 'aluno',
      senhaHash: await Usuario.gerarHash(senha),
    });

    return res.status(201).json({ usuario, token: gerarToken(usuario) });
  }

  // RF01 / caso 1 — login com e-mail e senha
  async login(req, res) {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const senha = typeof req.body?.senha === 'string' ? req.body.senha : '';

    if (!email || !senha) {
      return res.status(400).json({ message: 'Informe e-mail e senha.' });
    }

    const usuario = await Usuario.scope('comSenha').findOne({ where: { email } });
    // Mesma mensagem para e-mail inexistente e senha errada (não revela quem tem conta)
    if (!usuario || !(await usuario.confereSenha(senha))) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }

    return res.json({ usuario, token: gerarToken(usuario) });
  }

  // Devolve o usuário dono do token (o front usa ao recarregar a página)
  async eu(req, res) {
    const usuario = await Usuario.findByPk(req.usuario.id);
    if (!usuario) {
      return res.status(401).json({ message: 'Sessão inválida. Faça login novamente.' });
    }
    return res.json({ usuario });
  }
}

module.exports = new AuthController();
