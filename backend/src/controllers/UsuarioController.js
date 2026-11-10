const { Usuario } = require('../models');
const { lerDadosCadastro } = require('../utils/usuarioDados');

class UsuarioController {
  // RF02 — só um organizador logado cadastra outro organizador
  async cadastrarOrganizador(req, res) {
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
      perfil: 'organizador',
      senhaHash: await Usuario.gerarHash(senha),
    });

    return res.status(201).json({ usuario });
  }
}

module.exports = new UsuarioController();
