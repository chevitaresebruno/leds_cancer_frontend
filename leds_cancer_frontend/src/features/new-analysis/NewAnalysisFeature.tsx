import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import AddToPhotosOutlinedIcon from '@mui/icons-material/AddToPhotosOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { PatientSelectStep } from './components/PatientSelectStep';
import { ImageUploadStep } from './components/ImageUploadStep';
import { ExamDataStep } from './components/ExamDataStep';
import { usePatients } from '@/hooks/usePatients';
import { useExams } from '@/contexts/ExamContext';
import type { NewAnalysisFormData, NewAnalysisStep } from '@/types/analysis';
import type { BreastSide, ExamTechnique } from '@/types/analysis';

// ─── Steps config ─────────────────────────────────────────────────────────────

const STEPS = ['Selecionar Paciente', 'Enviar Imagem', 'Dados do Exame'];

// ─── Validação por step ───────────────────────────────────────────────────────

type Step3Fields = Pick<NewAnalysisFormData, 'examDate' | 'technique' | 'breastSide' | 'requestingPhysician'>;
type Step3Errors = Partial<Record<keyof Step3Fields, string>>;

function validateStep(step: NewAnalysisStep, form: NewAnalysisFormData): string | Step3Errors | null {
  if (step === 0 && !form.patientId) return 'Selecione um paciente para continuar.';
  if (step === 1 && !form.imageFile) return 'Envie a imagem da mamografia para continuar.';
  if (step === 2) {
    const errs: Step3Errors = {};
    if (!form.examDate) errs.examDate = 'Data é obrigatória.';
    if (!form.technique) errs.technique = 'Técnica é obrigatória.';
    if (!form.breastSide) errs.breastSide = 'Lado examinado é obrigatório.';
    if (!form.requestingPhysician.trim()) errs.requestingPhysician = 'Médico solicitante é obrigatório.';
    return Object.keys(errs).length ? errs : null;
  }
  return null;
}

// ─── Componente ───────────────────────────────────────────────────────────────

const INITIAL_FORM: NewAnalysisFormData = {
  patientId: '',
  imageFile: null,
  imagePreviewUrl: null,
  examDate: new Date().toISOString().split('T')[0],
  technique: '',
  breastSide: '',
  clinicalHistory: '',
  requestingPhysician: '',
};

export function NewAnalysisFeature() {
  const [activeStep, setActiveStep] = useState<NewAnalysisStep>(0);
  const [form, setForm] = useState<NewAnalysisFormData>(INITIAL_FORM);
  const [stepError, setStepError] = useState<string | null>(null);
  const [step3Errors, setStep3Errors] = useState<Step3Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { submitExam } = useExams();
  const { patients } = usePatients();

  const updateForm = <K extends keyof NewAnalysisFormData>(field: K, value: NewAnalysisFormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setStepError(null);
  };

  const handleNext = () => {
    const error = validateStep(activeStep, form);
    if (error) {
      if (typeof error === 'string') setStepError(error);
      else setStep3Errors(error);
      return;
    }
    setStepError(null);
    setStep3Errors({});
    setActiveStep((s) => (s + 1) as NewAnalysisStep);
  };

  const handleBack = () => {
    setStepError(null);
    setActiveStep((s) => (s - 1) as NewAnalysisStep);
  };

  const handleSubmit = async () => {
    const error = validateStep(2, form);
    if (error) {
      if (typeof error !== 'string') setStep3Errors(error);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const patient = patients.find((p) => String(p.id) === form.patientId);
      await submitExam(form, patient?.name ?? '');
      setSubmitted(true);
    } catch {
      setSubmitError('Erro ao enviar o exame. Verifique os dados e tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setActiveStep(0);
    setSubmitted(false);
    setStepError(null);
    setStep3Errors({});
    setSubmitError(null);
  };

  const selectedPatient = patients.find((p) => String(p.id) === form.patientId);

  // ─── Tela de sucesso ──────────────────────────────────────────────────────

  if (submitted) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '60vh' }} spacing={3}>
        <CheckCircleOutlineIcon sx={{ fontSize: 72, color: 'success.main' }} />
        <Box textAlign="center">
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Análise enviada com sucesso!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            O exame de <strong>{selectedPatient?.name}</strong> foi registrado e está na fila de processamento.
          </Typography>
        </Box>
        <Button variant="contained" onClick={handleReset}>
          Nova Análise
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Cabeçalho */}
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <AddToPhotosOutlinedIcon color="primary" />
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Nova Análise
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Registre um novo exame de mamografia para análise por IA
          </Typography>
        </Box>
      </Stack>

      {/* Card principal */}
      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Erros */}
          {stepError && (
            <Alert severity="warning" sx={{ mb: 2.5, borderRadius: 2 }} onClose={() => setStepError(null)}>
              {stepError}
            </Alert>
          )}
          {submitError && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }} onClose={() => setSubmitError(null)}>
              {submitError}
            </Alert>
          )}

          {/* Conteúdo do step */}
          <Box sx={{ minHeight: 280 }}>
            {activeStep === 0 && (
              <PatientSelectStep
                selectedPatientId={form.patientId}
                onSelect={(id) => updateForm('patientId', id)}
              />
            )}
            {activeStep === 1 && (
              <ImageUploadStep
                imageFile={form.imageFile}
                imagePreviewUrl={form.imagePreviewUrl}
                onFileChange={(file, url) => {
                  updateForm('imageFile', file);
                  updateForm('imagePreviewUrl', url);
                }}
              />
            )}
            {activeStep === 2 && (
              <ExamDataStep
                values={{
                  examDate: form.examDate,
                  technique: form.technique as ExamTechnique | '',
                  breastSide: form.breastSide as BreastSide | '',
                  clinicalHistory: form.clinicalHistory,
                  requestingPhysician: form.requestingPhysician,
                }}
                onChange={(field, value) =>
                  setForm((prev) => ({ ...prev, [field]: value }))
                }
                errors={step3Errors}
              />
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Resumo do paciente selecionado */}
          {selectedPatient && activeStep > 0 && (
            <Box
              sx={{
                mb: 2.5,
                px: 2,
                py: 1.5,
                bgcolor: 'action.hover',
                borderRadius: 2,
                display: 'flex',
                gap: 3,
                flexWrap: 'wrap',
              }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary">Paciente</Typography>
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
            </Box>
          )}

          {/* Navegação */}
          <Stack direction="row" justifyContent="space-between">
            <Button variant="outlined" onClick={handleBack} disabled={activeStep === 0}>
              Voltar
            </Button>

            {activeStep < STEPS.length - 1 ? (
              <Button variant="contained" onClick={handleNext}>
                Próximo
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
              >
                {submitting ? 'Enviando...' : 'Enviar para Análise'}
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
