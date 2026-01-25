import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Badge,
  Avatar,
} from '@mui/material';
import {
  Notifications,
  Settings,
  Person,
} from '@mui/icons-material';

export const Header: React.FC = () => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: 'white',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Welcome back, Sarah
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Here's your health overview for today
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            sx={{
              color: 'text.secondary',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton
            sx={{
              color: 'text.secondary',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Settings />
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              pl: 2,
              borderLeft: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Sarah Johnson
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Patient ID: #12345
              </Typography>
            </Box>
            <Avatar
              sx={{
                bgcolor: 'linear-gradient(135deg, #2196F3 0%, #00BCD4 100%)',
                width: 40,
                height: 40,
              }}
            >
              <Person />
            </Avatar>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
