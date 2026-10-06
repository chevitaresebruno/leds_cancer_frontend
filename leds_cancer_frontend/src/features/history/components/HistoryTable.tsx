import {
  Box,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import type { ExamStatus } from '@/types/dashboard';
import type { HistoryExam } from '@/types/history';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ExamStatus,
  { label: string; color: 'default' | 'primary' | 'warning' | 'success' | 'error' }
> = {
  pendente:   { label: 'Pendente',   color: 'warning' },
  em_analise: { label: 'Em Análise', color: 'primary' },
  concluido:  { label: 'Concluído',  color: 'success' },
  cancelado:  { label: 'Cancelado',  color: 'error'   },
};

export type SortField = 'datetime' | 'patientName' | 'examType' | 'status';
export type SortDirection = 'asc' | 'desc';

// ─── Componente ───────────────────────────────────────────────────────────────

interface HistoryTableProps {
  exams: HistoryExam[];
  page: number;
  rowsPerPage: number;
  sortField: SortField;
  sortDir: SortDirection;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onSort: (field: SortField) => void;
  onViewExam: (exam: HistoryExam) => void;
}

export function HistoryTable({
  exams, page, rowsPerPage, sortField, sortDir,
  onPageChange, onRowsPerPageChange, onSort, onViewExam,
}: HistoryTableProps) {
  const paginated = exams.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const SortCell = ({ field, label }: { field: SortField; label: string }) => (
    <TableCell sortDirection={sortField === field ? sortDir : false}>
      <TableSortLabel
        active={sortField === field}
        direction={sortField === field ? sortDir : 'asc'}
        onClick={() => onSort(field)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );

  return (
    <Box>
      <TableContainer>
        <Table size="small" aria-label="Histórico de exames">
          <TableHead>
            <TableRow sx={{ '& th, & .MuiTableSortLabel-root': { fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.4 } }}>
              <TableCell>ID</TableCell>
              <SortCell field="patientName" label="Paciente" />
              <SortCell field="datetime"    label="Data / Hora" />
              <SortCell field="examType"    label="Tipo de Exame" />
              <TableCell>Radiologista</TableCell>
              <SortCell field="status"      label="Status" />
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Nenhum exame encontrado para os filtros selecionados.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((exam) => {
                const status = STATUS_CONFIG[exam.status as ExamStatus];
                return (
                  <TableRow
                    key={`${exam.id}-${exam.patientId}`}
                    hover
                    sx={{ cursor: 'pointer', '&:last-child td': { borderBottom: 0 } }}
                    onClick={() => onViewExam(exam)}
                  >
                    <TableCell>
                      <Typography variant="caption" fontFamily="monospace" color="text.secondary">
                        {exam.id}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{exam.patientName}</Typography>
                      <Typography variant="caption" color="text.secondary">{exam.patientId}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" noWrap>{exam.datetime}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{exam.examType}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {exam.radiologist}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={status.label}
                        color={status.color}
                        size="small"
                        sx={{ fontWeight: 600, fontSize: '0.72rem', minWidth: 90 }}
                      />
                    </TableCell>

                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="Ver detalhes">
                        <IconButton
                          size="small"
                          aria-label={`Ver detalhes do exame ${exam.id}`}
                          onClick={() => onViewExam(exam)}
                        >
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={exams.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, p) => onPageChange(p)}
        onRowsPerPageChange={(e) => { onRowsPerPageChange(Number(e.target.value)); onPageChange(0); }}
        rowsPerPageOptions={[10, 25, 50]}
        labelRowsPerPage="Linhas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      />
    </Box>
  );
}
