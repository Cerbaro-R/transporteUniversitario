import { useState } from 'react'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

/** TextField de senha com botão para mostrar/ocultar. */
export default function CampoSenha(props) {
  const [visivel, setVisivel] = useState(false)

  return (
    <TextField
      {...props}
      type={visivel ? 'text' : 'password'}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
                onClick={() => setVisivel((v) => !v)}
                edge="end"
                size="small"
              >
                {visivel ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  )
}
