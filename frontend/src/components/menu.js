import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'

// Itens do menu lateral. Cada um aparece só para os perfis listados.
// Ao criar uma tela nova, adicione aqui e a rota em routes/AppRoutes.jsx.
const itensMenu = [
  { texto: 'Início', caminho: '/', icone: HomeOutlinedIcon, perfis: ['aluno', 'organizador'] },
  {
    texto: 'Novo organizador',
    caminho: '/organizadores/novo',
    icone: PersonAddAltOutlinedIcon,
    perfis: ['organizador'],
  },
  {
    texto: 'Avisos',
    caminho: '/avisos',
    icone: CampaignOutlinedIcon,
    perfis: ['organizador'],
  },
  {
    texto: 'Passageiros do dia',
    caminho: '/passageiros',
    icone: PeopleAltOutlinedIcon,
    perfis: ['organizador'],
  },
]

export default itensMenu
