import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import { useColorMode } from '@/contexts/ColorModeContext';
import { useAuth } from '@/contexts/AuthContext';

interface AppHeaderProps {
  drawerWidth: number;
  onMenuToggle: () => void;
}

export function AppHeader({ drawerWidth, onMenuToggle }: AppHeaderProps) {
  const { mode, toggleColorMode } = useColorMode();
  const { user } = useAuth();

  // Iniciais do nome para o Avatar
  const initials = user?.fullName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() ?? 'U';

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        transition: 'width 0.2s ease, margin 0.2s ease',
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ minHeight: 56, px: { xs: 2, sm: 3 } }}>
        {/* Hambúrguer — abre/fecha em qualquer breakpoint */}
        <IconButton
          edge="start"
          onClick={onMenuToggle}
          aria-label="Alternar menu de navegação"
          sx={{ mr: 1 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo — visível apenas em mobile */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ display: { md: 'none' }, flexGrow: 1 }}
        >
          <LocalHospitalOutlinedIcon color="primary" sx={{ fontSize: 22 }} />
          <Typography variant="subtitle1" fontWeight={700} color="primary">
            MammoAI
          </Typography>
        </Stack>

        <Box sx={{ flexGrow: 1 }} />

        {/* Ações do header */}
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Tooltip title={mode === 'light' ? 'Modo escuro' : 'Modo claro'}>
            <IconButton size="small" onClick={toggleColorMode} aria-label="Alternar tema">
              {mode === 'light' ? (
                <DarkModeOutlinedIcon fontSize="small" />
              ) : (
                <LightModeOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Notificações">
            <IconButton size="small" aria-label="Notificações">
              <NotificationsNoneOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title={user?.fullName ?? 'Perfil'}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: 12,
                fontWeight: 700,
                bgcolor: 'primary.main',
                cursor: 'pointer',
                ml: 0.5,
              }}
              aria-label="Perfil do usuário"
            >
              {initials}
            </Avatar>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
