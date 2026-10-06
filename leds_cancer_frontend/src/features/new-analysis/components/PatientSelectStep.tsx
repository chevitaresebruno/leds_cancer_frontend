import { useMemo } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Fuse from 'fuse.js';
import { usePatients } from '@/hooks/usePatients';
import type { Patient } from '@/types/patient';

// ─── Config do Fuse.js ────────────────────────────────────────────────────────

const FUSE_OPTIONS: Fuse.IFuseOptions<Patient> = {
  keys: ['name', 'cpf', 'id'],
  threshold: 0.35,
  distance: 100,
  minMatchCharLength: 1,
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface PatientSelectStepProps {
  selectedPatientId: string;
  onSelect: (patientId: string) => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function PatientSelectStep({ selectedPatientId, onSelect }: PatientSelectStepProps) {
  const { patients, isLoading } = usePatients();

  const fuse = useMemo(() => new Fuse(patients, FUSE_OPTIONS), [patients]);

  const selectedPatient = patients.find((p) => String(p.id) === selectedPatientId) ?? null;

  return (
    <Stack spacing={2.5}>
      <Typography variant="body2" color="text.secondary">
        Busque e selecione o paciente para o qual o exame será registrado.
      </Typography>

      <Autocomplete<Patient>
        loading={isLoading}
        value={selectedPatient}
        onChange={(_event, newValue) => {
          onSelect(newValue ? String(newValue.id) : '');
        }}
        options={patients}
        // Busca fuzzy via Fuse.js
        filterOptions={(_options, { inputValue }) => {
          const query = inputValue.trim();
          if (!query) return patients;
          return fuse.search(query).map((r) => r.item);
        }}
        getOptionLabel={(p) => p.name}
        isOptionEqualToValue={(option, val) => String(option.id) === String(val.id)}
        renderOption={(props, patient) => {
          const { key, ...rest } = props;
          return (
            <li key={key} {...rest}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {patient.name}
                    </Typography>
                    <Chip label={`#${patient.id}`} size="small" sx={{ fontSize: '0.68rem', height: 18 }} />
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {patient.cpf} · {patient.age} anos · {patient.totalExams} exame(s)
                  </Typography>
                </Box>
              </Box>
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Buscar paciente"
            placeholder="Nome, CPF ou ID..."
            slotProps={{
              htmlInput: {
                ...params.inputProps,
                'aria-label': 'Buscar paciente',
              },
              input: {
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoading && <CircularProgress color="inherit" size={16} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
        noOptionsText="Nenhum paciente encontrado."
        loadingText="Carregando pacientes..."
      />

      {selectedPatient && (
        <Box
          sx={{
            px: 2,
            py: 1.5,
            bgcolor: 'action.hover',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            display: 'flex',
            gap: 3,
            flexWrap: 'wrap',
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">Paciente selecionado</Typography>
            <Typography variant="body2" fontWeight={600}>{selectedPatient.name}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">CPF</Typography>
            <Typography variant="body2">{selectedPatient.cpf}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Idade</Typography>
            <Typography variant="body2">{selectedPatient.age} anos</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Exames</Typography>
            <Typography variant="body2">{selectedPatient.totalExams} exame(s)</Typography>
          </Box>
        </Box>
      )}
    </Stack>
  );
}
