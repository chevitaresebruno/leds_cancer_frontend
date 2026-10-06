import { InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { PatientStatus } from '@/types/patient';

interface PatientFiltersProps {
  search: string;
  statusFilter: PatientStatus | 'todos';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: PatientStatus | 'todos') => void;
}

export function PatientFilters({
  search,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: PatientFiltersProps) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
      <TextField
        placeholder="Buscar por nome, CPF ou e-mail..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ flexGrow: 1 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          },
          htmlInput: { 'aria-label': 'Buscar paciente' },
        }}
      />

      <TextField
        select
        label="Status"
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as PatientStatus | 'todos')}
        sx={{ minWidth: 140 }}
        slotProps={{ htmlInput: { 'aria-label': 'Filtrar por status' } }}
      >
        <MenuItem value="todos">Todos</MenuItem>
        <MenuItem value="ativo">Ativo</MenuItem>
        <MenuItem value="inativo">Inativo</MenuItem>
      </TextField>
    </Stack>
  );
}
