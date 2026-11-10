// Validação e limpeza dos dados de cadastro de usuário,
// usada tanto no cadastro de aluno quanto no de organizador.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHA_MIN = 6;

function texto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

function opcional(valor) {
  const t = texto(valor);
  return t === '' ? null : t;
}

function lerDadosCadastro(body = {}) {
  const dados = {
    nome: texto(body.nome),
    email: texto(body.email).toLowerCase(),
    senha: typeof body.senha === 'string' ? body.senha : '',
    telefone: opcional(body.telefone),
    instituicao: opcional(body.instituicao),
    curso: opcional(body.curso),
    cidadeOrigem: opcional(body.cidadeOrigem),
  };

  const erros = {};
  if (!dados.nome) erros.nome = 'Informe o nome.';
  if (!EMAIL_REGEX.test(dados.email)) erros.email = 'Informe um e-mail válido.';
  if (dados.senha.length < SENHA_MIN) {
    erros.senha = `A senha deve ter pelo menos ${SENHA_MIN} caracteres.`;
  }

  return { dados, erros };
}

module.exports = { lerDadosCadastro };
