import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useRegisterForm } from '@/hooks/useAuthForm';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types/auth';

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'medico', label: 'Médico(a)' },
  { value: 'tecnico', label: 'Técnico(a)' },
  { value: 'administrador', label: 'Administrador(a)' },
];

export function RegisterForm() {
  const { values, errors, isSubmitting, setIsSubmitting, handleChange, validate } = useRegisterForm();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register(values);
      setSuccess(true);
    } catch {
      setSubmitError('Não foi possível realizar o cadastro. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <Alert severity="success" sx={{ borderRadius: 2 }}>
        Cadastro realizado! Aguarde a aprovação do administrador para acessar o sistema.
      </Alert>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {submitError && <Alert severity="error" sx={{ borderRadius: 2 }}>{submitError}</Alert>}

      <TextField
        label="Nome Completo"
        value={values.fullName}
        onChange={handleChange('fullName')}
        error={!!errors.fullName}
        helperText={errors.fullName}
        autoComplete="name"
        inputProps={{ 'aria-label': 'Nome completo' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonOutlineIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="E-mail"
        type="email"
        value={values.email}
        onChange={handleChange('email')}
        error={!!errors.email}
        helperText={errors.email}
        autoComplete="email"
        inputProps={{ 'aria-label': 'E-mail' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailOutlinedIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="CRM / Identificação Profissional"
        value={values.crm}
        onChange={handleChange('crm')}
        error={!!errors.crm}
        helperText={errors.crm}
        inputProps={{ 'aria-label': 'CRM ou identificação profissional' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BadgeOutlinedIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        select
        label="Cargo / Função"
        value={values.role}
        onChange={handleChange('role')}
        error={!!errors.role}
        helperText={errors.role}
        inputProps={{ 'aria-label': 'Cargo ou função' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <WorkOutlineIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
        }}
      >
        <MenuItem value="" disabled>Selecione...</MenuItem>
        {ROLE_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
        ))}
      </TextField>

      <TextField
        label="Senha"
        type={showPassword ? 'text' : 'password'}
        value={values.password}
        onChange={handleChange('password')}
        error={!!errors.password}
        helperText={errors.password}
        autoComplete="new-password"
        inputProps={{ 'aria-label': 'Senha' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlinedIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                onClick={() => setShowPassword((prev: boolean) => !prev)}
                edge="end"
                size="small"
              >
                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Confirmar Senha"
        type={showConfirm ? 'text' : 'password'}
        value={values.confirmPassword}
        onChange={handleChange('confirmPassword')}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        autoComplete="new-password"
        inputProps={{ 'aria-label': 'Confirmar senha' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlinedIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showConfirm ? 'Ocultar confirmação' : 'Mostrar confirmação'}
                onClick={() => setShowConfirm((prev: boolean) => !prev)}
                edge="end"
                size="small"
              >
                {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isSubmitting}
        sx={{ mt: 1, py: 1.2 }}
        startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
      >
        {isSubmitting ? 'Cadastrando...' : 'Criar Conta'}
      </Button>
    </Box>
  );
}
