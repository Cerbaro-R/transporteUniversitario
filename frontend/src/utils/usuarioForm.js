// Regras do formulário de usuário (cadastro de aluno e de organizador).
// Mesmas regras do back-end (backend/src/utils/usuarioDados.js).

export const USUARIO_VAZIO = {
  nome: '',
  email: '',
  senha: '',
  confirmarSenha: '',
  telefone: '',
  instituicao: '',
  curso: '',
  cidadeOrigem: '',
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validarUsuario(v) {
  const erros = {}
  if (!v.nome.trim()) erros.nome = 'Informe o nome.'
  if (!EMAIL_REGEX.test(v.email.trim())) erros.email = 'Informe um e-mail válido.'
  if (v.senha.length < 6) erros.senha = 'A senha deve ter pelo menos 6 caracteres.'
  if (v.confirmarSenha !== v.senha) erros.confirmarSenha = 'As senhas não conferem.'
  return erros
}

// O que vai para a API (sem a confirmação de senha)
export function dadosParaApi(valores) {
  const dados = { ...valores }
  delete dados.confirmarSenha
  return dados
}
