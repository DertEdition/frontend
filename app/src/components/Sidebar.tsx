import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Accessibility,
  Biotech,
  MedicalServices,
  Medication,
  Chat
} from '@mui/icons-material';

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
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'bodymap', label: 'Body Map', icon: Accessibility },
  { id: 'blood', label: 'Blood Tests', icon: Biotech },
  { id: 'mri', label: 'MRI Results', icon: MedicalServices },
  { id: 'medication', label: 'Medication Tracking', icon: Medication },
  { id: 'chat', label: 'AI Health Chat', icon: Chat },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 256,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 256,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #0f4c75 0%, #1b6ca8 100%)',
          color: 'white',
          borderRight: 'none',
        },
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
            HealthHub
          </Typography>
        </Box>
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

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
          © 2024 HealthHub
        </Typography>
      </Box>
    </Drawer>
  );
};
