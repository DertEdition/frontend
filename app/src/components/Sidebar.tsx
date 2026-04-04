import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Accessibility,
  Biotech,
  Medication,
  Chat,
  Person,
  Logout,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Gösterge Paneli', icon: DashboardIcon },
  { id: 'profile', label: 'Sağlık Bilgilerim', icon: Person },
  { id: 'bodymap', label: 'Vücut Haritası', icon: Accessibility },
  { id: 'blood', label: 'Kan Testleri', icon: Biotech },
  { id: 'medication', label: 'İlaç Takip', icon: Medication },
  { id: 'chat', label: 'AI Sağlık Botu', icon: Chat },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const { user, logout } = useAuth();
  const [logoutOpen, setLogoutOpen] = React.useState(false);

  return (
    <Box
      sx={{
        width: 256,
        flexShrink: 0,
        background: 'linear-gradient(180deg, #0f4c75 0%, #1b6ca8 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'rgba(255,255,255,0.2)',
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                border: '2px solid white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: 'white',
                  borderRadius: '50%',
                }}
              />
            </Box>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            ÇARE
          </Typography>
        </Box>
      </Box>

      {/* User Profile */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          mx: 2,
          mt: 2,
          borderRadius: 2,
          bgcolor: 'rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Avatar
          sx={{
            width: 34,
            height: 34,
            background: 'linear-gradient(135deg, #2196F3 0%, #00BCD4 100%)',
            fontSize: 14,
          }}
        >
          <Person sx={{ fontSize: 18 }} />
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', lineHeight: 1.3, fontSize: '0.8rem' }} noWrap>
            {user?.username || 'User'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.2, fontSize: '0.68rem' }} noWrap>
            {user?.email}
          </Typography>
        </Box>
        <IconButton
          onClick={() => setLogoutOpen(true)}
          size="small"
          sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#ff5252', bgcolor: 'rgba(255,255,255,0.1)' } }}
        >
          <Logout sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      <List sx={{ flex: 1, p: 2 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => onViewChange(item.id)}
                sx={{
                  borderRadius: 2,
                  color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                  bgcolor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                  },
                  boxShadow: isActive ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, px: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#1e293b' }}>Çıkış Yap</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#475569' }}>
            Hesabınızdan çıkış yapmak istediğinize emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setLogoutOpen(false)} sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600 }}>
            İptal
          </Button>
          <Button
            onClick={() => { setLogoutOpen(false); logout(); }}
            variant="contained"
            sx={{ bgcolor: '#ef4444', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#dc2626' } }}
          >
            Çıkış Yap
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
