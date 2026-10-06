import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { SideNav } from './SideNav';

const DRAWER_WIDTH = 240;
const DRAWER_COLLAPSED_WIDTH = 64;

export function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  const effectiveWidth = desktopOpen ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppHeader
        drawerWidth={effectiveWidth}
        onMenuToggle={() => {
          // Mobile: toggle temporário; Desktop: collapse/expand
          if (window.innerWidth < 900) {
            setMobileOpen((v) => !v);
          } else {
            setDesktopOpen((v) => !v);
          }
        }}
      />

      <SideNav
        drawerWidth={DRAWER_WIDTH}
        collapsedWidth={DRAWER_COLLAPSED_WIDTH}
        desktopOpen={desktopOpen}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          width: { md: `calc(100% - ${effectiveWidth}px)` },
          ml: { md: `${effectiveWidth}px` },
          transition: 'margin 0.2s ease, width 0.2s ease',
        }}
      >
        <Toolbar sx={{ minHeight: 56 }} />
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
