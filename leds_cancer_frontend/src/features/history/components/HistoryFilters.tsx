import { Grid, InputAdornment, MenuItem, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { ExamStatus } from '@/types/dashboard';

export interface HistoryFilterValues {
  search: string;
  status: ExamStatus | 'todos';
  examType: string;
  period: 'todos' | '7d' | '30d' | '90d' | '365d';
}

interface HistoryFiltersProps {
  values: HistoryFilterValues;
  examTypes: string[];
  onChange: <K extends keyof HistoryFilterValues>(key: K, value: HistoryFilterValues[K]) => void;
}

const STATUS_OPTIONS: { value: ExamStatus | 'todos'; label: string }[] = [
  { value: 'todos',      label: 'Todos os status' },
  { value: 'pendente',   label: 'Pendente'         },
  { value: 'em_analise', label: 'Em Análise'       },
  { value: 'concluido',  label: 'Concluído'        },
  { value: 'cancelado',  label: 'Cancelado'        },
];

const PERIOD_OPTIONS = [
  { value: 'todos', label: 'Qualquer período' },
  { value: '7d',    label: 'Últimos 7 dias'   },
  { value: '30d',   label: 'Últimos 30 dias'  },
  { value: '90d',   label: 'Últimos 90 dias'  },
  { value: '365d',  label: 'Último ano'       },
];

export function HistoryFilters({ values, examTypes, onChange }: HistoryFiltersProps) {
  return (
    // Busca ocupa linha inteira em mobile, metade em sm, e 6 colunas em md+
    // Os 3 selects dividem o espaço restante igualmente
    <Grid container spacing={1.5}>
      {/* Campo de busca — maior, ocupa mais espaço */}
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          placeholder="Buscar por paciente ou ID do exame..."
          value={values.search}
          onChange={(e) => onChange('search', e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
            htmlInput: { 'aria-label': 'Buscar exame' },
          }}
        />
      </Grid>

      {/* Status */}
      <Grid size={{ xs: 12, sm: 4, md: 2 }}>
        <TextField
          select
          fullWidth
          label="Status"
          value={values.status}
          onChange={(e) => onChange('status', e.target.value as ExamStatus | 'todos')}
        >
          {STATUS_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* Tipo de Exame */}
      <Grid size={{ xs: 12, sm: 4, md: 2 }}>
        <TextField
          select
          fullWidth
          label="Tipo de Exame"
          value={values.examType}
          onChange={(e) => onChange('examType', e.target.value)}
        >
          <MenuItem value="todos">Todos os tipos</MenuItem>
          {examTypes.map((t) => (
            <MenuItem key={t} value={t}>{t}</MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* Período */}
      <Grid size={{ xs: 12, sm: 4, md: 2 }}>
        <TextField
          select
          fullWidth
          label="Período"
          value={values.period}
          onChange={(e) => onChange('period', e.target.value as HistoryFilterValues['period'])}
        >
          {PERIOD_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
}
