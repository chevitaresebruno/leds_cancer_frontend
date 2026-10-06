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
  Tooltip,
  Typography,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import type { Patient } from '@/types/patient';
import { PATIENT_STATUS_CONFIG } from '@/utils/statusConfig';

// ─── Componente ───────────────────────────────────────────────────────────────

interface PatientTableProps {
  patients: Patient[];
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onViewPatient: (patient: Patient) => void;
  onEditPatient: (patient: Patient) => void;
}

export function PatientTable({
  patients,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onViewPatient,
  onEditPatient,
}: PatientTableProps) {
  const paginated = patients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <TableContainer>
        <Table size="small" aria-label="Tabela de pacientes">
          <TableHead>
            <TableRow
              sx={{
                '& th': {
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: 0.4,
                  whiteSpace: 'nowrap',
                },
              }}
            >
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Idade</TableCell>
              <TableCell>CPF</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Último Exame</TableCell>
              <TableCell align="center">Exames</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Nenhum paciente encontrado.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((patient) => {
                const status = PATIENT_STATUS_CONFIG[patient.status];
                return (
                  <TableRow
                    key={patient.id}
                    hover
                    sx={{ cursor: 'pointer', '&:last-child td': { borderBottom: 0 } }}
                    onClick={() => onViewPatient(patient)}
                  >
                    <TableCell>
                      <Typography variant="caption" fontFamily="monospace" color="text.secondary">
                        {patient.id}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {patient.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {patient.email}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{patient.age} anos</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {patient.cpf}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{patient.phone}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color={patient.lastExam ? 'text.primary' : 'text.disabled'}>
                        {patient.lastExam ?? 'Sem exames'}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={600}>
                        {patient.totalExams}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={status.label}
                        color={status.color}
                        size="small"
                        sx={{ fontWeight: 600, fontSize: '0.72rem', minWidth: 70 }}
                      />
                    </TableCell>

                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="Ver detalhes">
                        <IconButton
                          size="small"
                          aria-label={`Ver detalhes de ${patient.name}`}
                          onClick={() => onViewPatient(patient)}
                        >
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar paciente">
                        <IconButton
                          size="small"
                          aria-label={`Editar ${patient.name}`}
                          onClick={() => onEditPatient(patient)}
                        >
                          <EditOutlinedIcon fontSize="small" />
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
        count={patients.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, p) => onPageChange(p)}
        onRowsPerPageChange={(e) => onRowsPerPageChange(Number(e.target.value))}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Linhas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      />
    </Box>
  );
}
