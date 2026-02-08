import { useState, useEffect } from 'react';
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
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  LinearProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add,
  Delete,
  Medication as MedicationIcon,
  AccessTime,
  CalendarToday,
} from '@mui/icons-material';

type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY' | 'EVERYDAY';

interface Medicine {
  id: number;
  name: string;
  dosage: string;
  dayOfWeek: DayOfWeek;
  time: string;
  createdAt?: string;
}

interface MedicineRequest {
  userId: number;
  name: string;
  dosage: string;
  dayOfWeek: DayOfWeek;
  time: string;
}

const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: 'EVERYDAY', label: 'Every Day' },
  { key: 'MONDAY', label: 'Monday' },
  { key: 'TUESDAY', label: 'Tuesday' },
  { key: 'WEDNESDAY', label: 'Wednesday' },
  { key: 'THURSDAY', label: 'Thursday' },
  { key: 'FRIDAY', label: 'Friday' },
  { key: 'SATURDAY', label: 'Saturday' },
  { key: 'SUNDAY', label: 'Sunday' },
];

const API_BASE_URL = 'http://localhost:8080/api/medicine';


export function MedicationTracking() {
  const userId = 1; // TODO: Get from auth context

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [todayMedicines, setTodayMedicines] = useState<Medicine[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [newMed, setNewMed] = useState<MedicineRequest>({
    userId: userId,
    name: '',
    dosage: '',
    dayOfWeek: 'MONDAY',
    time: '08:00',
  });

  // Fetch all medicines
  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setMedicines(data);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch today's medicines
  const fetchTodayMedicines = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/today/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setTodayMedicines(data);
      }
    } catch (error) {
      console.error('Error fetching today medicines:', error);
    }
  };

  useEffect(() => {
    fetchMedicines();
    fetchTodayMedicines();
  }, []);

  const handleAddMedication = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMed),
      });

      if (response.ok) {
        const data = await response.json();
        setMedicines([...medicines, data]);
        setSnackbar({ open: true, message: 'Medication added!', severity: 'success' });
        setOpenDialog(false);
        setNewMed({
          userId: userId,
          name: '',
          dosage: '',
          dayOfWeek: 'MONDAY',
          time: '08:00',
        });
        fetchTodayMedicines();
      } else {
        setSnackbar({ open: true, message: 'Error occurred', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error occurred', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMedication = async (medicineId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${medicineId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMedicines(medicines.filter((med) => med.id !== medicineId));
        setSnackbar({ open: true, message: 'Medication deleted', severity: 'success' });
        fetchTodayMedicines();
      } else {
        setSnackbar({ open: true, message: 'Error occurred', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error occurred', severity: 'error' });
    }
  };

  const getDayLabel = (day: DayOfWeek) => {
    return DAYS.find(d => d.key === day)?.label || day;
  };

  const getMedicinesByDay = (day: DayOfWeek) => {
    return medicines.filter((med) => med.dayOfWeek === day || med.dayOfWeek === 'EVERYDAY');
  };

  const getCurrentDay = (): DayOfWeek => {
    const today = new Date().getDay();
    const dayMap: { [key: number]: DayOfWeek } = {
      0: 'SUNDAY',
      1: 'MONDAY',
      2: 'TUESDAY',
      3: 'WEDNESDAY',
      4: 'THURSDAY',
      5: 'FRIDAY',
      6: 'SATURDAY',
    };
    return dayMap[today];
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5).replace(':', '.');
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh', p: 2, maxWidth: '100%', overflow: 'hidden' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', color: '#0f4c75' }}>
          <MedicationIcon fontSize="medium" />
          Medication Tracking
        </Typography>
      </Box>

      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: '#0f4c75' }}>
            <CalendarToday sx={{ color: '#0f4c75' }} />
            Weekly Calendar
          </Typography>

          <Box sx={{ display: 'flex', gap: 2.5, overflowX: 'auto', pb: 1 }}>
            {DAYS.filter(day => day.key !== 'EVERYDAY').map((day) => {
              const dayMedicines = getMedicinesByDay(day.key);
              const isToday = getCurrentDay() === day.key;

              return (
                <Box key={day.key} sx={{ flex: '0 0 140px', minWidth: 140 }}>
                  <Card
                    sx={{
                      height: '100%',
                      minHeight: 160,
                      bgcolor: isToday ? '#e3f2fd' : 'grey.50',
                      border: 2,
                      borderColor: isToday ? '#1b6ca8' : 'divider',
                    }}
                  >
                    <CardContent sx={{ p: 1.5 }}>
                      <Box sx={{ mb: 1.5 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={700}
                          color={isToday ? '#0f4c75' : 'text.primary'}
                        >
                          {day.label}
                        </Typography>
                      </Box>

                      {dayMedicines.length === 0 ? (
                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.7rem' }}>
                          No medications
                        </Typography>
                      ) : (
                        <Stack spacing={1}>
                          {dayMedicines.map((med) => (
                            <Card
                              key={med.id}
                              variant="outlined"
                              sx={{
                                bgcolor: 'white',
                                borderColor: '#1b6ca8',
                                borderWidth: 1.5,
                                borderRadius: 1.5,
                                '&:hover': {
                                  bgcolor: '#e3f2fd',
                                  boxShadow: 1,
                                  borderColor: '#0f4c75',
                                },
                              }}
                            >
                              <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                                <Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.75rem', mb: 0.5, display: 'block', color: '#0f4c75' }}>
                                  {med.name}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <AccessTime sx={{ fontSize: 12, color: 'text.secondary' }} />
                                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                    {formatTime(med.time)}
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          ))}
                        </Stack>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 1 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#0f4c75' }}>
              <CalendarToday sx={{ color: '#0f4c75' }} />
              Today's Schedule
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Typography>
          </Box>

          {todayMedicines.length === 0 ? (
            <Alert severity="info">No medications scheduled for today</Alert>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
              {todayMedicines.map((med) => (
                <Card
                  key={med.id}
                  sx={{
                    bgcolor: '#f8fafb',
                    borderRadius: 2,
                    border: '1px solid #e5e7eb',
                    boxShadow: 'none',
                    '&:hover': { borderColor: '#0f4c75' },
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      {/* Medication Info */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: '#0f4c75',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <MedicationIcon sx={{ fontSize: 20, color: 'white' }} />
                        </Box>
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            {med.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {med.dosage}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Time Badge */}
                      <Box
                        sx={{
                          bgcolor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: 2,
                          px: 2,
                          py: 1,
                          textAlign: 'center',
                          alignSelf: 'stretch',
                          mx: 2,
                        }}
                      >
                        <Typography variant="body2" fontWeight={700} sx={{ color: '#0f4c75' }}>
                          {formatTime(med.time)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#0f4c75' }}>
              <CalendarToday sx={{ color: '#0f4c75' }} />
              All Medications
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
              sx={{
                bgcolor: '#0f4c75',
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 2,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#1b6ca8',
                  boxShadow: 'none',
                },
              }}
            >
              Add Medication
            </Button>
          </Box>

          {loading && <LinearProgress sx={{ mb: 2 }} />}

          {medicines.length === 0 ? (
            <Alert severity="info">No medications added yet</Alert>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              {medicines.map((med, index) => {
                // Rotating colors
                const colors = [
                  { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' }, // blue
                  { bg: '#d1fae5', border: '#10b981', text: '#065f46' }, // green
                  { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' }, // yellow
                  { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' }, // red
                  { bg: '#e9d5ff', border: '#a855f7', text: '#6b21a8' }, // purple
                ];
                const colorScheme = colors[index % colors.length];

                return (
                  <Card
                    key={med.id}
                    sx={{
                      bgcolor: colorScheme.bg,
                      borderRadius: 2,
                      border: `2px solid ${colorScheme.border}`,
                      boxShadow: 'none',
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1.5, flex: 1 }}>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 2,
                              bgcolor: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <MedicationIcon sx={{ fontSize: 28, color: colorScheme.border }} />
                          </Box>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5, color: colorScheme.text }}>
                              {med.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: colorScheme.text, opacity: 0.8 }}>
                              {med.dosage}
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteMedication(med.id)}
                          sx={{
                            color: colorScheme.text,
                            bgcolor: 'white',
                            '&:hover': { bgcolor: '#f3f4f6' },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>

                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        pt: 2,
                        borderTop: `1px solid ${colorScheme.border}`,
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTime sx={{ fontSize: 18, color: colorScheme.text }} />
                          <Typography variant="body2" fontWeight={600} sx={{ color: colorScheme.text }}>
                            {formatTime(med.time)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday sx={{ fontSize: 18, color: colorScheme.text }} />
                          <Typography variant="body2" sx={{ color: colorScheme.text }}>
                            {getDayLabel(med.dayOfWeek)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Medication</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Medication Name"
              fullWidth
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              placeholder="e.g., Aspirin"
            />
            <TextField
              label="Dosage"
              fullWidth
              value={newMed.dosage}
              onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
              placeholder="e.g., 500mg"
            />
            <FormControl fullWidth>
              <InputLabel>Which Day?</InputLabel>
              <Select
                value={newMed.dayOfWeek}
                label="Which Day?"
                onChange={(e) => setNewMed({ ...newMed, dayOfWeek: e.target.value as DayOfWeek })}
              >
                {DAYS.map((day) => (
                  <MenuItem key={day.key} value={day.key}>{day.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Time"
              type="time"
              fullWidth
              value={newMed.time}
              onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddMedication}
            disabled={!newMed.name || !newMed.dosage || loading}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
