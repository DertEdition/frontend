import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Height,
  MonitorWeight,
  Straighten,
  Save,
  Favorite,
  FitnessCenter,
} from '@mui/icons-material';
import { saveHealthProfile, getHealthProfile } from '../rest/restOperations';

interface HealthData {
  weight: string;
  height: string;
  waist: string;
  age: string;
  gender: 'MALE' | 'FEMALE' | '';
}

export const HealthProfile: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthData>({
    weight: '',
    height: '',
    waist: '',
    age: '',
    gender: '',
  });

  const [bmi, setBmi] = useState<number | null>(null);
  const [bodyFatPercentage, setBodyFatPercentage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadHealthProfile();
  }, []);

  const loadHealthProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profile = await getHealthProfile();

      if (profile) {
        setHealthData({
          weight: profile.weight.toString(),
          height: profile.height.toString(),
          waist: profile.waist.toString(),
          age: profile.age.toString(),
          gender: profile.gender.toUpperCase() as 'MALE' | 'FEMALE',
        });
        setBmi(profile.bmi);
        setBodyFatPercentage(profile.bodyFatPercentage);
      }
    } catch (err: any) {
      if (err.response?.status !== 404) {
        setError(err.message || 'Veriler yüklenemedi');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof HealthData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    // Negatif sayı girişini engelle (Karakter bazlı kontrol)
    if (['weight', 'height', 'waist', 'age'].includes(field)) {
      if (parseFloat(value) < 0) return;
    }

    setHealthData({ ...healthData, [field]: value });
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Zayıf', color: '#fbbf24' };
    if (bmi < 25) return { text: 'Normal', color: '#10b981' };
    if (bmi < 30) return { text: 'Fazla Kilolu', color: '#f59e0b' };
    return { text: 'Obez', color: '#ef4444' };
  };

  const getBodyFatCategory = (bodyFat: number, gender: string) => {
    if (gender === 'MALE') {
      if (bodyFat < 6) return { text: 'Çok Düşük', color: '#fbbf24' };
      if (bodyFat < 14) return { text: 'Atletik', color: '#10b981' };
      if (bodyFat < 18) return { text: 'Fitness', color: '#10b981' };
      if (bodyFat < 25) return { text: 'Normal', color: '#3b82f6' };
      return { text: 'Yüksek', color: '#ef4444' };
    } else {
      if (bodyFat < 14) return { text: 'Çok Düşük', color: '#fbbf24' };
      if (bodyFat < 21) return { text: 'Atletik', color: '#10b981' };
      if (bodyFat < 25) return { text: 'Fitness', color: '#10b981' };
      if (bodyFat < 32) return { text: 'Normal', color: '#3b82f6' };
      return { text: 'Yüksek', color: '#ef4444' };
    }
  };

  const handleSave = async () => {
    const { weight, height, waist, age, gender } = healthData;

    // Boş alan kontrolü
    if (!weight || !height || !waist || !age || !gender) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    // Tip dönüşümleri
    const nWeight = parseFloat(weight);
    const nHeight = parseFloat(height);
    const nWaist = parseFloat(waist);
    const nAge = parseInt(age);

    // Mantıksal Sınır Kontrolleri (Validation)
    if (nAge <= 0 || nAge > 120) {
      setError('Lütfen geçerli bir yaş giriniz (1-120)');
      return;
    }
    if (nHeight < 50 || nHeight > 250) {
      setError('Lütfen geçerli bir boy giriniz (50-250 cm)');
      return;
    }
    if (nWeight < 20 || nWeight > 400) {
      setError('Lütfen geçerli bir kilo giriniz (20-400 kg)');
      return;
    }
    if (nWaist < 30 || nWaist > 200) {
      setError('Lütfen geçerli bir bel ölçüsü giriniz (30-200 cm)');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const profileData = {
        weight: nWeight,
        height: nHeight,
        waist: nWaist,
        age: nAge,
        gender: gender.toUpperCase() as 'MALE' | 'FEMALE',
      };

      const response = await saveHealthProfile(profileData);

      setBmi(response.bmi);
      setBodyFatPercentage(response.bodyFatPercentage);
      setSuccess('Bilgileriniz başarıyla kaydedildi!');

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Bilgiler kaydedilirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ flex: 1, bgcolor: '#f5f5f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, bgcolor: '#f5f5f5', minHeight: '100vh', p: 2 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}

        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3, border: '1px solid #e5e7eb' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2.5, color: '#1f2937', fontSize: '1.05rem' }}>
            Sağlık Profili Ölçümlerim
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 2 }}>
            <TextField
              fullWidth label="Kilo (kg)" type="number" value={healthData.weight} onChange={handleInputChange('weight')}
              size="small"
              inputProps={{ min: 20, max: 400, step: 0.1 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><MonitorWeight sx={{ color: '#6b7280', fontSize: 20 }} /></InputAdornment> }}
            />
            <TextField
              fullWidth label="Boy (cm)" type="number" value={healthData.height} onChange={handleInputChange('height')}
              size="small"
              inputProps={{ min: 50, max: 250 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Height sx={{ color: '#6b7280', fontSize: 20 }} /></InputAdornment> }}
            />
            <TextField
              fullWidth label="Bel Ölçüsü (cm)" type="number" value={healthData.waist} onChange={handleInputChange('waist')}
              size="small"
              inputProps={{ min: 30, max: 200, step: 0.1 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Straighten sx={{ color: '#6b7280', fontSize: 20 }} /></InputAdornment> }}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 200px' }, gap: 2, alignItems: 'end' }}>
            <TextField 
              fullWidth label="Yaş" type="number" value={healthData.age} onChange={handleInputChange('age')} 
              size="small" 
              inputProps={{ min: 1, max: 120 }}
            />
            <TextField
              select
              fullWidth
              label="Cinsiyet"
              value={healthData.gender}
              onChange={handleInputChange('gender')}
              size="small"
              InputLabelProps={{ shrink: true }}
              SelectProps={{ native: true }}
            >
              <option value="" disabled>Seçiniz</option>
              <option value="MALE">Erkek</option>
              <option value="FEMALE">Kadın</option>
            </TextField>

            <Button
              variant="contained" 
              startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save sx={{ fontSize: 18 }} />}
              onClick={handleSave} 
              disabled={saving}
              sx={{ bgcolor: '#3b82f6', py: 1.1, borderRadius: 2, textTransform: 'none', fontWeight: 500, fontSize: '0.9rem', '&:hover': { bgcolor: '#2563eb' } }}
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet & Hesapla'}
            </Button>
          </Box>
        </Paper>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {/* BMI Card */}
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3, border: '1px solid #e5e7eb' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937', fontSize: '1.1rem' }}>BMI İndeksi</Typography>
            </Box>

            {bmi !== null ? (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#1f2937' }}>{bmi}</Typography>
                  <Typography variant="body1" sx={{ color: getBMICategory(bmi).color, fontWeight: 700 }}>{getBMICategory(bmi).text}</Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mb: 3 }}>
                  Boy: {healthData.height}cm | Kilo: {healthData.weight}kg
                </Typography>

                <Box sx={{ mt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500, fontSize: '0.7rem' }}>Zayıf</Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500, fontSize: '0.7rem' }}>Fazla Kilolu</Typography>
                  </Box>
                  <Box sx={{ position: 'relative', height: 12, bgcolor: '#f3f4f6', borderRadius: 2, overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}>
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex' }}>
                      <Box sx={{ width: '46.25%', bgcolor: '#93c5fd' }} /> {/* 18.5'e kadar */}
                      <Box sx={{ width: '16.25%', bgcolor: '#86efac' }} /> {/* 25'e kadar */}
                      <Box sx={{ width: '12.5%', bgcolor: '#fde047' }} />  {/* 30'a kadar */}
                      <Box sx={{ width: '25%', bgcolor: '#fca5a5' }} />    {/* 40+'a kadar */}
                    </Box>
                    <Box sx={{ position: 'absolute', top: -1, bottom: -1, width: 4, bgcolor: '#1f2937', left: `${Math.min((bmi / 40) * 100, 100)}%`, transition: 'left 0.5s ease-in-out', borderRadius: 2, zIndex: 2 }} />
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}><MonitorWeight sx={{ fontSize: 64, color: '#d1d5db' }} /></Box>
            )}
          </Paper>

          {/* Vücut Yağ Oranı Card */}
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3, border: '1px solid #e5e7eb' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937', fontSize: '1.1rem' }}>Vücut Yağ Oranı</Typography>
            </Box>

            {bodyFatPercentage !== null ? (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#1f2937' }}>%{bodyFatPercentage}</Typography>
                  <Typography variant="body1" sx={{ color: getBodyFatCategory(bodyFatPercentage, healthData.gender).color, fontWeight: 700 }}>
                    {getBodyFatCategory(bodyFatPercentage, healthData.gender).text}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mb: 3 }}>
                  {healthData.gender === 'MALE' ? 'Erkek' : 'Kadın'} | Yaş: {healthData.age}
                </Typography>

                <Box sx={{ mt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500, fontSize: '0.7rem' }}>Atletik</Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600, fontSize: '0.7rem' }}>Yüksek</Typography>
                  </Box>
                  <Box sx={{ position: 'relative', height: 12, bgcolor: '#f3f4f6', borderRadius: 2, overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}>
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex' }}>
                      {healthData.gender === 'MALE' ? (
                        <>
                          <Box sx={{ width: '28%', bgcolor: '#86efac' }} />
                          <Box sx={{ width: '8%', bgcolor: '#a7f3d0' }} />
                          <Box sx={{ width: '14%', bgcolor: '#93c5fd' }} />
                          <Box sx={{ width: '50%', bgcolor: '#fca5a5' }} />
                        </>
                      ) : (
                        <>
                          <Box sx={{ width: '28%', bgcolor: '#e5e7eb' }} />
                          <Box sx={{ width: '14%', bgcolor: '#86efac' }} />
                          <Box sx={{ width: '8%', bgcolor: '#a7f3d0' }} />
                          <Box sx={{ width: '14%', bgcolor: '#93c5fd' }} />
                          <Box sx={{ width: '36%', bgcolor: '#fca5a5' }} />
                        </>
                      )}
                    </Box>
                    <Box sx={{ position: 'absolute', top: -1, bottom: -1, width: 4, bgcolor: '#1f2937', left: `${Math.min((bodyFatPercentage / 50) * 100, 100)}%`, transition: 'left 0.5s ease-in-out', borderRadius: 2, zIndex: 2 }} />
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}><FitnessCenter sx={{ fontSize: 64, color: '#d1d5db' }} /></Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};