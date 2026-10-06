import { useState } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { useColorMode } from '@/contexts/ColorModeContext';

export function AppearanceTab() {
  const { mode, toggleColorMode } = useColorMode();
  const [language, setLanguage] = useState('pt-BR');

  return (
    <Stack spacing={4}>
      {/* Tema */}
      <Box>
        <Typography variant="subtitle2" fontWeight={700} mb={0.5}>Tema</Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Escolha entre o modo claro e escuro da interface.
        </Typography>

        <Grid container spacing={2}>
          {(['light', 'dark'] as const).map((m) => {
            const isSelected = mode === m;
            const Icon = m === 'light' ? LightModeOutlinedIcon : DarkModeOutlinedIcon;
            return (
              <Grid key={m} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  variant="outlined"
                  sx={{
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    borderWidth: isSelected ? 2 : 1,
                  }}
                >
                  <CardActionArea
                    onClick={() => { if (mode !== m) toggleColorMode(); }}
                    aria-pressed={isSelected}
                    aria-label={`Tema ${m === 'light' ? 'claro' : 'escuro'}`}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          height: 64,
                          borderRadius: 1.5,
                          mb: 1.5,
                          bgcolor: m === 'light' ? '#F4F6F9' : '#0F1923',
                          border: 1,
                          borderColor: 'divider',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon sx={{ fontSize: 28, color: m === 'light' ? '#1565C0' : '#90CAF9' }} />
                      </Box>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="body2" fontWeight={isSelected ? 700 : 500}>
                          {m === 'light' ? 'Claro' : 'Escuro'}
                        </Typography>
                        {isSelected && (
                          <Typography variant="caption" color="primary" fontWeight={700}>
                            Ativo
                          </Typography>
                        )}
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Divider />

      {/* Idioma */}
      <Box>
        <Typography variant="subtitle2" fontWeight={700} mb={0.5}>Idioma</Typography>
        <Typography variant="body2" color="text.secondary" mb={1.5}>
          Idioma da interface do sistema.
        </Typography>
        <TextField
          select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          sx={{ minWidth: 220 }}
        >
          <MenuItem value="pt-BR">Português (Brasil)</MenuItem>
          <MenuItem value="en-US" disabled>English (US) — em breve</MenuItem>
          <MenuItem value="es" disabled>Español — em breve</MenuItem>
        </TextField>
      </Box>
    </Stack>
  );
}
