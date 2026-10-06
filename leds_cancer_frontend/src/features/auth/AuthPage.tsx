import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Tab,
  Tabs,
  Typography,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useColorMode } from '@/contexts/ColorModeContext';

type TabValue = 'login' | 'register';

export function AuthPage() {
  const [tab, setTab] = useState<TabValue>('login');
  const { mode, toggleColorMode } = useColorMode();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
        py: 4,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 460 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Header */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <LocalHospitalOutlinedIcon color="primary" sx={{ fontSize: 28 }} />
              <Box>
                <Typography variant="h6" fontWeight={700} color="primary" lineHeight={1.1}>
                  MammoAI
                </Typography>
                <Typography variant="caption" color="text.secondary" lineHeight={1}>
                  Pré-diagnóstico de Câncer de Mama
                </Typography>
              </Box>
            </Stack>

            <Tooltip title={mode === 'light' ? 'Modo escuro' : 'Modo claro'}>
              <IconButton onClick={toggleColorMode} size="small" aria-label="Alternar tema">
                {mode === 'light' ? (
                  <DarkModeOutlinedIcon fontSize="small" />
                ) : (
                  <LightModeOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Tabs */}
          <Tabs
            value={tab}
            onChange={(_event: React.SyntheticEvent, v: TabValue) => setTab(v)}
            variant="fullWidth"
            sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab
              label="Entrar"
              value="login"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            />
            <Tab
              label="Criar Conta"
              value="register"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            />
          </Tabs>

          {/* Forms */}
          {tab === 'login' ? <LoginForm /> : <RegisterForm />}

          {/* Footer */}
          <Typography
            variant="caption"
            color="text.disabled"
            display="block"
            textAlign="center"
            mt={3}
          >
            Acesso restrito a profissionais de saúde autorizados.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
