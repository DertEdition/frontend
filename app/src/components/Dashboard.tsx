import React from 'react';
import { Grid, Card, CardContent, Typography, CardActionArea, Box } from '@mui/material';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import MedicationIcon from '@mui/icons-material/Medication';
import ChatIcon from '@mui/icons-material/Chat';

interface DashboardProps {
  onCardClick: (item: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onCardClick }) => {
  const cards = [
    {
      title: 'BMI Sonuçları',
      description: 'Vücut kitle indeksinizi görüntüleyin',
      icon: <MonitorWeightIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      menuItem: 'BMI Hesaplama',
    },
    {
      title: 'Son Kan Testi',
      description: 'Kan tahlili sonuçlarınız',
      icon: <BloodtypeIcon sx={{ fontSize: 60, color: 'error.main' }} />,
      menuItem: 'Kan Tahlili',
    },
    {
      title: 'Günlük İlaç Planlayıcı',
      description: 'İlaç takip ve hatırlatma',
      icon: <MedicationIcon sx={{ fontSize: 60, color: 'success.main' }} />,
      menuItem: 'İlaç Planlayıcı',
    },
    {
      title: 'ChatBot',
      description: 'Sağlık asistanınızla konuşun',
      icon: <ChatIcon sx={{ fontSize: 60, color: 'info.main' }} />,
      menuItem: 'ChatBot',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Sağlık Panosu
      </Typography>
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 6 }} key={card.title}>
            <Card elevation={3}>
              <CardActionArea onClick={() => onCardClick(card.menuItem)}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    {card.icon}
                  </Box>
                  <Typography variant="h5" component="div" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
