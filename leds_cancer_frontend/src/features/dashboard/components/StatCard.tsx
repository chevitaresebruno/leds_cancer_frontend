import { Box, Card, CardContent, Typography, Stack } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';
import type { StatCardData } from '@/types/dashboard';

interface StatCardProps extends StatCardData {
  Icon: SvgIconComponent;
}

export function StatCard({ title, value, subtitle, color, Icon }: StatCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={500} textTransform="uppercase" letterSpacing={0.5}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} color="text.primary" mt={0.5} lineHeight={1}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.75}>
              {subtitle}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${color}.main`,
              opacity: 0.9,
              flexShrink: 0,
            }}
          >
            <Icon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
