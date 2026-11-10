// Cria um organizador direto no banco. Serve para criar o PRIMEIRO
// organizador, já que pela API só um organizador cria outro.
//
// Uso (dentro de backend/):
//   npm run criar-organizador -- "Nome Completo" email@exemplo.com senha123
require('dotenv').config({ quiet: true });
const { sequelize, Usuario } = require('../src/models');

async function main() {
  const [nome, email, senha] = process.argv.slice(2);
  if (!nome || !email || !senha) {
    console.log('Uso: npm run criar-organizador -- "Nome" email senha');
    process.exitCode = 1;
    return;
  }
  if (senha.length < 6) {
    console.log('A senha deve ter pelo menos 6 caracteres.');
    process.exitCode = 1;
    return;
  }

  const emailNormalizado = email.trim().toLowerCase();
  if (await Usuario.findOne({ where: { email: emailNormalizado } })) {
    console.log(`Já existe um usuário com o e-mail ${emailNormalizado}.`);
    process.exitCode = 1;
    return;
  }

  const usuario = await Usuario.create({
    nome: nome.trim(),
    email: emailNormalizado,
    perfil: 'organizador',
    senhaHash: await Usuario.gerarHash(senha),
  });
  console.log(`Organizador criado: #${usuario.id} ${usuario.nome} <${usuario.email}>`);
}

main()
  .catch((err) => {
    console.error('Erro:', err.message);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
