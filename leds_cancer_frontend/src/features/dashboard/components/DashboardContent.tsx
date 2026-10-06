import { useEffect } from 'react';
import { Grid, Typography, Stack } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { StatCard } from './StatCard';
import { RecentExamsTable } from './RecentExamsTable';
import { useExams } from '@/contexts/ExamContext';
import type { SvgIconComponent } from '@mui/icons-material';

export function DashboardContent() {
  const { stats, refreshExams } = useExams();

  // Recarrega sempre que o dashboard é exibido
  useEffect(() => {
    refreshExams();
  }, [refreshExams]);

  const STAT_CARDS: Array<{
    id: string; title: string; value: number; subtitle: string;
    color: 'primary' | 'secondary' | 'warning' | 'success' | 'error';
    Icon: SvgIconComponent;
  }> = [
    {
      id: 'today-patients', title: 'Pacientes Atendidos Hoje',
      value: stats.todayPatients, subtitle: 'Consultas registradas hoje',
      color: 'primary', Icon: PeopleAltOutlinedIcon,
    },
    {
      id: 'pending-exams', title: 'Exames Pendentes',
      value: stats.pendingExams, subtitle: 'Aguardando análise',
      color: 'warning', Icon: HourglassEmptyOutlinedIcon,
    },
    {
      id: 'monthly-diagnostics', title: 'Diagnósticos no Mês',
      value: stats.monthlyDiagnostics,
      subtitle: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      color: 'secondary', Icon: AssessmentOutlinedIcon,
    },
    {
      id: 'concluded', title: 'Laudos Concluídos Hoje',
      value: stats.concludedToday, subtitle: 'Exames com laudo emitido',
      color: 'success', Icon: CheckCircleOutlineIcon,
    },
  ];

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h5" fontWeight={700}>Dashboard</Typography>
        <Typography variant="body2" color="text.secondary">
          Visão geral do dia —{' '}
          {new Date().toLocaleDateString('pt-BR', {
            weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
          })}
        </Typography>
      </Stack>

      <Grid container spacing={2.5}>
        {STAT_CARDS.map((card) => (
          <Grid key={card.id} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      <RecentExamsTable />
    </Stack>
  );
}
