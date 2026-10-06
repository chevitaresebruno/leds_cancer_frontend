import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import AddToPhotosOutlinedIcon from '@mui/icons-material/AddToPhotosOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { SvgIconComponent } from '@mui/icons-material';

// ─── Itens de navegação ───────────────────────────────────────────────────────

interface NavItemConfig {
  id: string;
  label: string;
  path: string;
  Icon: SvgIconComponent;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'dashboard', label: 'Início',             path: '/dashboard', Icon: DashboardOutlinedIcon   },
  { id: 'patients',  label: 'Pacientes',           path: '/patients',  Icon: PeopleAltOutlinedIcon   },
  { id: 'new-exam',  label: 'Nova Análise',        path: '/new-exam',  Icon: AddToPhotosOutlinedIcon },
  { id: 'history',   label: 'Histórico de Exames', path: '/history',   Icon: HistoryOutlinedIcon     },
  { id: 'settings',  label: 'Configurações',       path: '/settings',  Icon: SettingsOutlinedIcon    },
];

// ─── Conteúdo do Drawer ───────────────────────────────────────────────────────

interface DrawerContentProps {
  collapsed: boolean;
  onClose?: () => void;
}

function DrawerContent({ collapsed }: DrawerContentProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/auth', { replace: true });
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Logo */}
      <Toolbar sx={{ minHeight: 56, px: collapsed ? 1 : 2.5, justifyContent: collapsed ? 'center' : 'flex-start' }}>
        {collapsed ? (
          <LocalHospitalOutlinedIcon color="primary" sx={{ fontSize: 26 }} />
        ) : (
          <Stack direction="row" alignItems="center" spacing={1.2}>
            <LocalHospitalOutlinedIcon color="primary" sx={{ fontSize: 26 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight={700} color="primary" lineHeight={1}>
                MammoAI
              </Typography>
              <Typography variant="caption" color="text.secondary" lineHeight={1} fontSize={10}>
                Diagnóstico Assistido por IA
              </Typography>
            </Box>
          </Stack>
        )}
      </Toolbar>

      <Divider />

      {/* Itens de navegação */}
      <List
        sx={{ px: collapsed ? 0.5 : 1.5, py: 1.5, flexGrow: 1 }}
        component="nav"
        aria-label="Navegação principal"
      >
        {NAV_ITEMS.map(({ id, label, path, Icon }) => {
          const isActive = location.pathname === path;

          return (
            <Tooltip key={id} title={collapsed ? label : ''} placement="right">
              <ListItemButton
                selected={isActive}
                onClick={() => navigate(path)}
                aria-current={isActive ? 'page' : undefined}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  px: collapsed ? 1 : 2,
                  minHeight: 40,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, justifyContent: 'center' }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={label}
                    slotProps={{ primary: { variant: 'body2', fontWeight: isActive ? 700 : 500 } }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      <Divider />

      {/* Logout */}
      <List sx={{ px: collapsed ? 0.5 : 1.5, py: 1 }}>
        <Tooltip title={collapsed ? 'Sair' : ''} placement="right">
          <ListItemButton
            onClick={handleLogout}
            aria-label="Sair do sistema"
            sx={{
              borderRadius: 2,
              justifyContent: collapsed ? 'center' : 'flex-start',
              px: collapsed ? 1 : 2,
              minHeight: 40,
              color: 'error.main',
              '& .MuiListItemIcon-root': { color: 'error.main' },
            }}
          >
            <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, justifyContent: 'center' }}>
              <LogoutOutlinedIcon fontSize="small" />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="Sair"
                slotProps={{ primary: { variant: 'body2', fontWeight: 500 } }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </List>
    </Box>
  );
}

// ─── SideNav ──────────────────────────────────────────────────────────────────

interface SideNavProps {
  drawerWidth: number;
  collapsedWidth: number;
  desktopOpen: boolean;
  mobileOpen: boolean;
  onClose: () => void;
}

export function SideNav({ drawerWidth, collapsedWidth, desktopOpen, mobileOpen, onClose }: SideNavProps) {
  const currentWidth = desktopOpen ? drawerWidth : collapsedWidth;

  return (
    <Box component="nav" aria-label="Menu lateral">
      {/* Mobile: drawer temporário */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <DrawerContent collapsed={false} onClose={onClose} />
      </Drawer>

      {/* Desktop: drawer permanente com collapse */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: currentWidth,
            boxSizing: 'border-box',
            borderRight: 1,
            borderColor: 'divider',
            overflowX: 'hidden',
            transition: 'width 0.2s ease',
          },
        }}
        open
      >
        <DrawerContent collapsed={!desktopOpen} />
      </Drawer>
    </Box>
  );
}
