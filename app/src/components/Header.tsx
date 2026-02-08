import React from 'react';
import { AppBar, Toolbar, Box, Typography, Avatar, Menu, MenuItem } from '@mui/material';
import { Person, Logout } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { keyframes } from '@emotion/react';

// 🏥 Çok daha yavaş ve soft tarama animasyonu (12 saniye)
const scan = keyframes`
  0% { transform: translateX(-100%); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
`;

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => { handleClose(); logout(); };

  // 📈 Yüksek Frekanslı EKG Path (Dokunulmadı)
  const highFreqPath = "M0,50 L30,50 L35,45 L40,55 L45,50 L55,50 L60,10 L70,90 L80,50 L95,50 L105,40 L115,50 L145,50 L150,45 L155,55 L160,50 L170,50 L175,10 L185,90 L195,50 L210,50 L220,40 L230,50 L260,50 L265,45 L270,55 L275,50 L285,50 L290,10 L300,90 L310,50 L325,50 L335,40 L345,50 L375,50 L380,45 L385,55 L390,50 L400,50 L405,10 L415,90 L425,50 L440,50 L450,40 L460,50 L490,50 L495,45 L500,55 L505,50 L515,50 L520,10 L530,90 L540,50 L555,50 L565,40 L575,50 L605,50 L610,45 L615,55 L620,50 L630,50 L635,10 L645,90 L655,50 L670,50 L680,40 L690,50 L720,50 L725,45 L730,55 L735,50 L745,50 L750,10 L760,90 L770,50 L785,50 L795,40 L805,50 L835,50";

  return (
    <AppBar
      position="relative"
      elevation={0}
      sx={{
        bgcolor: '#ffffff',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
        overflow: 'hidden',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 0, minHeight: 88 }}>
        
        {/* 📉 HAREKETLİ KIRMIZI EKG ALANI - SOFT TASARIM */}
        <Box sx={{ flexGrow: 1, height: '88px', position: 'relative', overflow: 'hidden' }}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                // Daha soft kırmızı tonları ve geniş geçiş (fade)
                background: 'linear-gradient(90deg, transparent, rgba(255,50,50,0.02) 40%, rgba(255,0,0,0.3) 85%, rgba(255,0,0,0.6) 100%)',
                animation: `${scan} 16s linear infinite`, // Süre 12 saniyeye çıkarıldı (Daha yavaş)
              },
              // Maske özellikleri - stroke-width 1.5'e çekilerek daha zarif yapıldı
              maskImage: `url("data:image/svg+xml,${encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 100' preserveAspectRatio='none'><path d='${highFreqPath}' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>`
              )}")`,
              maskSize: '100% 100%',
              WebkitMaskImage: `url("data:image/svg+xml,${encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 100' preserveAspectRatio='none'><path d='${highFreqPath}' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>`
              )}")`,
              WebkitMaskSize: '100% 100%',
            }}
          />
        </Box>

        {/* 👤 MAVİ PROFİL KISMI - DOKUNULMADI */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            px: 3,
            height: '60px',
            borderLeft: '1px solid',
            borderColor: 'divider',
            bgcolor: '#ffffff',
            zIndex: 10,
          }}
        >
          <Box sx={{ textAlign: 'right', cursor: 'pointer' }} onClick={handleMenu}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
              {user?.username || 'User'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#2196F3', fontWeight: 500 }}>
              {user?.email}
            </Typography>
          </Box>

          <Avatar
            onClick={handleMenu}
            sx={{
              width: 44,
              height: 44,
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #2196F3 0%, #00BCD4 100%)',
              boxShadow: '0 4px 12px rgba(33, 150, 243, 0.25)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)' }
            }}
          >
            <Person sx={{ color: '#fff' }} />
          </Avatar>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
                sx: { mt: 1.5, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }
            }}
          >
            <MenuItem onClick={handleLogout} sx={{ color: '#ff1744', fontWeight: 500 }}>
              <Logout sx={{ mr: 1.5 }} fontSize="small" />
              Çıkış Yap
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};