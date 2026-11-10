import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus'

/** Moldura das telas sem login (login e cadastro). */
export default function TelaPublica({ titulo, subtitulo, larguraMaxima = 420, children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        py: 4,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: larguraMaxima }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'center', mb: 3, color: 'primary.main' }}>
          <DirectionsBusIcon fontSize="large" />
          <Typography variant="h5" component="p" fontWeight={700}>
            Transporte Universitário
          </Typography>
        </Stack>
        <Card variant="outlined">
          <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Typography variant="h6" component="h1" gutterBottom>
              {titulo}
            </Typography>
            {subtitulo && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {subtitulo}
              </Typography>
            )}
            {children}
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
