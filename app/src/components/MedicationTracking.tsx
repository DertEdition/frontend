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
  CircularProgress,
  Divider,
  Chip,
} from '@mui/material';
import {
  Add,
  Delete,
  Medication as MedicationIcon,
  AccessTime,
  CalendarToday,
  CameraAlt,
  AutoAwesome,
  Close,
  SmartToy,
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

interface AnalysisResponse {
  request_id: string;
  success: boolean;
  drug?: {
    name: string;
    active_ingredients: string[];
    dosage_form: string;
    strength: string;
    manufacturer: string;
  } | null;
  explanation: string | null;
  confidence: string;
  warnings: string[] | null;
  disclaimer: string;
  processing_time_ms: number;
  errors?: string[] | null;
}
const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: 'EVERYDAY', label: 'Her Gün' },
  { key: 'MONDAY', label: 'Pazartesi' },
  { key: 'TUESDAY', label: 'Salı' },
  { key: 'WEDNESDAY', label: 'Çarşamba' },
  { key: 'THURSDAY', label: 'Perşembe' },
  { key: 'FRIDAY', label: 'Cuma' },
  { key: 'SATURDAY', label: 'Cumartesi' },
  { key: 'SUNDAY', label: 'Pazar' },
];

const API_BASE_URL = 'http://localhost:8080/api/medicine';
const ANALYZE_URL = 'http://localhost:8082/analyze/upload';

export function MedicationTracking() {
  const { token } = useAuth();
  const authHeaders = { Authorization: `Bearer ${token}` };

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [todayMedicines, setTodayMedicines] = useState<Medicine[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [newMed, setNewMed] = useState<MedicineRequest>({
    name: '',
    dosage: '',
    dayOfWeek: 'MONDAY',
    time: '08:00',
  });

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL, { headers: { ...authHeaders, 'Content-Type': 'application/json' } });
      if (response.ok) setMedicines(await response.json());
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayMedicines = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/today`, { headers: { ...authHeaders, 'Content-Type': 'application/json' } });
      if (response.ok) setTodayMedicines(await response.json());
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchMedicines();
    fetchTodayMedicines();
  }, []);

  const handleAIAnalysis = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setAnalyzing(true);
      const response = await fetch(ANALYZE_URL, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data: AnalysisResponse = await response.json();
        setAnalysisResult(data);
        setShowAnalysisDialog(true);
        if (data.success && data.drug) {
          setNewMed(prev => ({
            ...prev,
            name: data.drug?.name || '',
            dosage: `${data.drug?.strength || ''} ${data.drug?.dosage_form || ''}`.trim()
          }));
        }
      } else {
        setSnackbar({ open: true, message: 'Analiz başarısız oldu.', severity: 'error' });
      }
    } catch (error) {
      console.error('AI Analysis Error:', error);
      setSnackbar({ open: true, message: 'AI servisine bağlanılamadı.', severity: 'error' });
    } finally {
      setAnalyzing(false);
      event.target.value = '';
    }
  };

  const handleAddMedication = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(newMed),
      });

      if (response.ok) {
        const data = await response.json();
        setMedicines([...medicines, data]);
        setSnackbar({ open: true, message: 'Medication added!', severity: 'success' });
        setOpenDialog(false);
        setNewMed({ name: '', dosage: '', dayOfWeek: 'MONDAY', time: '08:00' });
        fetchTodayMedicines();
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error occurred', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMedication = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE', headers: authHeaders });
      if (response.ok) {
        setMedicines(medicines.filter((m) => m.id !== id));
        fetchTodayMedicines();
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
    }
  };

  const getDayLabel = (day: DayOfWeek) => DAYS.find(d => d.key === day)?.label || day;
  const getMedicinesByDay = (day: DayOfWeek) => medicines.filter((m) => m.dayOfWeek === day || m.dayOfWeek === 'EVERYDAY');
  const getCurrentDay = (): DayOfWeek => {
    const dayMap: { [key: number]: DayOfWeek } = { 0: 'SUNDAY', 1: 'MONDAY', 2: 'TUESDAY', 3: 'WEDNESDAY', 4: 'THURSDAY', 5: 'FRIDAY', 6: 'SATURDAY' };
    return dayMap[new Date().getDay()];
  };
  const formatTime = (time: string) => time.substring(0, 5).replace(':', '.');

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', p: { xs: 2, md: 3 }, bgcolor: '#fbfcfd' }}>
      <Card sx={{ mb: 4, borderRadius: 3.5, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
            {DAYS.filter(day => day.key !== 'EVERYDAY').map((day) => {
              const dayMedicines = getMedicinesByDay(day.key);
              const isToday = getCurrentDay() === day.key;
              return (
                <Box key={day.key} sx={{ flex: 1, minWidth: 140 }}>
                  <Box sx={{
                    height: '100%', minHeight: 160, bgcolor: isToday ? '#eff6ff' : 'white',
                    borderRadius: 3, border: '2px solid', borderColor: isToday ? '#60a5fa' : '#f1f5f9',
                    p: 2, transition: 'all 0.2s', boxShadow: isToday ? '0 4px 12px rgba(96,165,250,0.15)' : 'none'
                  }}>
                    <Typography variant="caption" fontWeight={700} sx={{ display: 'block', mb: 2, color: isToday ? '#1d4ed8' : '#64748b', textTransform: 'uppercase' }}>
                      {day.label.substring(0, 3)}
                    </Typography>
                    <Stack spacing={1}>
                      {dayMedicines.map((med) => (
                        <Box key={med.id} sx={{ bgcolor: isToday ? 'white' : '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2, px: 1, py: 0.8 }}>
                          <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.72rem', display: 'block', color: '#334155' }}>{med.name}</Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#94a3b8' }}>{formatTime(med.time)}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: '0 0 350px' }}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" fontWeight={700} sx={{ color: '#64748b', mb: 3, textTransform: 'uppercase' }}>Bugünün Odak Noktası</Typography>
              <Stack spacing={2}>
                {todayMedicines.length === 0 ? (
                  <Typography variant="caption" color="text.disabled">Bugün için görev yok.</Typography>
                ) : (
                  todayMedicines.map((med) => (
                    <Box key={med.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #edf2f7' }}>
                      <MedicationIcon sx={{ color: '#6366f1' }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={700}>{med.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{med.dosage}</Typography>
                      </Box>
                      <Chip label={formatTime(med.time)} size="small" sx={{ fontWeight: 700, bgcolor: 'white', border: '1px solid #e2e8f0' }} />
                    </Box>
                  ))
                )}
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="body2" fontWeight={700} sx={{ color: '#64748b', textTransform: 'uppercase' }}>Tüm İlaçlar</Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    component="label"
                    variant="contained"
                    disabled={analyzing}
                    startIcon={analyzing ? <CircularProgress size={18} color="inherit" /> : <SmartToy sx={{ fontSize: 24 }} />}
                    sx={{
                      bgcolor: '#3b82f6',
                      '&:hover': { bgcolor: '#3b82f6' },
                      borderRadius: 2.5,
                      textTransform: 'none',
                      py: 1.2,
                      px: 3,
                      fontWeight: 500,
                      boxShadow: 'none',
                      '&.Mui-disabled': {
                        bgcolor: '#bfdbfe',
                        color: '#ffffff'
                      }
                    }}
                  >
                    {analyzing ? 'Analiz Ediliyor...' : 'AI ile Analiz Et'}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleAIAnalysis}
                      disabled={analyzing}
                    />
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpenDialog(true)}
                    sx={{ bgcolor: '#1e293b', borderRadius: 2.5, textTransform: 'none', px: 3 }}
                  >
                    Ekle
                  </Button>
                </Stack>
              </Box>

              {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                {medicines.map((med) => (
                  <Box key={med.id} sx={{ p: 2, border: '2px solid #f1f5f9', borderRadius: 3, position: 'relative' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteMedication(med.id)}
                      sx={{ position: 'absolute', top: 8, right: 8, color: '#cbd5e1', '&:hover': { color: '#ef4444' } }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" fontWeight={700} sx={{ pr: 3 }}>{med.name}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>{med.dosage}</Typography>
                    <Stack direction="row" spacing={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#f8fafc', px: 1, py: 0.4, borderRadius: 1.5 }}>
                        <AccessTime sx={{ fontSize: 12, color: '#94a3b8' }} />
                        <Typography variant="caption" fontWeight={600}>{formatTime(med.time)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#f8fafc', px: 1, py: 0.4, borderRadius: 1.5 }}>
                        <CalendarToday sx={{ fontSize: 12, color: '#94a3b8' }} />
                        <Typography variant="caption" fontWeight={600}>{getDayLabel(med.dayOfWeek)}</Typography>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Dialog
        open={showAnalysisDialog}
        onClose={() => setShowAnalysisDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' } }}
      >
        <Box sx={{ p: 3 }}>
          {/* Başlık ve Kapatma */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AutoAwesome sx={{ color: '#3b82f6' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                İlaç Analiz Raporu
              </Typography>
            </Box>
            <IconButton onClick={() => setShowAnalysisDialog(false)} size="small">
              <Close />
            </IconButton>
          </Box>

          {analysisResult?.success && analysisResult.drug ? (
            <Stack spacing={3}>
              {/* İlaç Temel Bilgileri Kartı */}
              <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Typography variant="h5" sx={{ color: '#2563eb', fontWeight: 700, mb: 0.5 }}>
                  {analysisResult.drug.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                  {analysisResult.drug.manufacturer} • {analysisResult.drug.dosage_form}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap gap={1}>
                  <Chip
                    label={`Güven: ${analysisResult.confidence}`}
                    size="small"
                    sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 600 }}
                  />
                  <Chip
                    label={analysisResult.drug.strength}
                    size="small"
                    variant="outlined"
                  />
                </Stack>
              </Box>

              {/* AI Açıklaması (Tertemiz Metin) */}
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, fontSize: '0.7rem', mb: 1, ls: 1 }}>
                  Klinik Değerlendirme
                </Typography>
                <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.7, fontSize: '1rem', whiteSpace: 'pre-line' }}>
                  {(analysisResult.explanation || 'Açıklama mevcut değil.').replace(/[#*]/g, '').trim()}
                </Typography>
              </Box>

              {/* Etkin Maddeler */}
              {(() => {
                let ingredients = analysisResult.drug.active_ingredients || [];
                // If structured list is empty, try to parse from explanation
                if (ingredients.length === 0 && analysisResult.explanation) {
                  const match = analysisResult.explanation.match(/Etkin Madde(?:si|ler[i]?)[\s:]+([^\n]+)/i);
                  if (match) {
                    ingredients = match[1].split(/[,;]/).map((s: string) => s.trim()).filter((s: string) => s.length > 0);
                  }
                }
                return ingredients.length > 0 ? (
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, fontSize: '0.7rem', mb: 1 }}>
                      Etkin Maddeler
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {ingredients.map((ing: string, i: number) => (
                        <Typography key={i} variant="caption" sx={{ bgcolor: '#f1f5f9', px: 1.5, py: 0.5, borderRadius: 5, color: '#475569' }}>
                          {ing}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                ) : null;
              })()}

              {/* Uyarılar (Varsa) */}
              {analysisResult.warnings && analysisResult.warnings.length > 0 && (
                <Box sx={{ p: 2, bgcolor: '#fff1f2', borderRadius: 2, borderLeft: '4px solid #ef4444' }}>
                  <Typography variant="subtitle2" sx={{ color: '#991b1b', fontWeight: 700, mb: 1 }}>
                    Önemli Uyarılar
                  </Typography>
                  {analysisResult.warnings.map((w, i) => (
                    <Typography key={i} variant="caption" display="block" sx={{ color: '#b91c1c', mb: 0.5 }}>
                      • {w}
                    </Typography>
                  ))}
                </Box>
              )}

              {/* Yasal Sorumluluk Reddi */}
              <Typography variant="caption" sx={{ textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', display: 'block', mt: 2 }}>
                {analysisResult.disclaimer}
              </Typography>
            </Stack>
          ) : (
            <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
              Görüntü analiz edilemedi. Lütfen daha net bir fotoğraf deneyin.
            </Alert>
          )}

          {/* Sadece Kapatma Butonu */}
          <Box sx={{ mt: 4, textAlign: 'right' }}>
            <Button
              variant="contained"
              onClick={() => setShowAnalysisDialog(false)}
              sx={{ bgcolor: '#1e293b', textTransform: 'none', px: 4, borderRadius: 2 }}
            >
              Anladım
            </Button>
          </Box>
        </Box>
      </Dialog>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>İlaç Ekle</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField label="İlaç Adı" fullWidth value={newMed.name} onChange={(e) => setNewMed({ ...newMed, name: e.target.value })} />
            <TextField label="Dozaj" fullWidth value={newMed.dosage} onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })} placeholder="örn. 500mg" />
            <FormControl fullWidth>
              <InputLabel>Sıklık</InputLabel>
              <Select value={newMed.dayOfWeek} label="Sıklık" onChange={(e) => setNewMed({ ...newMed, dayOfWeek: e.target.value as DayOfWeek })}>
                {DAYS.map((day) => <MenuItem key={day.key} value={day.key}>{day.label}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Saat" type="time" fullWidth value={newMed.time} onChange={(e) => setNewMed({ ...newMed, time: e.target.value })} InputLabelProps={{ shrink: true }} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)}>İptal</Button>
          <Button variant="contained" onClick={handleAddMedication} disabled={!newMed.name || loading} sx={{ bgcolor: '#1e293b', borderRadius: 2 }}>Kaydet</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}