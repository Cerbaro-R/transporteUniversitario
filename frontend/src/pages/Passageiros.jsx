import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { api } from '../services/api'

const STATUS = {
  confirmado: { texto: 'Confirmado', cor: 'success' },
  pendente: { texto: 'Pendente', cor: 'warning' },
  nao_utilizara: { texto: 'Não utilizará', cor: 'default' },
}

function hoje() {
  const agora = new Date()
  const ano = agora.getFullYear()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const dia = String(agora.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

function textoRetorno(passageiro) {
  if (passageiro.status !== 'confirmado') {
    return '-'
  }
  if (passageiro.retorna) {
    return 'Sim'
  }
  return 'Não'
}

export default function Passageiros() {
  const [rotas, setRotas] = useState([])
  const [rotaId, setRotaId] = useState('')
  const [data, setData] = useState(hoje())
  const [busca, setBusca] = useState('')
  const [dados, setDados] = useState(null)
  const [carregandoRotas, setCarregandoRotas] = useState(true)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarRotas() {
      try {
        const lista = await api('/passageiros/rotas')
        setRotas(lista)
        if (lista.length > 0) {
          setRotaId(String(lista[0].id))
        }
      } catch (err) {
        setErro(err.message)
      } finally {
        setCarregandoRotas(false)
      }
    }

    carregarRotas()
  }, [])

  useEffect(() => {
    if (!rotaId) {
      return
    }

    async function carregarPassageiros() {
      setCarregando(true)
      try {
        let endereco = `/passageiros?rotaId=${rotaId}&data=${data}`
        if (busca) {
          endereco = endereco + `&busca=${encodeURIComponent(busca)}`
        }
        const resposta = await api(endereco)
        setDados(resposta)
        setErro('')
      } catch (err) {
        setErro(err.message)
      } finally {
        setCarregando(false)
      }
    }

    carregarPassageiros()
  }, [rotaId, data, busca])

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        Passageiros do dia
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Veja quem confirmou, quem ainda não respondeu e quem não vai usar o ônibus.
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          select
          label="Rota"
          value={rotaId}
          onChange={(event) => setRotaId(event.target.value)}
          disabled={rotas.length === 0}
          sx={{ minWidth: 240 }}
        >
          {rotas.map((rota) => (
            <MenuItem key={rota.id} value={String(rota.id)}>
              {rota.nome}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Data"
          type="date"
          value={data}
          onChange={(event) => setData(event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="Buscar por nome"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          sx={{ flexGrow: 1 }}
        />
      </Stack>

      {erro && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {erro}
        </Alert>
      )}

      {carregandoRotas && <CircularProgress size={28} />}
      {!carregandoRotas && rotas.length === 0 && !erro && (
        <Typography color="text.secondary">Nenhuma rota cadastrada ainda.</Typography>
      )}

      {dados && (
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', rowGap: 1 }}>
          <Chip label={`Total: ${dados.resumo.total}`} />
          <Chip color="success" label={`Confirmados: ${dados.resumo.confirmados}`} />
          <Chip color="warning" label={`Pendentes: ${dados.resumo.pendentes}`} />
          <Chip label={`Não utilizarão: ${dados.resumo.naoUtilizara}`} />
          {carregando && <CircularProgress size={22} />}
        </Stack>
      )}

      {dados && dados.passageiros.length === 0 && (
        <Typography color="text.secondary">Nenhum passageiro encontrado.</Typography>
      )}

      {dados && dados.passageiros.length > 0 && (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Ponto de embarque</TableCell>
                <TableCell>Volta no ônibus</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dados.passageiros.map((passageiro) => (
                <TableRow key={passageiro.alunoId}>
                  <TableCell>{passageiro.nome}</TableCell>
                  <TableCell>{passageiro.pontoEmbarque || '-'}</TableCell>
                  <TableCell>{textoRetorno(passageiro)}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      color={STATUS[passageiro.status].cor}
                      label={STATUS[passageiro.status].texto}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
