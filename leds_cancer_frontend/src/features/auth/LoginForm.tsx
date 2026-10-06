import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { useLoginForm } from '@/hooks/useAuthForm';
import { useAuth } from '@/contexts/AuthContext';

export function LoginForm() {
  const { values, errors, isSubmitting, setIsSubmitting, handleChange, validate } = useLoginForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(values);
      navigate('/dashboard', { replace: true });
    } catch {
      setSubmitError('Credenciais inválidas. Verifique seu e-mail/CRM e senha.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      {submitError && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {submitError}
        </Alert>
      )}

      <TextField
        label="E-mail ou CRM"
        value={values.identifier}
        onChange={handleChange('identifier')}
        error={!!errors.identifier}
        helperText={errors.identifier}
        autoComplete="username"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlinedIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          },
          htmlInput: { 'aria-label': 'E-mail ou CRM' },
        }}
      />

      <TextField
        label="Senha"
        type={showPassword ? 'text' : 'password'}
        value={values.password}
        onChange={handleChange('password')}
        error={!!errors.password}
        helperText={errors.password}
        autoComplete="current-password"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          },
          htmlInput: { 'aria-label': 'Senha' },
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
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </Button>

      {/* Credencial de teste — sempre visível para avaliação */}
      <Typography variant="caption" color="text.disabled" textAlign="center">
        Acesso de teste: dr.carlos@mammoai.com / senha123
      </Typography>
    </Box>
  );
}
