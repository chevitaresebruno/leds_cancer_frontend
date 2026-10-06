import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface NotifEventSettings {
  newExamPending: boolean;
  examConcluded: boolean;
  examCancelled: boolean;
  newPatient: boolean;
}

interface NotifChannelSettings {
  inApp: boolean;
  email: boolean;
}

// ─── Sub-componente toggle row ────────────────────────────────────────────────

function ToggleRow({
  label, description, checked, onChange,
}: {
  label: string; description: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={(e) => onChange(e.target.checked)} size="small" />}
      label={
        <Box sx={{ ml: 0.5 }}>
          <Typography variant="body2" fontWeight={500}>{label}</Typography>
          <Typography variant="caption" color="text.secondary">{description}</Typography>
        </Box>
      }
      labelPlacement="start"
      sx={{ mx: 0, width: '100%', justifyContent: 'space-between', alignItems: 'flex-start', py: 0.5 }}
    />
  );
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function NotificationsTab() {
  const [events, setEvents] = useState<NotifEventSettings>({
    newExamPending: true,
    examConcluded: true,
    examCancelled: false,
    newPatient: false,
  });

  const [channels, setChannels] = useState<NotifChannelSettings>({
    inApp: true,
    email: false,
  });

  const [saved, setSaved] = useState(false);

  const toggleEvent = (key: keyof NotifEventSettings) =>
    setEvents((p) => ({ ...p, [key]: !p[key] }));

  const toggleChannel = (key: keyof NotifChannelSettings) =>
    setChannels((p) => ({ ...p, [key]: !p[key] }));

  const handleSave = async () => {
    await new Promise((r) => setTimeout(r, 500)); // TODO: api.put('/users/me/notifications')
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Stack spacing={4}>
      {saved && <Alert severity="success" sx={{ borderRadius: 2 }}>Preferências de notificação salvas.</Alert>}

      {/* Eventos */}
      <Box>
        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
          <NotificationsNoneOutlinedIcon fontSize="small" color="action" />
          <Typography variant="subtitle2" fontWeight={700}>Eventos</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Escolha quais eventos geram notificações para você.
        </Typography>

        <Stack spacing={1} divider={<Divider />}>
          <ToggleRow
            label="Novo exame pendente"
            description="Notificar quando um exame for registrado e aguardar análise."
            checked={events.newExamPending}
            onChange={() => toggleEvent('newExamPending')}
          />
          <ToggleRow
            label="Laudo concluído"
            description="Notificar quando a análise de um exame for finalizada."
            checked={events.examConcluded}
            onChange={() => toggleEvent('examConcluded')}
          />
          <ToggleRow
            label="Exame cancelado"
            description="Notificar quando um exame for cancelado."
            checked={events.examCancelled}
            onChange={() => toggleEvent('examCancelled')}
          />
          <ToggleRow
            label="Novo paciente cadastrado"
            description="Notificar quando um novo paciente for adicionado ao sistema."
            checked={events.newPatient}
            onChange={() => toggleEvent('newPatient')}
          />
        </Stack>
      </Box>

      <Divider />

      {/* Canais */}
      <Box>
        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
          <EmailOutlinedIcon fontSize="small" color="action" />
          <Typography variant="subtitle2" fontWeight={700}>Canais de Notificação</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Onde você quer receber as notificações.
        </Typography>

        <Stack spacing={1} divider={<Divider />}>
          <ToggleRow
            label="Notificações no sistema"
            description="Exibe alertas diretamente na interface enquanto você estiver logado."
            checked={channels.inApp}
            onChange={() => toggleChannel('inApp')}
          />
          <ToggleRow
            label="Notificações por e-mail"
            description="Envia um e-mail para o endereço cadastrado no seu perfil."
            checked={channels.email}
            onChange={() => toggleChannel('email')}
          />
        </Stack>
      </Box>

      <Button
        variant="contained"
        startIcon={<SaveOutlinedIcon />}
        onClick={handleSave}
        sx={{ alignSelf: 'flex-start' }}
      >
        Salvar Preferências
      </Button>
    </Stack>
  );
}
