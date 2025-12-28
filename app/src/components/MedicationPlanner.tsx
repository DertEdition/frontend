import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
} from '@mui/material';
import MedicationIcon from '@mui/icons-material/Medication';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const MedicationPlanner: React.FC = () => {
  const medications = [
    { name: 'Aspirin', dosage: '100mg', time: '08:00', frequency: 'Günde 1', taken: false },
    { name: 'Vitamin D', dosage: '1000 IU', time: '09:00', frequency: 'Günde 1', taken: true },
    { name: 'Omega-3', dosage: '500mg', time: '20:00', frequency: 'Günde 1', taken: false },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Günlük İlaç Planlayıcı
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Bugünkü İlaç Programınız
      </Typography>
      <Card>
        <CardContent>
          <List>
            {medications.map((med, index) => (
              <React.Fragment key={med.name}>
                <ListItem>
                  <ListItemIcon>
                    <MedicationIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6">{med.name}</Typography>
                        <Chip
                          label={med.taken ? 'Alındı' : 'Bekliyor'}
                          color={med.taken ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Doz: {med.dosage} | {med.frequency}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <AccessTimeIcon fontSize="small" />
                          <Typography variant="body2">{med.time}</Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < medications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MedicationPlanner;
