import { useMemo, useState } from 'react';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Fuse from 'fuse.js';
import { usePhysicians } from '@/hooks/usePhysicians';
import type { Physician } from '@/services/authService';

// ─── Config do Fuse.js ────────────────────────────────────────────────────────

const FUSE_OPTIONS: Fuse.IFuseOptions<Physician> = {
  keys: ['full_name', 'crm'],
  threshold: 0.35,
  distance: 100,
  minMatchCharLength: 1,
};

// O MUI usa esse tipo extra quando freeSolo + createFilterOptions está ativo
type PhysicianOption = Physician | { inputValue: string; full_name: string };

const _filter = createFilterOptions<PhysicianOption>();

// ─── Props ────────────────────────────────────────────────────────────────────

interface PhysicianAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function PhysicianAutocomplete({
  value,
  onChange,
  error,
  helperText,
}: PhysicianAutocompleteProps) {
  const { physicians, isLoading } = usePhysicians();
  const [inputValue, setInputValue] = useState(value);

  // Reconstrói o índice Fuse sempre que a lista da API mudar
  const fuse = useMemo(() => new Fuse(physicians, FUSE_OPTIONS), [physicians]);

  return (
    <Autocomplete<PhysicianOption, false, false, true>
      freeSolo
      loading={isLoading}
      // ─── Valor controlado ───────────────────────────────────────────────
      value={value || null}
      onChange={(_event, newValue) => {
        if (typeof newValue === 'string') {
          onChange(newValue);
        } else if (newValue && 'inputValue' in newValue) {
          // Usuário confirmou um valor livre com Enter
          onChange(newValue.inputValue);
        } else if (newValue && 'full_name' in newValue) {
          onChange((newValue as Physician).full_name);
        } else {
          onChange('');
        }
      }}
      inputValue={inputValue}
      onInputChange={(_event, newInputValue) => {
        setInputValue(newInputValue);
        // Propaga imediatamente — freeSolo não chama onChange ao digitar
        onChange(newInputValue);
      }}
      // ─── Opções com busca fuzzy ──────────────────────────────────────────
      options={physicians as PhysicianOption[]}
      filterOptions={(options, params) => {
        const query = params.inputValue.trim();

        // Busca fuzzy via Fuse.js quando há texto; senão exibe tudo
        const fuzzyResults =
          query.length > 0
            ? (fuse.search(query).map((r) => r.item) as PhysicianOption[])
            : options;

        const filtered = _filter(fuzzyResults, params);

        // Opção "Adicionar X" quando não existe match exato pelo nome
        const exactMatch = physicians.some(
          (p) => p.full_name.toLowerCase() === query.toLowerCase(),
        );

        if (query !== '' && !exactMatch) {
          filtered.push({ inputValue: query, full_name: `Adicionar "${query}"` });
        }

        return filtered;
      }}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        if ('inputValue' in option) return option.inputValue;
        return (option as Physician).full_name;
      }}
      renderOption={(props, option) => {
        const { key, ...rest } = props;

        if ('inputValue' in option) {
          // Opção de valor livre
          return (
            <li key={key} {...rest}>
              {option.full_name}
            </li>
          );
        }

        const physician = option as Physician;
        return (
          <li key={key} {...rest}>
            <span style={{ fontWeight: 500 }}>{physician.full_name}</span>
            {physician.crm && (
              <span style={{ marginLeft: 8, fontSize: '0.8em', opacity: 0.6 }}>
                CRM {physician.crm}
              </span>
            )}
          </li>
        );
      }}
      // ─── Input ──────────────────────────────────────────────────────────
      renderInput={(params) => (
        <TextField
          {...params}
          label="Médico Solicitante"
          error={error}
          helperText={helperText}
          slotProps={{
            htmlInput: {
              ...params.inputProps,
              'aria-label': 'Médico solicitante',
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
    />
  );
}
