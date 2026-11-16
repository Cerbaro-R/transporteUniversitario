const { Op } = require('sequelize');
const { Aviso, Usuario } = require('../models');

module.exports = {
  // POST /avisos: só organizador (RF10)
  async criar(req, res) {
    try {
      const mensagem = (req.body.mensagem || '').trim();
      const rotaId = req.body.rotaId || null;

      if (!mensagem) {
        return res.status(400).json({ erro: 'A mensagem do aviso é obrigatória.' });
      }

      const aviso = await Aviso.create({
        autorId: req.usuario.id,
        rotaId,
        mensagem,
      });

      return res.status(201).json(aviso);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Não foi possível criar o aviso.' });
    }
  },

  // GET /avisos: qualquer usuário logado (RF11)
  // Com ?rotaId=1 devolve os avisos dessa rota + os avisos gerais
  async listar(req, res) {
    try {
      const where = {};
      if (req.query.rotaId) {
        where[Op.or] = [{ rotaId: req.query.rotaId }, { rotaId: null }];
      }

      const avisos = await Aviso.findAll({
        where,
        include: [{ model: Usuario, as: 'autor', attributes: ['id', 'nome'] }],
        order: [['createdAt', 'DESC']],
      });

      return res.json(avisos);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Não foi possível listar os avisos.' });
    }
  },
};
