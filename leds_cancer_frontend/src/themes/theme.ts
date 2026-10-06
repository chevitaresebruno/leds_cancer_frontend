import { createTheme, type PaletteMode } from '@mui/material';

// Paleta médica: azul institucional + tons neutros limpos
const brandBlue = '#1565C0';
const brandBlueDark = '#0D47A1';

export function buildTheme(mode: PaletteMode) {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: brandBlue,
        dark: brandBlueDark,
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#00897B', // teal médico
        contrastText: '#FFFFFF',
      },
      background: {
        default: mode === 'light' ? '#F4F6F9' : '#0F1923',
        paper: mode === 'light' ? '#FFFFFF' : '#162130',
      },
      error: { main: '#D32F2F' },
      warning: { main: '#F57C00' },
      success: { main: '#2E7D32' },
    },
    typography: {
      fontFamily: `'Segoe UI', system-ui, Roboto, sans-serif`,
      fontSize: 16, // 
      h5:      { fontWeight: 700, fontSize: '1.6rem'  },
      h6:      { fontWeight: 700, fontSize: '1.2rem'  },
      subtitle1: { fontSize: '1.05rem' },
      subtitle2: { fontSize: '0.95rem' },
      body1:   { fontSize: '1rem'      },
      body2:   { fontSize: '0.925rem'  },
      caption: { fontSize: '0.8rem'    },
      overline:{ fontSize: '0.75rem'   },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'small', fullWidth: true },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow:
              mode === 'light'
                ? '0 4px 24px rgba(21,101,192,0.10)'
                : '0 4px 24px rgba(0,0,0,0.40)',
          },
        },
      },
    },
  });
}
