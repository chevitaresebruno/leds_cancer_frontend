import {
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import type { Patient } from '@/types/patient';
import { useExams } from '@/contexts/ExamContext';
import { examService } from '@/services/examService';
import { InfoRow } from '@/components/InfoRow';
import { EXAM_STATUS_CONFIG, PATIENT_STATUS_CONFIG } from '@/utils/statusConfig';

// ─── Drawer principal ─────────────────────────────────────────────────────────

interface PatientDetailDrawerProps {
  patient: Patient | null;
  open: boolean;
  onClose: () => void;
}

const DRAWER_WIDTH = 420;

export function PatientDetailDrawer({ patient, open, onClose }: PatientDetailDrawerProps) {
  const { patientExams } = useExams();

  // Busca os exames do paciente via API quando o drawer abre
  useEffect(() => {
    if (!patient || !open) return;
    examService.list({ patient: patient.id }).then((data) => {
      // armazena localmente no componente para exibição
      setLocalExams(data.map((e) => ({
        id: e.id,
        date: e.datetime.split(' ')[0],
        type: e.examType,
        status: e.status as import('@/types/dashboard').ExamStatus,
        radiologist: e.radiologist,
      })));
    }).catch(() => {/* silencia */});
  }, [patient, open]);

  const [localExams, setLocalExams] = useState<import('@/types/patient').PatientExam[]>([]);

  // Prefere dados do contexto se disponíveis, senão usa o que buscou localmente
  const exams = patient
    ? (patientExams[patient.id] ?? localExams ?? patient.exams ?? [])
    : [];
  const totalExams = exams.length;
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100vw', sm: DRAWER_WIDTH } } }}
    >
      {patient && (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                {patient.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {patient.id}
              </Typography>
            </Box>
            <Tooltip title="Fechar">
              <IconButton onClick={onClose} size="small" aria-label="Fechar painel de detalhes">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Corpo com scroll */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 3, py: 2.5 }}>
            {/* Status badge */}
            <Chip
              label={PATIENT_STATUS_CONFIG[patient.status].label}
              color={PATIENT_STATUS_CONFIG[patient.status].color}
              size="small"
              sx={{ mb: 2.5, fontWeight: 600 }}
            />

            {/* Dados pessoais */}
            <Typography variant="overline" color="text.secondary" fontWeight={700} display="block" mb={1.5}>
              Dados Pessoais
            </Typography>

            <Stack spacing={2} mb={3}>
              <InfoRow
                icon={<PersonOutlineIcon fontSize="small" />}
                label="Nome completo"
                value={patient.name}
              />
              <InfoRow
                icon={<CakeOutlinedIcon fontSize="small" />}
                label="Data de nascimento"
                value={`${patient.birthDate} (${patient.age} anos)`}
              />
              <InfoRow
                icon={<BadgeOutlinedIcon fontSize="small" />}
                label="CPF"
                value={patient.cpf}
              />
              <InfoRow
                icon={<PhoneOutlinedIcon fontSize="small" />}
                label="Telefone"
                value={patient.phone}
              />
              <InfoRow
                icon={<EmailOutlinedIcon fontSize="small" />}
                label="E-mail"
                value={patient.email}
              />
            </Stack>

            <Divider sx={{ mb: 2.5 }} />

            {/* Histórico de exames */}
            <Typography variant="overline" color="text.secondary" fontWeight={700} display="block" mb={1.5}>
              Histórico de Exames ({totalExams})
            </Typography>

            {exams.length === 0 ? (
              <Typography variant="body2" color="text.disabled">
                Nenhum exame registrado.
              </Typography>
            ) : (
              <Table size="small" aria-label={`Exames de ${patient.name}`}>
                <TableHead>
                  <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' } }}>
                    <TableCell>Data</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exams.map((exam) => {
                    const cfg = EXAM_STATUS_CONFIG[exam.status];
                    return (
                      <TableRow key={exam.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                        <TableCell>
                          <Typography variant="caption">{exam.date}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">{exam.type}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={cfg.label}
                            color={cfg.color}
                            size="small"
                            sx={{ fontWeight: 600, fontSize: '0.68rem' }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Box>
        </Box>
      )}
    </Drawer>
  );
}
