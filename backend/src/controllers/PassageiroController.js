const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

function hoje() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

module.exports = {
  async listar(req, res) {
    try {
      const rotaId = Number(req.query.rotaId);
      const data = req.query.data || hoje();
      const busca = (req.query.busca || '').trim();

      if (!rotaId) {
        return res.status(400).json({ message: 'Informe a rota.' });
      }
      if (isNaN(new Date(data))) {
        return res.status(400).json({ message: 'Data inválida. Use o formato AAAA-MM-DD.' });
      }

      const rotas = await sequelize.query(
        'SELECT id, nome FROM rotas WHERE id = :rotaId',
        { replacements: { rotaId: rotaId }, type: QueryTypes.SELECT }
      );
      const rota = rotas[0];

      if (!rota) {
        return res.status(404).json({ message: 'Rota não encontrada.' });
      }

      const passageiros = await sequelize.query(
        `SELECT
           u.id AS "alunoId",
           u.nome AS "nome",
           COALESCE(pe.nome, pp.nome) AS "pontoEmbarque",
           CASE WHEN c.vai THEN c.retorna END AS "retorna",
           CASE
             WHEN c.id IS NULL THEN 'pendente'
             WHEN c.vai THEN 'confirmado'
             ELSE 'nao_utilizara'
           END AS "status"
         FROM rota_passageiros rp
         JOIN usuarios u ON u.id = rp.aluno_id
         LEFT JOIN viagens v ON v.rota_id = rp.rota_id AND v.data = :data
         LEFT JOIN checkins c ON c.viagem_id = v.id AND c.aluno_id = rp.aluno_id
         LEFT JOIN pontos_embarque pe ON pe.id = c.ponto_embarque_id
         LEFT JOIN pontos_embarque pp ON pp.id = rp.ponto_embarque_padrao_id
         WHERE rp.rota_id = :rotaId
           AND (:busca = '' OR POSITION(LOWER(:busca) IN LOWER(u.nome)) > 0)
         ORDER BY u.nome`,
        {
          replacements: { rotaId: rotaId, data: data, busca: busca },
          type: QueryTypes.SELECT,
        }
      );

      let confirmados = 0;
      let pendentes = 0;
      let naoUtilizara = 0;

      for (const passageiro of passageiros) {
        if (passageiro.status === 'confirmado') {
          confirmados = confirmados + 1;
        } else if (passageiro.status === 'pendente') {
          pendentes = pendentes + 1;
        } else {
          naoUtilizara = naoUtilizara + 1;
        }
      }

      const resumo = {
        total: passageiros.length,
        confirmados: confirmados,
        pendentes: pendentes,
        naoUtilizara: naoUtilizara,
      };

      return res.json({ rota: rota, data: data, resumo: resumo, passageiros: passageiros });
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ message: 'Não foi possível listar os passageiros.' });
    }
  },
};
