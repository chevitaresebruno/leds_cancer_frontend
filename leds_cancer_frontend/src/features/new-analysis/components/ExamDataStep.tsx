import { Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import type { NewAnalysisFormData, BreastSide, ExamTechnique } from '@/types/analysis';
import { PhysicianAutocomplete } from './PhysicianAutocomplete';

const TECHNIQUES: { value: ExamTechnique; label: string }[] = [
  { value: 'digital',          label: 'Mamografia Digital (2D)' },
  { value: '3d_tomossintese',  label: 'Tomossíntese 3D' },
  { value: 'contraste',        label: 'Mamografia com Contraste' },
];

const BREAST_SIDES: { value: BreastSide; label: string }[] = [
  { value: 'esquerda',  label: 'Mama Esquerda' },
  { value: 'direita',   label: 'Mama Direita' },
  { value: 'bilateral', label: 'Bilateral' },
];

type EditableFields = Pick<
  NewAnalysisFormData,
  'examDate' | 'technique' | 'breastSide' | 'clinicalHistory' | 'requestingPhysician'
>;

interface ExamDataStepProps {
  values: EditableFields;
  onChange: <K extends keyof EditableFields>(field: K, value: EditableFields[K]) => void;
  errors: Partial<Record<keyof EditableFields, string>>;
}

export function ExamDataStep({ values, onChange, errors }: ExamDataStepProps) {
  return (
    <Stack spacing={2.5}>
      <Typography variant="body2" color="text.secondary">
        Preencha os dados clínicos e técnicos do exame antes de enviar para análise.
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Data do Exame"
            type="date"
            value={values.examDate}
            onChange={(e) => onChange('examDate', e.target.value)}
            error={!!errors.examDate}
            helperText={errors.examDate}
            slotProps={{ htmlInput: { 'aria-label': 'Data do exame', max: new Date().toISOString().split('T')[0] } }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Técnica do Exame"
            value={values.technique}
            onChange={(e) => onChange('technique', e.target.value as ExamTechnique)}
            error={!!errors.technique}
            helperText={errors.technique}
            slotProps={{ htmlInput: { 'aria-label': 'Técnica do exame' } }}
          >
            <MenuItem value="" disabled>Selecione...</MenuItem>
            {TECHNIQUES.map((t) => (
              <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Lado Examinado"
            value={values.breastSide}
            onChange={(e) => onChange('breastSide', e.target.value as BreastSide)}
            error={!!errors.breastSide}
            helperText={errors.breastSide}
            slotProps={{ htmlInput: { 'aria-label': 'Lado examinado' } }}
          >
            <MenuItem value="" disabled>Selecione...</MenuItem>
            {BREAST_SIDES.map((s) => (
              <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <PhysicianAutocomplete
            value={values.requestingPhysician}
            onChange={(val) => onChange('requestingPhysician', val)}
            error={!!errors.requestingPhysician}
            helperText={errors.requestingPhysician}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Histórico Clínico / Observações"
            multiline
            minRows={4}
            value={values.clinicalHistory}
            onChange={(e) => onChange('clinicalHistory', e.target.value)}
            placeholder="Descreva sintomas, histórico familiar, procedimentos anteriores..."
            slotProps={{
              htmlInput: { 'aria-label': 'Histórico clínico e observações' },
              input: { sx: { alignItems: 'flex-start' } },
            }}
            sx={{
              '& .MuiInputBase-inputMultiline': {
                resize: 'vertical',
                minHeight: 96,
                overflow: 'auto !important',
              },
            }}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
