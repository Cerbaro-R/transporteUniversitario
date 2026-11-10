import { Box, TextField } from '@mui/material'
import CampoSenha from './CampoSenha'

/** Campos do formulário de usuário, usados no cadastro de aluno e de organizador. */
export default function CamposUsuario({ valores, erros, onChange, disabled }) {
  const campo = (nome) => ({
    id: `usuario-${nome}`,
    name: nome,
    value: valores[nome],
    onChange,
    disabled,
    error: Boolean(erros[nome]),
    helperText: erros[nome] || ' ',
  })

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        columnGap: 2,
      }}
    >
      <TextField label="Nome completo" required autoComplete="name" {...campo('nome')} sx={{ gridColumn: '1 / -1' }} />
      <TextField label="E-mail" type="email" required autoComplete="email" {...campo('email')} />
      <TextField label="Telefone" type="tel" autoComplete="tel" placeholder="(49) 99999-9999" {...campo('telefone')} />
      <CampoSenha label="Senha" required autoComplete="new-password" {...campo('senha')} />
      <CampoSenha label="Confirmar senha" required autoComplete="new-password" {...campo('confirmarSenha')} />
      <TextField label="Instituição" {...campo('instituicao')} />
      <TextField label="Curso" {...campo('curso')} />
      <TextField label="Cidade de origem" autoComplete="address-level2" {...campo('cidadeOrigem')} sx={{ gridColumn: '1 / -1' }} />
    </Box>
  )
}
