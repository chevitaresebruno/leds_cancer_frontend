import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// ─── Dados mock de logs de acesso ─────────────────────────────────────────────

const ACCESS_LOGS = [
  { id: 1, datetime: '15/06/2026 08:02', action: 'Login',          ip: '192.168.1.10', device: 'Chrome / Windows' },
  { id: 2, datetime: '14/06/2026 17:45', action: 'Logout',         ip: '192.168.1.10', device: 'Chrome / Windows' },
  { id: 3, datetime: '14/06/2026 08:11', action: 'Login',          ip: '192.168.1.10', device: 'Chrome / Windows' },
  { id: 4, datetime: '13/06/2026 16:30', action: 'Alterou senha',  ip: '10.0.0.5',     device: 'Firefox / Linux'  },
  { id: 5, datetime: '13/06/2026 08:05', action: 'Login',          ip: '10.0.0.5',     device: 'Firefox / Linux'  },
];

// ─── Componente ───────────────────────────────────────────────────────────────

export function SecurityTab() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [timeoutSaved, setTimeoutSaved] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  const handleTimeoutSave = async () => {
    await new Promise((r) => setTimeout(r, 400)); // TODO: api.put('/users/me/session')
    setTimeoutSaved(true);
    setTimeout(() => setTimeoutSaved(false), 3000);
  };

  const handleDeactivate = () => {
    setDeactivateOpen(false);
    logout();
    navigate('/auth', { replace: true });
  };

  return (
    <Stack spacing={4}>
      {/* Versão do sistema */}
      <Box>
        <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
          <ShieldOutlinedIcon fontSize="small" color="action" />
          <Typography variant="subtitle2" fontWeight={700}>Informações do Sistema</Typography>
        </Stack>
        <Stack direction="row" spacing={3} flexWrap="wrap">
          {[
            { label: 'Versão',    value: 'MammoAI v1.0.0-beta' },
            { label: 'Ambiente', value: 'Desenvolvimento'       },
            { label: 'Build',    value: 'Jun 2026'              },
          ].map(({ label, value }) => (
            <Box key={label}>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
              <Typography variant="body2" fontWeight={600}>{value}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      <Divider />

      {/* Timeout de sessão */}
      <Box>
        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
          <AccessTimeOutlinedIcon fontSize="small" color="action" />
          <Typography variant="subtitle2" fontWeight={700}>Timeout de Sessão</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Tempo de inatividade antes de encerrar a sessão automaticamente.
        </Typography>

        {timeoutSaved && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>Configuração de sessão salva.</Alert>
        )}

        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            select
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(e.target.value)}
            sx={{ minWidth: 200 }}
            label="Encerrar sessão após"
          >
            <MenuItem value="15">15 minutos</MenuItem>
            <MenuItem value="30">30 minutos</MenuItem>
            <MenuItem value="60">1 hora</MenuItem>
            <MenuItem value="120">2 horas</MenuItem>
            <MenuItem value="0">Nunca (não recomendado)</MenuItem>
          </TextField>
          <Button variant="outlined" onClick={handleTimeoutSave}>Salvar</Button>
        </Stack>
      </Box>

      <Divider />

      {/* Logs de acesso */}
      <Box>
        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
          <HistoryOutlinedIcon fontSize="small" color="action" />
          <Typography variant="subtitle2" fontWeight={700}>Logs de Acesso</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Últimas atividades registradas na sua conta.
        </Typography>

        <TableContainer sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' } }}>
                <TableCell>Data / Hora</TableCell>
                <TableCell>Ação</TableCell>
                <TableCell>IP</TableCell>
                <TableCell>Dispositivo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ACCESS_LOGS.map((log) => (
                <TableRow key={log.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell>
                    <Typography variant="caption" fontFamily="monospace">{log.datetime}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.action}
                      size="small"
                      color={log.action === 'Login' ? 'success' : log.action === 'Logout' ? 'default' : 'warning'}
                      sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" fontFamily="monospace">{log.ip}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">{log.device}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Divider />

      {/* Zona de perigo */}
      <Box
        sx={{ border: 1, borderColor: 'error.main', borderRadius: 2, p: 2.5 }}
      >
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          <WarningAmberOutlinedIcon fontSize="small" color="error" />
          <Typography variant="subtitle2" fontWeight={700} color="error.main">Zona de Perigo</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Ações irreversíveis. Prossiga com cuidado.
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setDeactivateOpen(true)}
        >
          Desativar minha conta
        </Button>
      </Box>

      {/* Dialog de confirmação */}
      <Dialog open={deactivateOpen} onClose={() => setDeactivateOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Desativar conta?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta ação encerrará sua sessão e sinalizará sua conta para desativação. Um administrador
            precisará reativá-la. Deseja continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeactivateOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDeactivate}>
            Sim, desativar
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
