import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { PatientFilters } from './components/PatientFilters';
import { PatientTable } from './components/PatientTable';
import { PatientDetailDrawer } from './components/PatientDetailDrawer';
import { PatientFormModal } from './components/PatientFormModal';
import { usePatients } from '@/hooks/usePatients';
import type { Patient, PatientStatus } from '@/types/patient';

export function PatientsPage() {
  const { patients, isLoading, error, refresh } = usePatients();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PatientStatus | 'todos'>('todos');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null | undefined>(undefined);
  // undefined = modal fechado | null = novo paciente | Patient = edição

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return patients.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.cpf.includes(q) ||
        p.email.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'todos' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [patients, search, statusFilter]);

  const handleSearchChange = (value: string) => { setSearch(value); setPage(0); };
  const handleStatusChange = (value: PatientStatus | 'todos') => { setStatusFilter(value); setPage(0); };

  return (
    <>
      <Stack spacing={3}>
        {/* Cabeçalho */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <PeopleAltOutlinedIcon color="primary" />
            <Box>
              <Typography variant="h5" fontWeight={700}>Pacientes</Typography>
              <Typography variant="body2" color="text.secondary">
                {isLoading ? 'Carregando...' : `${patients.length} pacientes cadastrados`}
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            startIcon={<PersonAddOutlinedIcon />}
            onClick={() => setEditingPatient(null)}
          >
            Novo Paciente
          </Button>
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}

        {/* Card principal */}
        <Card>
          <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
            <PatientFilters
              search={search}
              statusFilter={statusFilter}
              onSearchChange={handleSearchChange}
              onStatusChange={handleStatusChange}
            />
          </Box>

          <Divider />

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <PatientTable
              patients={filtered}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={setPage}
              onRowsPerPageChange={(rows) => { setRowsPerPage(rows); setPage(0); }}
              onViewPatient={setSelectedPatient}
              onEditPatient={(p) => setEditingPatient(p)}
            />
          )}
        </Card>
      </Stack>

      {/* Drawer de detalhes */}
      <PatientDetailDrawer
        patient={selectedPatient}
        open={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />

      {/* Modal de cadastro / edição */}
      <PatientFormModal
        open={editingPatient !== undefined}
        patient={editingPatient ?? null}
        onClose={() => setEditingPatient(undefined)}
        onSaved={refresh}
      />
    </>
  );
}
