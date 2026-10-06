import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import { HistoryFilters } from './components/HistoryFilters';
import { HistoryTable } from './components/HistoryTable';
import { ExamDetailDrawer } from './components/ExamDetailDrawer';
import { useHistory } from '@/hooks/useHistory';
import { parseBrDate } from '@/utils/formatters';
import type { HistoryExam } from '@/types/history';
import type { HistoryFilterValues } from './components/HistoryFilters';
import type { SortField, SortDirection } from './components/HistoryTable';

// ─── Tipo re-exportado para compatibilidade ───────────────────────────────────
export type { HistoryExam } from '@/types/history';

// ─── Helpers (parseBrDate vem de @/utils/formatters) ─────────────────────────

function isWithinPeriod(dateStr: string, period: HistoryFilterValues['period']): boolean {
  if (period === 'todos') return true;
  const days = { '7d': 7, '30d': 30, '90d': 90, '365d': 365 }[period];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return parseBrDate(dateStr) >= cutoff;
}

function sortExams(exams: HistoryExam[], field: SortField, dir: SortDirection): HistoryExam[] {
  return [...exams].sort((a, b) => {
    let cmp = 0;
    if (field === 'datetime') {
      cmp = parseBrDate(a.datetime).getTime() - parseBrDate(b.datetime).getTime();
    } else {
      cmp = a[field].localeCompare(b[field], 'pt-BR');
    }
    return dir === 'asc' ? cmp : -cmp;
  });
}

// ─── Componente principal ─────────────────────────────────────────────────────

const INITIAL_FILTERS: HistoryFilterValues = {
  search: '', status: 'todos', examType: 'todos', period: 'todos',
};

export function HistoryFeature() {
  const { exams, isLoading, error } = useHistory();

  const [filters, setFilters] = useState<HistoryFilterValues>(INITIAL_FILTERS);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('datetime');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [selectedExam, setSelectedExam] = useState<HistoryExam | null>(null);

  const examTypes = useMemo(
    () => [...new Set(exams.map((e) => e.examType))].sort(),
    [exams],
  );

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase().trim();
    const list = exams.filter((exam) => {
      if (q && !exam.patientName.toLowerCase().includes(q) && !exam.id.toLowerCase().includes(q)) return false;
      if (filters.status !== 'todos' && exam.status !== filters.status) return false;
      if (filters.examType !== 'todos' && exam.examType !== filters.examType) return false;
      if (!isWithinPeriod(exam.datetime, filters.period)) return false;
      return true;
    });
    return sortExams(list, sortField, sortDir);
  }, [exams, filters, sortField, sortDir]);

  const handleFilterChange = <K extends keyof HistoryFilterValues>(
    key: K,
    value: HistoryFilterValues[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleSort = (field: SortField) => {
    setSortDir((prev) => (sortField === field && prev === 'asc' ? 'desc' : 'asc'));
    setSortField(field);
    setPage(0);
  };

  return (
    <>
      <Stack spacing={3}>
        {/* Cabeçalho */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <HistoryOutlinedIcon color="primary" />
          <Box>
            <Typography variant="h5" fontWeight={700}>Histórico de Exames</Typography>
            <Typography variant="body2" color="text.secondary">
              {isLoading ? 'Carregando...' : `${exams.length} exame(s) registrado(s) no sistema`}
            </Typography>
          </Box>
        </Stack>

        {/* Erro */}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Card principal */}
        <Card>
          <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
            <HistoryFilters
              values={filters}
              examTypes={examTypes}
              onChange={handleFilterChange}
            />
          </Box>

          <Divider />

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <HistoryTable
              exams={filtered}
              page={page}
              rowsPerPage={rowsPerPage}
              sortField={sortField}
              sortDir={sortDir}
              onPageChange={setPage}
              onRowsPerPageChange={setRowsPerPage}
              onSort={handleSort}
              onViewExam={setSelectedExam}
            />
          )}
        </Card>
      </Stack>

      <ExamDetailDrawer
        exam={selectedExam}
        open={!!selectedExam}
        onClose={() => setSelectedExam(null)}
      />
    </>
  );
}
