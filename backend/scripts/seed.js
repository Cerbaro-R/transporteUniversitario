require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('../src/models');

async function seed() {
  try {
    await sequelize.authenticate();
    const senhaHash = await bcrypt.hash('123456', 10);

    await sequelize.query(`
      TRUNCATE TABLE 
        avisos, localizacoes, checkins, viagens, 
        rota_passageiros, pontos_embarque, rotas, usuarios 
      RESTART IDENTITY CASCADE;
    `);

    const [usuarios] = await sequelize.query(
      `
      INSERT INTO usuarios (nome, email, senha_hash, perfil, telefone, instituicao, curso, cidade_origem)
      VALUES
        ('Carlos Organizador', 'organizador@transporte.com', :senhaHash, 'organizador', '(49) 99999-0001', NULL, NULL, 'Xaxim'),
        ('Ana Silva', 'ana@aluno.com', :senhaHash, 'aluno', '(49) 99999-1111', 'Unochapecó', 'Ciência da Computação', 'Xaxim'),
        ('Bruno Souza', 'bruno@aluno.com', :senhaHash, 'aluno', '(49) 99999-2222', 'UFFS', 'Engenharia Ambiental', 'Xaxim'),
        ('Camila Costa', 'camila@aluno.com', :senhaHash, 'aluno', '(49) 99999-3333', 'Unoesc', 'Direito', 'Xaxim'),
        ('Diego Martins', 'diego@aluno.com', :senhaHash, 'aluno', '(49) 99999-4444', 'Unochapecó', 'Administração', 'Cordilheira Alta'),
        ('Eduarda Lima', 'eduarda@aluno.com', :senhaHash, 'aluno', '(49) 99999-5555', 'IFSC', 'Engenharia Mecânica', 'Cordilheira Alta')
      RETURNING id, nome, perfil;
      `,
      { replacements: { senhaHash } }
    );

    const orgId = usuarios[0].id;
    const [ana, bruno, camila, diego, eduarda] = usuarios.slice(1);

    const [rotas] = await sequelize.query(
      `
      INSERT INTO rotas (nome, descricao, organizador_id, horario_saida, horario_retorno, prazo_checkin, ativa)
      VALUES
        ('Xaxim -> Unochapecó (Noturno)', 'Linha principal via BR-282 passando por Cordilheira Alta', :orgId, '18:00:00', '22:30:00', '17:00:00', TRUE),
        ('Xaxim -> UFFS / IFSC (Noturno)', 'Linha direta para campus UFFS e IFSC', :orgId, '18:10:00', '22:40:00', '17:15:00', TRUE)
      RETURNING id, nome;
      `,
      { replacements: { orgId } }
    );

    const rota1Id = rotas[0].id;
    const rota2Id = rotas[1].id;

    const [pontos] = await sequelize.query(
      `
      INSERT INTO pontos_embarque (rota_id, nome, endereco, latitude, longitude, ordem)
      VALUES
        (:rota1Id, 'Praça Frei Bruno (Centro)', 'Av. Plínio Arlindo de Nes, Xaxim', -26.961400, -52.535200, 1),
        (:rota1Id, 'Posto Alfa BR-282', 'Trevo Principal, Xaxim', -26.968100, -52.541900, 2),
        (:rota1Id, 'Trevo Cordilheira Alta', 'Acesso Centro, Cordilheira Alta', -26.985500, -52.608300, 3),
        (:rota2Id, 'Terminal Rodoviário Xaxim', 'Rua André Lunardi, Xaxim', -26.959800, -52.533100, 1)
      RETURNING id, nome;
      `,
      { replacements: { rota1Id, rota2Id } }
    );

    const [pontoPraca, pontoPosto, pontoCordilheira, pontoRodoviaria] = pontos;

    await sequelize.query(
      `
      INSERT INTO rota_passageiros (rota_id, aluno_id, ponto_embarque_padrao_id)
      VALUES
        (:rota1Id, :anaId, :pontoPraca),
        (:rota1Id, :brunoId, :pontoPosto),
        (:rota1Id, :camilaId, :pontoPraca),
        (:rota1Id, :diegoId, :pontoCordilheira),
        (:rota2Id, :eduardaId, :pontoRodoviaria);
      `,
      {
        replacements: {
          rota1Id,
          rota2Id,
          anaId: ana.id,
          brunoId: bruno.id,
          camilaId: camila.id,
          diegoId: diego.id,
          eduardaId: eduarda.id,
          pontoPraca: pontoPraca.id,
          pontoPosto: pontoPosto.id,
          pontoCordilheira: pontoCordilheira.id,
          pontoRodoviaria: pontoRodoviaria.id,
        },
      }
    );

    const [viagens] = await sequelize.query(
      `
      INSERT INTO viagens (rota_id, data, status)
      VALUES
        (:rota1Id, CURRENT_DATE, 'em_andamento'),
        (:rota2Id, CURRENT_DATE, 'agendada')
      RETURNING id;
      `,
      { replacements: { rota1Id, rota2Id } }
    );

    const viagem1Id = viagens[0].id;

    await sequelize.query(
      `
      INSERT INTO checkins (viagem_id, aluno_id, ponto_embarque_id, vai, retorna)
      VALUES
        (:viagem1Id, :anaId, :pontoPraca, TRUE, TRUE),
        (:viagem1Id, :brunoId, :pontoPosto, TRUE, FALSE),
        (:viagem1Id, :camilaId, NULL, FALSE, FALSE);
      `,
      {
        replacements: {
          viagem1Id,
          anaId: ana.id,
          brunoId: bruno.id,
          camilaId: camila.id,
          pontoPraca: pontoPraca.id,
          pontoPosto: pontoPosto.id,
        },
      }
    );

    await sequelize.query(
      `
      INSERT INTO localizacoes (viagem_id, latitude, longitude, velocidade)
      VALUES (:viagem1Id, -26.972000, -52.565000, 62.50);
      `,
      { replacements: { viagem1Id } }
    );

    await sequelize.query(
      `
      INSERT INTO avisos (autor_id, rota_id, mensagem)
      VALUES
        (:orgId, NULL, 'Lembrete: confirmem o check-in até às 17h para garantir vaga no ônibus.'),
        (:orgId, :rota1Id, 'Atenção Rota 1: embarque na Praça Frei Bruno será em frente à farmácia hoje.');
      `,
      { replacements: { orgId, rota1Id } }
    );

    console.log('Seed executado com sucesso! (Senha padrão: 123456)');
    process.exit(0);
  } catch (erro) {
    console.error('Erro ao executar seed:', erro);
    process.exit(1);
  }
}

seed();