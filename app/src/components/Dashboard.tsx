import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Chip, Skeleton } from '@mui/material';
import {
  FitnessCenter,
  Biotech,
  Medication,
  TrendingUp,
  TrendingDown,
  AccessTime,
  Warning,
  CheckCircle,
  Favorite,
  MonitorWeight,
  Person,
  Height,
  Straighten,
} from '@mui/icons-material';
import { getHealthProfile, getBloodTests, type HealthProfileResponse, type BloodTestRecord } from '../rest/restOperations';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:8080/api/medicine';

interface Medicine {
  id: number;
  name: string;
  dosage: string;
  dayOfWeek: string;
  time: string;
}

export function Dashboard() {
  const { token } = useAuth();
  const [healthProfile, setHealthProfile] = useState<HealthProfileResponse | null>(null);
  const [bloodTests, setBloodTests] = useState<BloodTestRecord[]>([]);
  const [todayMeds, setTodayMeds] = useState<Medicine[]>([]);
  const [allMeds, setAllMeds] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [profile, tests] = await Promise.all([
          getHealthProfile().catch(() => null),
          getBloodTests().catch(() => []),
        ]);
        setHealthProfile(profile);
        setBloodTests(tests);

        const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
        const [medsRes, todayRes] = await Promise.all([
          fetch(API_BASE_URL, { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
          fetch(`${API_BASE_URL}/today`, { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
        ]);
        setAllMeds(medsRes);
        setTodayMeds(todayRes);
      } catch (e) {
        console.error('Dashboard fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [token]);

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Zayıf', color: '#fbbf24' };
    if (bmi < 25) return { text: 'Normal', color: '#10b981' };
    if (bmi < 30) return { text: 'Fazla Kilolu', color: '#f59e0b' };
    return { text: 'Obez', color: '#ef4444' };
  };

  const getBodyFatCategory = (bodyFat: number, gender: string) => {
    if (gender === 'male') {
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

  const latestBloodTest = bloodTests.length > 0 ? bloodTests[0] : null;

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh', p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
        Dashboard
      </Typography>

      {loading ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} sx={{ borderRadius: 2.5 }}>
              <CardContent sx={{ p: 2 }}><Skeleton variant="rectangular" height={100} /></CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>

          {/* BMI Card */}
          <Card sx={{ borderRadius: 2.5, boxShadow: 1, border: '1px solid #e5e7eb' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937', fontSize: '0.95rem' }}>
                  BMI İndeksi
                </Typography>
                <Favorite sx={{ fontSize: 18, color: '#ef4444' }} />
              </Box>
              {healthProfile && healthProfile.bmi ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>
                      {healthProfile.bmi}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                      {getBMICategory(healthProfile.bmi).text}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#9ca3af', mb: 1.5, display: 'block' }}>
                    Boy: {healthProfile.height}cm | Kilo: {healthProfile.weight}kg
                  </Typography>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500, fontSize: '0.65rem' }}>Zayıf</Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500, fontSize: '0.65rem' }}>Fazla Kilolu</Typography>
                    </Box>
                    <Box sx={{ position: 'relative', height: 8, bgcolor: '#f3f4f6', borderRadius: 2, overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}>
                      <Box sx={{ position: 'absolute', inset: 0, display: 'flex' }}>
                        <Box sx={{ width: '46.25%', bgcolor: '#93c5fd' }} />
                        <Box sx={{ width: '16.25%', bgcolor: '#86efac' }} />
                        <Box sx={{ width: '12.5%', bgcolor: '#fde047' }} />
                        <Box sx={{ width: '25%', bgcolor: '#fca5a5' }} />
                      </Box>
                      <Box sx={{ position: 'absolute', top: -2, bottom: -2, width: 3, bgcolor: '#1f2937', left: `${Math.min((healthProfile.bmi / 40) * 100, 100)}%`, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', transition: 'left 0.5s ease-in-out' }} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.25 }}>
                      <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 500, fontSize: '0.6rem' }}>18.5</Typography>
                      <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 500, fontSize: '0.6rem' }}>25</Typography>
                      <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 500, fontSize: '0.6rem' }}>30</Typography>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <MonitorWeight sx={{ fontSize: 36, color: '#d1d5db', mb: 0.5 }} />
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>Profili doldurun</Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Body Fat Card */}
          <Card sx={{ borderRadius: 2.5, boxShadow: 1, border: '1px solid #e5e7eb' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937', fontSize: '0.95rem' }}>
                  Vücut Yağ Oranı
                </Typography>
                <FitnessCenter sx={{ fontSize: 18, color: '#14b8a6' }} />
              </Box>
              {healthProfile && healthProfile.bodyFatPercentage ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>
                      %{healthProfile.bodyFatPercentage}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                      {getBodyFatCategory(healthProfile.bodyFatPercentage, healthProfile.gender).text}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#9ca3af', mb: 1.5, display: 'block' }}>
                    {healthProfile.gender === 'male' ? 'Erkek' : 'Kadın'} | Yaş: {healthProfile.age}
                  </Typography>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500, fontSize: '0.65rem' }}>Atletik</Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500, fontSize: '0.65rem' }}>Yüksek</Typography>
                    </Box>
                    <Box sx={{ position: 'relative', height: 8, bgcolor: '#f3f4f6', borderRadius: 2, overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}>
                      <Box sx={{ position: 'absolute', inset: 0, display: 'flex' }}>
                        {healthProfile.gender === 'male' ? (
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
                      <Box sx={{ position: 'absolute', top: -2, bottom: -2, width: 3, bgcolor: '#1f2937', left: `${Math.min((healthProfile.bodyFatPercentage / 50) * 100, 100)}%`, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', transition: 'left 0.5s ease-in-out' }} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.25 }}>
                      {healthProfile.gender === 'male' ? (
                        <>
                          <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 500, fontSize: '0.6rem' }}>14%</Typography>
                          <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 500, fontSize: '0.6rem' }}>18%</Typography>
                          <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 500, fontSize: '0.6rem' }}>25%</Typography>
                        </>
                      ) : (
                        <>
                          <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 500, fontSize: '0.6rem' }}>21%</Typography>
                          <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 500, fontSize: '0.6rem' }}>25%</Typography>
                          <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 500, fontSize: '0.6rem' }}>32%</Typography>
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <FitnessCenter sx={{ fontSize: 36, color: '#d1d5db', mb: 0.5 }} />
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>Profili doldurun</Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Health Profile Card */}
          <Card sx={{ borderRadius: 2.5, boxShadow: 1, border: '1px solid #e5e7eb' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937', fontSize: '0.95rem' }}>
                  Sağlık Profili
                </Typography>
                <Person sx={{ fontSize: 18, color: '#7c3aed' }} />
              </Box>
              {healthProfile ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                  {[
                    { icon: <MonitorWeight sx={{ fontSize: 14, color: '#6b7280' }} />, label: 'Kilo', value: `${healthProfile.weight} kg` },
                    { icon: <Height sx={{ fontSize: 14, color: '#6b7280' }} />, label: 'Boy', value: `${healthProfile.height} cm` },
                    { icon: <Straighten sx={{ fontSize: 14, color: '#6b7280' }} />, label: 'Bel', value: `${healthProfile.waist} cm` },
                    { icon: <Person sx={{ fontSize: 14, color: '#6b7280' }} />, label: 'Yaş', value: `${healthProfile.age}` },
                  ].map((item, i) => (
                    <Box key={i} sx={{ p: 1, bgcolor: '#f8fafb', borderRadius: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      {item.icon}
                      <Box>
                        <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.6rem', display: 'block', lineHeight: 1.2 }}>
                          {item.label}
                        </Typography>
                        <Typography variant="body2" fontWeight={700} sx={{ color: '#1e293b', fontSize: '0.8rem', lineHeight: 1.2 }}>
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  <Box sx={{ gridColumn: 'span 2', p: 1, bgcolor: '#f5f3ff', borderRadius: 1.5, textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#7c3aed', fontWeight: 600 }}>
                      {healthProfile.gender === 'male' ? '♂ Erkek' : '♀ Kadın'}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Person sx={{ fontSize: 36, color: '#d1d5db', mb: 0.5 }} />
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>Profili doldurun</Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Blood Test Card */}
          <Card sx={{ borderRadius: 2.5, boxShadow: 1, border: '1px solid #e5e7eb' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937', fontSize: '0.95rem' }}>
                  Son Kan Testi
                </Typography>
                <Biotech sx={{ fontSize: 18, color: '#ef4444' }} />
              </Box>
              {latestBloodTest ? (
                <>
                  <Typography variant="body2" fontWeight={600} noWrap sx={{ mb: 1.5, color: '#1e293b' }}>
                    {latestBloodTest.fileName}
                  </Typography>
                  {latestBloodTest.anormallikler && latestBloodTest.anormallikler.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                      <Chip
                        icon={<Warning sx={{ fontSize: 14 }} />}
                        label={`${latestBloodTest.anormallikler.length} anormal değer`}
                        size="small"
                        sx={{ bgcolor: '#fef2f2', color: '#dc2626', fontWeight: 600, fontSize: '0.75rem', height: 26, width: 'fit-content' }}
                      />
                      {latestBloodTest.anormallikler.slice(0, 3).map((a, i) => {
                        const isHigh = a.toLowerCase().includes('yüksek') || a.toLowerCase().includes('high');
                        return (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
                            {isHigh ? <TrendingUp sx={{ fontSize: 16, color: '#dc2626' }} /> : <TrendingDown sx={{ fontSize: 16, color: '#2563eb' }} />}
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {a}
                            </Typography>
                          </Box>
                        );
                      })}
                      {latestBloodTest.anormallikler.length > 3 && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                          +{latestBloodTest.anormallikler.length - 3} daha...
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Chip
                      icon={<CheckCircle sx={{ fontSize: 14 }} />}
                      label="Tüm değerler normal"
                      size="small"
                      sx={{ bgcolor: '#f0fdf4', color: '#16a34a', fontWeight: 600, fontSize: '0.75rem', height: 26 }}
                    />
                  )}
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Biotech sx={{ fontSize: 36, color: '#d1d5db', mb: 0.5 }} />
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>Henüz kan testi yüklenmedi</Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Today's Medications Card */}
          <Card sx={{ borderRadius: 2.5, boxShadow: 1, border: '1px solid #e5e7eb' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937', fontSize: '0.95rem' }}>
                  Bugünkü İlaçlar
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {todayMeds.length > 0 && (
                    <Chip label={todayMeds.length} size="small" sx={{ bgcolor: '#0f4c75', color: 'white', fontWeight: 700, fontSize: '0.7rem', height: 20 }} />
                  )}
                  <Medication sx={{ fontSize: 18, color: '#16a34a' }} />
                </Box>
              </Box>
              {todayMeds.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {todayMeds.slice(0, 4).map((med) => (
                    <Box key={med.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: '#f8fafb', borderRadius: 1.5 }}>
                      <AccessTime sx={{ fontSize: 13, color: '#64748b' }} />
                      <Typography variant="caption" fontWeight={600} sx={{ color: '#1e293b' }}>
                        {med.time}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#475569', flex: 1 }} noWrap>
                        {med.name} — {med.dosage}
                      </Typography>
                    </Box>
                  ))}
                  {todayMeds.length > 4 && (
                    <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.6rem' }}>
                      +{todayMeds.length - 4} daha
                    </Typography>
                  )}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Medication sx={{ fontSize: 36, color: '#d1d5db', mb: 0.5 }} />
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>Bugün ilaç yok</Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* All Medications */}
          <Card sx={{ borderRadius: 2.5, boxShadow: 1, border: '1px solid #e5e7eb' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937', fontSize: '0.95rem' }}>
                  Tüm İlaçlar
                </Typography>
                <Chip label={`${allMeds.length}`} size="small" sx={{ bgcolor: '#fff7ed', color: '#ea580c', fontWeight: 700, fontSize: '0.7rem', height: 20 }} />
              </Box>
              {allMeds.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {allMeds.slice(0, 4).map((med) => (
                    <Box key={med.id} sx={{ p: 1, bgcolor: '#f8fafb', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="caption" fontWeight={700} sx={{ color: '#1e293b' }} noWrap>
                        {med.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                        {med.dosage} · {med.time}
                      </Typography>
                    </Box>
                  ))}
                  {allMeds.length > 4 && (
                    <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.6rem' }}>
                      +{allMeds.length - 4} daha
                    </Typography>
                  )}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Medication sx={{ fontSize: 36, color: '#d1d5db', mb: 0.5 }} />
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>İlaç eklenmemiş</Typography>
                </Box>
              )}
            </CardContent>
          </Card>

        </Box>
      )}
    </Box>
  );
};