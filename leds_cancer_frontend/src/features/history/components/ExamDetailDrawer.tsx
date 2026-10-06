import {
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';
import type { ExamStatus } from '@/types/dashboard';
import type { HistoryExam } from '@/types/history';
import { InfoRow } from '@/components/InfoRow';
import { EXAM_STATUS_CONFIG } from '@/utils/statusConfig';

interface ExamDetailDrawerProps {
  exam: HistoryExam | null;
  open: boolean;
  onClose: () => void;
}

export function ExamDetailDrawer({ exam, open, onClose }: ExamDetailDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100vw', sm: 400 } } }}
    >
      {exam && (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>Detalhes do Exame</Typography>
              <Typography variant="caption" color="text.secondary" fontFamily="monospace">
                {exam.id}
              </Typography>
            </Box>
            <Tooltip title="Fechar">
              <IconButton size="small" onClick={onClose} aria-label="Fechar painel de detalhes">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Corpo */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 3, py: 2.5 }}>
            <Chip
              label={EXAM_STATUS_CONFIG[exam.status as ExamStatus].label}
              color={EXAM_STATUS_CONFIG[exam.status as ExamStatus].color}
              sx={{ mb: 3, fontWeight: 700 }}
            />

            <Typography variant="overline" color="text.secondary" fontWeight={700} display="block" mb={1.5}>
              Dados do Exame
            </Typography>

            <Stack spacing={2} mb={3}>
              <InfoRow icon={<BadgeOutlinedIcon fontSize="small" />} label="ID do Exame" value={exam.id} />
              <InfoRow icon={<CalendarTodayOutlinedIcon fontSize="small" />} label="Data / Hora" value={exam.datetime} />
              <InfoRow icon={<MedicalServicesOutlinedIcon fontSize="small" />} label="Tipo de Exame" value={exam.examType} />
              <InfoRow icon={<LocalHospitalOutlinedIcon fontSize="small" />} label="Lado Examinado" value={exam.breastSide ?? '—'} />
              <InfoRow icon={<PersonOutlineIcon fontSize="small" />} label="Radiologista" value={exam.radiologist} />
              <InfoRow icon={<PersonOutlineIcon fontSize="small" />} label="Médico Solicitante" value={exam.requestingPhysician ?? '—'} />
            </Stack>

            <Divider sx={{ mb: 2.5 }} />

            <Typography variant="overline" color="text.secondary" fontWeight={700} display="block" mb={1.5}>
              Paciente
            </Typography>

            <Stack spacing={2} mb={3}>
              <InfoRow icon={<PersonOutlineIcon fontSize="small" />} label="Nome" value={exam.patientName} />
              <InfoRow icon={<BadgeOutlinedIcon fontSize="small" />} label="ID do Paciente" value={exam.patientId} />
            </Stack>

            {exam.clinicalHistory && (
              <>
                <Divider sx={{ mb: 2.5 }} />
                <Typography variant="overline" color="text.secondary" fontWeight={700} display="block" mb={1.5}>
                  Histórico Clínico
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Box sx={{ color: 'text.secondary', mt: 0.2, flexShrink: 0 }}>
                    <NotesOutlinedIcon fontSize="small" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                    {exam.clinicalHistory}
                  </Typography>
                </Stack>
              </>
            )}
          </Box>
        </Box>
      )}
    </Drawer>
  );
}
