import { useState, useEffect } from 'react';
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { patientService } from '@/services/patientService';
import { formatCpf, formatPhone, brDateToIso, isoDateToBr } from '@/utils/formatters';
import { validateRequired, validateEmail, validateCpf, validatePhone } from '@/utils/validators';
import type { Patient, PatientStatus } from '@/types/patient';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface PatientFormData {
  name: string;
  birth_date: string; // yyyy-MM-dd (input type="date")
  cpf: string;        // formatado: 000.000.000-00
  phone: string;      // formatado: (00) 00000-0000
  email: string;
  status: PatientStatus;
}

type FormErrors = Partial<Record<keyof PatientFormData, string>>;

const EMPTY_FORM: PatientFormData = {
  name: '', birth_date: '', cpf: '', phone: '', email: '', status: 'ativo',
};

function validate(data: PatientFormData): FormErrors {
  const errors: FormErrors = {};
  errors.name       = validateRequired(data.name, 'Nome');
  errors.birth_date = validateRequired(data.birth_date, 'Data de nascimento');
  errors.cpf        = validateCpf(data.cpf);
  errors.phone      = validatePhone(data.phone);
  errors.email      = data.email ? validateEmail(data.email) : undefined;
  // remove chaves sem erro
  return Object.fromEntries(
    Object.entries(errors).filter(([, v]) => v !== undefined),
  ) as FormErrors;
}

interface PatientFormModalProps {
  open: boolean;
  patient?: Patient | null;
  onClose: () => void;
  onSaved: () => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function PatientFormModal({ open, patient, onClose, onSaved }: PatientFormModalProps) {
  const isEditing = !!patient;
  const [form, setForm] = useState<PatientFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(
        patient
          ? {
              name:       patient.name,
              birth_date: brDateToIso(patient.birthDate),
              cpf:        patient.cpf,
              phone:      patient.phone,
              email:      patient.email,
              status:     patient.status,
            }
          : EMPTY_FORM,
      );
      setErrors({});
      setSaveError(null);
    }
  }, [open, patient]);

  const handleChange = (field: keyof PatientFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let value = e.target.value;
    // aplica máscara em tempo real
    if (field === 'cpf')   value = formatCpf(value);
    if (field === 'phone') value = formatPhone(value);
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length) { setErrors(validationErrors); return; }

    setSaving(true);
    setSaveError(null);
    try {
      const payload = { ...form, birth_date: isoDateToBr(form.birth_date) };
      if (isEditing) {
        await patientService.update(String(patient!.id), payload);
      } else {
        await patientService.create(payload as any);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setSaveError(
        err?.response?.data?.cpf?.[0] ??
        err?.response?.data?.detail ??
        'Erro ao salvar paciente. Verifique os dados.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="subtitle1" fontWeight={700}>
          {isEditing ? 'Editar Paciente' : 'Novo Paciente'}
        </Typography>
        <IconButton size="small" onClick={onClose} aria-label="Fechar">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {saveError && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{saveError}</Alert>
        )}

        <Grid container spacing={2} sx={{ pt: 0.5 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth label="Nome Completo *"
              value={form.name}
              onChange={handleChange('name')}
              error={!!errors.name} helperText={errors.name}
              autoFocus
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth label="Data de Nascimento *" type="date"
              value={form.birth_date}
              onChange={handleChange('birth_date')}
              error={!!errors.birth_date} helperText={errors.birth_date}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth label="CPF *"
              value={form.cpf}
              onChange={handleChange('cpf')}
              error={!!errors.cpf} helperText={errors.cpf}
              placeholder="000.000.000-00"
              inputProps={{ maxLength: 14 }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth label="Telefone"
              value={form.phone}
              onChange={handleChange('phone')}
              error={!!errors.phone} helperText={errors.phone}
              placeholder="(00) 00000-0000"
              inputProps={{ maxLength: 15 }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth label="E-mail" type="email"
              value={form.email}
              onChange={handleChange('email')}
              error={!!errors.email} helperText={errors.email}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth select label="Status" value={form.status} onChange={handleChange('status')}>
              <MenuItem value="ativo">Ativo</MenuItem>
              <MenuItem value="inativo">Inativo</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={onClose} disabled={saving}>Cancelar</Button>
        <Button
          variant="contained" onClick={handleSubmit} disabled={saving}
          startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null}
        >
          {saving ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Cadastrar Paciente'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
