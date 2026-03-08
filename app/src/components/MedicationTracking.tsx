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
import { useAuth } from '../context/AuthContext';

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
  const { token } = useAuth();

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [todayMedicines, setTodayMedicines] = useState<Medicine[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [newMed, setNewMed] = useState<MedicineRequest>({
    name: '',
    dosage: '',
    dayOfWeek: 'MONDAY',
    time: '08:00',
  });

  // Fetch all medicines
  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL, { headers: authHeaders });
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
      const response = await fetch(`${API_BASE_URL}/today`, { headers: authHeaders });
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
        headers: authHeaders,
        body: JSON.stringify(newMed),
      });

      if (response.ok) {
        const data = await response.json();
        setMedicines([...medicines, data]);
        setSnackbar({ open: true, message: 'Medication added!', severity: 'success' });
        setOpenDialog(false);
        setNewMed({
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
        headers: authHeaders,
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
    <Box sx={{ flexGrow: 1, bgcolor: '#e2e7ef', minHeight: '100vh', p: 2, maxWidth: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>
          Medication Tracking
        </Typography>
      </Box>

      {/* Weekly Calendar */}
      <Card sx={{ mb: 3, borderRadius: 3, border: '1px solid #cbd2dc', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 0.5 }}>
            {DAYS.filter(day => day.key !== 'EVERYDAY').map((day) => {
              const dayMedicines = getMedicinesByDay(day.key);
              const isToday = getCurrentDay() === day.key;

              return (
                <Box key={day.key} sx={{ flex: 1, minWidth: 120 }}>
                  <Box
                    sx={{
                      height: '100%',
                      minHeight: 140,
                      bgcolor: isToday ? '#eff6ff' : 'white',
                      borderRadius: 2.5,
                      border: '1.5px solid',
                      borderColor: isToday ? '#60a5fa' : '#d1d5db',
                      p: 1.5,
                      transition: 'all 0.15s',
                      boxShadow: isToday ? '0 3px 12px rgba(96,165,250,0.25)' : '0 2px 8px rgba(0,0,0,0.08)',
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      sx={{
                        display: 'block',
                        mb: 1.5,
                        color: isToday ? '#1d4ed8' : '#64748b',
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}
                    >
                      {day.label.substring(0, 3)}
                    </Typography>

                    {dayMedicines.length === 0 ? (
                      <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
                        —
                      </Typography>
                    ) : (
                      <Stack spacing={0.75}>
                        {dayMedicines.map((med) => (
                          <Box
                            key={med.id}
                            sx={{
                              bgcolor: isToday ? '#f0f7ff' : '#f8fafc',
                              border: '1px solid',
                              borderColor: isToday ? '#93c5fd' : '#d1d5db',
                              borderRadius: 1.5,
                              px: 1,
                              py: 0.75,
                              transition: 'all 0.15s',
                              '&:hover': { borderColor: '#60a5fa', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
                            }}
                          >
                            <Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.7rem', display: 'block', color: '#334155', lineHeight: 1.3 }}>
                              {med.name}
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                              {formatTime(med.time)}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>

      {/* Today + All Medications side by side */}
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
        {/* Today's Schedule */}
        <Box sx={{ flex: '0 0 340px' }}>
          <Card sx={{ borderRadius: 3, border: '1px solid #cbd2dc', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" fontWeight={600} sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}>
                  Today
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                </Typography>
              </Box>

              {todayMedicines.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <MedicationIcon sx={{ fontSize: 32, color: '#e2e8f0', mb: 1 }} />
                  <Typography variant="body2" color="text.disabled">No medications today</Typography>
                </Box>
              ) : (
                <Stack spacing={1.5}>
                  {todayMedicines.map((med) => (
                    <Box
                      key={med.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1.5,
                        bgcolor: 'white',
                        borderRadius: 2,
                        border: '1.5px solid #dce1e8',
                        boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                        transition: 'all 0.15s',
                        '&:hover': { borderColor: '#93c5fd', boxShadow: '0 3px 12px rgba(0,0,0,0.1)' },
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 2,
                          bgcolor: '#eef2ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <MedicationIcon sx={{ fontSize: 18, color: '#6366f1' }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600} sx={{ color: '#1e293b', lineHeight: 1.3 }}>
                          {med.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                          {med.dosage}
                        </Typography>
                      </Box>
                      <Typography variant="caption" fontWeight={700} sx={{ color: '#475569', bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 1.5, px: 1, py: 0.25, fontSize: '0.7rem' }}>
                        {formatTime(med.time)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* All Medications */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Card sx={{ borderRadius: 3, border: '1px solid #cbd2dc', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" fontWeight={600} sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}>
                  All Medications
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Add sx={{ fontSize: 16 }} />}
                  onClick={() => setOpenDialog(true)}
                  sx={{
                    bgcolor: '#1e293b',
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    px: 2,
                    py: 0.75,
                    borderRadius: 2,
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#334155', boxShadow: 'none' },
                  }}
                >
                  Add
                </Button>
              </Box>

              {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

              {medicines.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <MedicationIcon sx={{ fontSize: 32, color: '#e2e8f0', mb: 1 }} />
                  <Typography variant="body2" color="text.disabled">No medications added yet</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
                  {medicines.map((med) => (
                    <Box
                      key={med.id}
                      sx={{
                        p: 2,
                        bgcolor: 'white',
                        borderRadius: 2.5,
                        border: '1.5px solid #dce1e8',
                        boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                        transition: 'all 0.15s',
                        '&:hover': { borderColor: '#93c5fd', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="body2" fontWeight={700} sx={{ color: '#1e293b', mb: 0.25 }}>
                            {med.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                            {med.dosage}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteMedication(med.id)}
                          sx={{ color: '#cbd5e1', p: 0.5, '&:hover': { color: '#ef4444', bgcolor: '#fef2f2' } }}
                        >
                          <Delete sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#f8fafc', borderRadius: 1.5, px: 1, py: 0.25 }}>
                          <AccessTime sx={{ fontSize: 13, color: '#94a3b8' }} />
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.7rem' }}>
                            {formatTime(med.time)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#f8fafc', borderRadius: 1.5, px: 1, py: 0.25 }}>
                          <CalendarToday sx={{ fontSize: 13, color: '#94a3b8' }} />
                          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
                            {getDayLabel(med.dayOfWeek)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1rem', color: '#1e293b', pb: 0 }}>Add New Medication</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 2 }}>
            <TextField
              label="Medication Name"
              fullWidth
              size="small"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              placeholder="e.g., Aspirin"
            />
            <TextField
              label="Dosage"
              fullWidth
              size="small"
              value={newMed.dosage}
              onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
              placeholder="e.g., 500mg"
            />
            <FormControl fullWidth size="small">
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
              size="small"
              value={newMed.time}
              onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#64748b', textTransform: 'none' }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddMedication}
            disabled={!newMed.name || !newMed.dosage || loading}
            sx={{
              bgcolor: '#1e293b',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#334155', boxShadow: 'none' },
            }}
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
