import { useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/dicom', '.dcm'];
const MAX_SIZE_MB = 50;

interface ImageUploadStepProps {
  imageFile: File | null;
  imagePreviewUrl: string | null;
  onFileChange: (file: File | null, previewUrl: string | null) => void;
}

export function ImageUploadStep({ imageFile, imagePreviewUrl, onFileChange }: ImageUploadStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    setError(null);

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Arquivo muito grande. O limite é ${MAX_SIZE_MB}MB.`);
      return;
    }

    const isImage = file.type.startsWith('image/') || file.name.endsWith('.dcm');
    if (!isImage) {
      setError('Formato inválido. Envie imagens JPEG, PNG ou DICOM (.dcm).');
      return;
    }

    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
    onFileChange(file, previewUrl);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleRemove = () => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    onFileChange(null, null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <Stack spacing={2.5}>
      <Typography variant="body2" color="text.secondary">
        Envie a imagem da mamografia. Formatos aceitos: JPEG, PNG e DICOM (.dcm). Tamanho máximo: {MAX_SIZE_MB}MB.
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Área de drop */}
      {!imageFile ? (
        <Box
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Área de upload de imagem"
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          sx={{
            border: 2,
            borderStyle: 'dashed',
            borderColor: dragOver ? 'primary.main' : 'divider',
            borderRadius: 3,
            py: 6,
            px: 3,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: dragOver ? 'primary.50' : 'background.default',
            transition: 'all 0.15s ease',
            '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
          }}
        >
          <CloudUploadOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1.5 }} />
          <Typography variant="body1" fontWeight={600} gutterBottom>
            Arraste a imagem aqui
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            ou clique para selecionar o arquivo
          </Typography>
          <Button variant="outlined" size="small" sx={{ mt: 1.5 }} tabIndex={-1}>
            Selecionar arquivo
          </Button>
        </Box>
      ) : (
        /* Preview */
        <Box
          sx={{
            border: 1,
            borderColor: 'success.main',
            borderRadius: 3,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: 'background.paper',
          }}
        >
          {imagePreviewUrl ? (
            <Box
              component="img"
              src={imagePreviewUrl}
              alt="Preview da mamografia"
              sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }}
            />
          ) : (
            <Box
              sx={{
                width: 80, height: 80, borderRadius: 2, flexShrink: 0,
                bgcolor: 'action.selected', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <ImageOutlinedIcon color="action" />
            </Box>
          )}

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {imageFile.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {(imageFile.size / 1024 / 1024).toFixed(2)} MB
            </Typography>
          </Box>

          <Tooltip title="Remover imagem">
            <IconButton
              size="small"
              color="error"
              onClick={handleRemove}
              aria-label="Remover imagem selecionada"
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        style={{ display: 'none' }}
        onChange={handleInputChange}
        aria-hidden="true"
      />
    </Stack>
  );
}
