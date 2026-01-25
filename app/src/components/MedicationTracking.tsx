import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import {
  Add,
  Delete,
  CheckCircle,
  Schedule,
  Medication as MedicationIcon,
} from '@mui/icons-material';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  time: string[];
  startDate: string;
  endDate?: string;
  notes?: string;
  taken: { [date: string]: boolean };
}

export function MedicationTracking() {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: 1,
      name: 'Parol',
      dosage: '500mg',
      frequency: 'Günde 3 kez',
      time: ['08:00', '14:00', '20:00'],
      startDate: '2026-01-15',
      notes: 'Yemekten sonra alınmalı',
      taken: {},
    },
    {
      id: 2,
      name: 'Vitamin D3',
      dosage: '1000 IU',
      frequency: 'Günde 1 kez',
      time: ['09:00'],
      startDate: '2026-01-10',
      notes: '',
      taken: {},
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: 'Günde 1 kez',
    time: '08:00',
    startDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleAddMedication = () => {
    const medication: Medication = {
      id: Date.now(),
      name: newMed.name,
      dosage: newMed.dosage,
      frequency: newMed.frequency,
      time: [newMed.time],
      startDate: newMed.startDate,
      notes: newMed.notes,
      taken: {},
    };

    setMedications([...medications, medication]);
    setOpenDialog(false);
    setNewMed({
      name: '',
      dosage: '',
      frequency: 'Günde 1 kez',
      time: '08:00',
      startDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  const handleDeleteMedication = (id: number) => {
    setMedications(medications.filter((med) => med.id !== id));
  };

  const handleMarkTaken = (id: number) => {
    const today = new Date().toISOString().split('T')[0];
    setMedications(
      medications.map((med) =>
        med.id === id
          ? { ...med, taken: { ...med.taken, [today]: !med.taken[today] } }
          : med
      )
    );
  };

  const getTodayStatus = (med: Medication) => {
    const today = new Date().toISOString().split('T')[0];
    return med.taken[today] || false;
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'grey.50', minHeight: '100vh', p: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
            💊 İlaç Takibi
          </Typography>
          <Typography variant="body2" color="text.secondary">
            İlaçlarınızı takip edin ve hatırlatma alın
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Yeni İlaç Ekle
        </Button>
      </Box>

      {/* Bugünkü İlaçlar */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.lighter' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          📅 Bugün Alınacak İlaçlar
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {medications.map((med) => (
            <Chip
              key={med.id}
              icon={getTodayStatus(med) ? <CheckCircle /> : <Schedule />}
              label={`${med.name} - ${med.time.join(', ')}`}
              color={getTodayStatus(med) ? 'success' : 'default'}
              onClick={() => handleMarkTaken(med.id)}
            />
          ))}
        </Box>
      </Paper>

      {/* İlaç Listesi */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {medications.map((med) => (
          <Box key={med.id} sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MedicationIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {med.name}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteMedication(med.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Box>

                <List dense>
                  <ListItem disablePadding>
                    <ListItemText
                      primary="Doz"
                      secondary={med.dosage}
                      primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText
                      primary="Sıklık"
                      secondary={med.frequency}
                      primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText
                      primary="Saatler"
                      secondary={med.time.join(', ')}
                      primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText
                      primary="Başlangıç Tarihi"
                      secondary={new Date(med.startDate).toLocaleDateString('tr-TR')}
                      primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                    />
                  </ListItem>
                  {med.notes && (
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Notlar"
                        secondary={med.notes}
                        primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                      />
                    </ListItem>
                  )}
                </List>

                <Button
                  fullWidth
                  variant={getTodayStatus(med) ? 'outlined' : 'contained'}
                  color={getTodayStatus(med) ? 'success' : 'primary'}
                  startIcon={getTodayStatus(med) ? <CheckCircle /> : <Schedule />}
                  onClick={() => handleMarkTaken(med.id)}
                  sx={{ mt: 2 }}
                >
                  {getTodayStatus(med) ? 'Alındı ✓' : 'Alındı Olarak İşaretle'}
                </Button>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Yeni İlaç Ekleme Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni İlaç Ekle</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="İlaç Adı"
              fullWidth
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
            />
            <TextField
              label="Doz (örn: 500mg)"
              fullWidth
              value={newMed.dosage}
              onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Sıklık</InputLabel>
              <Select
                value={newMed.frequency}
                label="Sıklık"
                onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
              >
                <MenuItem value="Günde 1 kez">Günde 1 kez</MenuItem>
                <MenuItem value="Günde 2 kez">Günde 2 kez</MenuItem>
                <MenuItem value="Günde 3 kez">Günde 3 kez</MenuItem>
                <MenuItem value="Günde 4 kez">Günde 4 kez</MenuItem>
                <MenuItem value="Haftada 1 kez">Haftada 1 kez</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Saat"
              type="time"
              fullWidth
              value={newMed.time}
              onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Başlangıç Tarihi"
              type="date"
              fullWidth
              value={newMed.startDate}
              onChange={(e) => setNewMed({ ...newMed, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Notlar"
              fullWidth
              multiline
              rows={2}
              value={newMed.notes}
              onChange={(e) => setNewMed({ ...newMed, notes: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>İptal</Button>
          <Button
            variant="contained"
            onClick={handleAddMedication}
            disabled={!newMed.name || !newMed.dosage}
          >
            Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
