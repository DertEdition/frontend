import React, { useState } from 'react';
import { Box, Typography, Button, Paper, IconButton } from '@mui/material';
import { Close, Person, Image, Psychology, CloudUpload } from '@mui/icons-material';
import { Header } from './Header';

type BodyPart = 'head' | 'chest' | 'abdomen' | 'left-arm' | 'right-arm' | 'left-leg' | 'right-leg';

interface MRIImage {
  url: string;
  date: string;
}

interface MRIData {
  title: string;
  images: MRIImage[];
  date: string;
}

const bodyPartsData: Record<BodyPart, MRIData> = {
  'head': {
    title: 'Baş & Beyin',
    images: [],
    date: '10 Aralık 2024'
  },
  'chest': {
    title: 'Göğüs & Kalp',
    images: [],
    date: '15 Aralık 2024'
  },
  'abdomen': {
    title: 'Karın Bölgesi',
    images: [],
    date: '20 Kasım 2024'
  },
  'left-arm': {
    title: 'Sol Kol',
    images: [],
    date: '5 Ekim 2024'
  },
  'right-arm': {
    title: 'Sağ Kol',
    images: [],
    date: '5 Ekim 2024'
  },
  'left-leg': {
    title: 'Sol Bacak',
    images: [],
    date: '18 Aralık 2024'
  },
  'right-leg': {
    title: 'Sağ Bacak',
    images: [],
    date: '18 Aralık 2024'
  }
};

interface BodyMapProps {
  onNavigateToChat: () => void;
}

export const BodyMap: React.FC<BodyMapProps> = ({ onNavigateToChat }) => {
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null);
  const [hoveredPart, setHoveredPart] = useState<BodyPart | null>(null);
  const [mriData, setMriData] = useState<Record<BodyPart, MRIImage[]>>({
    'head': [],
    'chest': [],
    'abdomen': [],
    'left-arm': [],
    'right-arm': [],
    'left-leg': [],
    'right-leg': []
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedPart || !event.target.files || !event.target.files[0]) return;
    
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    const newImage: MRIImage = {
      url,
      date: new Date().toLocaleDateString('tr-TR')
    };
    
    setMriData(prev => ({
      ...prev,
      [selectedPart]: [...prev[selectedPart], newImage]
    }));
  };

  const handleAIAnalysis = (imageUrl: string) => {
    // Burada seçilen görüntüyü chat'e gönderebilirsiniz
    // localStorage veya context kullanarak
    localStorage.setItem('selectedMRIImage', imageUrl);
    onNavigateToChat();
  };

  const getFillColor = (part: BodyPart) => {
    return (hoveredPart === part || selectedPart === part) ? '#64B5F6' : '#BBDEFB';
  };

  const getStrokeColor = (part: BodyPart) => {
    return (hoveredPart === part || selectedPart === part) ? '#2196F3' : '#90CAF9';
  };

  return (
    <Box sx={{ flex: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Header />
      
      <Box component="main" sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            İnteraktif Vücut Haritası
          </Typography>
          <Typography variant="body2" color="text.secondary">
            MR görüntülerini görmek için vücut bölgesine tıklayın
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Body Map SVG */}
          <Paper sx={{ flex: 1, p: 4, bgcolor: '#fafafa' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <svg viewBox="0 0 300 650" style={{ width: '100%', maxWidth: '350px' }}>
                <defs>
                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/>
                  </filter>
                  <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#E3F2FD', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#BBDEFB', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>

                {/* Head */}
                <g filter="url(#shadow)">
                  <ellipse 
                    cx="150" cy="60" rx="40" ry="45" 
                    fill={getFillColor('head')} 
                    stroke={getStrokeColor('head')} 
                    strokeWidth="3"
                    style={{ cursor: 'pointer', transition: 'all 0.3s' }} 
                    onClick={() => setSelectedPart('head')} 
                    onMouseEnter={() => setHoveredPart('head')} 
                    onMouseLeave={() => setHoveredPart(null)} 
                  />
                </g>
                
                {/* Neck */}
                <rect x="135" y="100" width="30" height="30" rx="5" fill="url(#bodyGradient)" stroke="#90CAF9" strokeWidth="2" />
                
                {/* Chest */}
                <g filter="url(#shadow)">
                  <rect 
                    x="105" y="130" width="90" height="110" rx="15" 
                    fill={getFillColor('chest')} 
                    stroke={getStrokeColor('chest')} 
                    strokeWidth="3"
                    style={{ cursor: 'pointer', transition: 'all 0.3s' }} 
                    onClick={() => setSelectedPart('chest')} 
                    onMouseEnter={() => setHoveredPart('chest')} 
                    onMouseLeave={() => setHoveredPart(null)} 
                  />
                </g>
                
                {/* Abdomen */}
                <g filter="url(#shadow)">
                  <rect 
                    x="110" y="240" width="80" height="90" rx="15" 
                    fill={getFillColor('abdomen')} 
                    stroke={getStrokeColor('abdomen')} 
                    strokeWidth="3"
                    style={{ cursor: 'pointer', transition: 'all 0.3s' }} 
                    onClick={() => setSelectedPart('abdomen')} 
                    onMouseEnter={() => setHoveredPart('abdomen')} 
                    onMouseLeave={() => setHoveredPart(null)} 
                  />
                </g>
                
                {/* Left Arm */}
                <g filter="url(#shadow)">
                  <rect 
                    x="50" y="145" width="50" height="130" rx="25" 
                    fill={getFillColor('left-arm')} 
                    stroke={getStrokeColor('left-arm')} 
                    strokeWidth="3"
                    style={{ cursor: 'pointer', transition: 'all 0.3s' }} 
                    onClick={() => setSelectedPart('left-arm')} 
                    onMouseEnter={() => setHoveredPart('left-arm')} 
                    onMouseLeave={() => setHoveredPart(null)} 
                  />
                </g>
                
                {/* Right Arm */}
                <g filter="url(#shadow)">
                  <rect 
                    x="200" y="145" width="50" height="130" rx="25" 
                    fill={getFillColor('right-arm')} 
                    stroke={getStrokeColor('right-arm')} 
                    strokeWidth="3"
                    style={{ cursor: 'pointer', transition: 'all 0.3s' }} 
                    onClick={() => setSelectedPart('right-arm')} 
                    onMouseEnter={() => setHoveredPart('right-arm')} 
                    onMouseLeave={() => setHoveredPart(null)} 
                  />
                </g>
                
                {/* Left Leg */}
                <g filter="url(#shadow)">
                  <rect 
                    x="115" y="335" width="35" height="220" rx="18" 
                    fill={getFillColor('left-leg')} 
                    stroke={getStrokeColor('left-leg')} 
                    strokeWidth="3"
                    style={{ cursor: 'pointer', transition: 'all 0.3s' }} 
                    onClick={() => setSelectedPart('left-leg')} 
                    onMouseEnter={() => setHoveredPart('left-leg')} 
                    onMouseLeave={() => setHoveredPart(null)} 
                  />
                </g>
                
                {/* Right Leg */}
                <g filter="url(#shadow)">
                  <rect 
                    x="150" y="335" width="35" height="220" rx="18" 
                    fill={getFillColor('right-leg')} 
                    stroke={getStrokeColor('right-leg')} 
                    strokeWidth="3"
                    style={{ cursor: 'pointer', transition: 'all 0.3s' }} 
                    onClick={() => setSelectedPart('right-leg')} 
                    onMouseEnter={() => setHoveredPart('right-leg')} 
                    onMouseLeave={() => setHoveredPart(null)} 
                  />
                </g>
              </svg>
              
              {/* Labels outside SVG */}
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
                <Box sx={{ position: 'relative', width: '100%', height: '100%', maxWidth: '350px', margin: '0 auto' }}>
                  {/* Head Label */}
                  <Box sx={{ position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)', bgcolor: hoveredPart === 'head' || selectedPart === 'head' ? '#2196F3' : 'white', color: hoveredPart === 'head' || selectedPart === 'head' ? 'white' : '#666', px: 1.5, py: 0.5, borderRadius: 1, fontSize: 12, fontWeight: 500, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'all 0.3s' }}>
                    Baş
                  </Box>
                  
                  {/* Chest Label */}
                  <Box sx={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', bgcolor: hoveredPart === 'chest' || selectedPart === 'chest' ? '#2196F3' : 'white', color: hoveredPart === 'chest' || selectedPart === 'chest' ? 'white' : '#666', px: 1.5, py: 0.5, borderRadius: 1, fontSize: 12, fontWeight: 500, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'all 0.3s' }}>
                    Göğüs
                  </Box>
                  
                  {/* Abdomen Label */}
                  <Box sx={{ position: 'absolute', top: '46%', left: '50%', transform: 'translateX(-50%)', bgcolor: hoveredPart === 'abdomen' || selectedPart === 'abdomen' ? '#2196F3' : 'white', color: hoveredPart === 'abdomen' || selectedPart === 'abdomen' ? 'white' : '#666', px: 1.5, py: 0.5, borderRadius: 1, fontSize: 12, fontWeight: 500, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'all 0.3s' }}>
                    Karın
                  </Box>
                  
                  {/* Left Arm Label */}
                  <Box sx={{ position: 'absolute', top: '33%', left: '15%', bgcolor: hoveredPart === 'left-arm' || selectedPart === 'left-arm' ? '#2196F3' : 'white', color: hoveredPart === 'left-arm' || selectedPart === 'left-arm' ? 'white' : '#666', px: 1.5, py: 0.5, borderRadius: 1, fontSize: 12, fontWeight: 500, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'all 0.3s' }}>
                    Sol Kol
                  </Box>
                  
                  {/* Right Arm Label */}
                  <Box sx={{ position: 'absolute', top: '33%', right: '15%', bgcolor: hoveredPart === 'right-arm' || selectedPart === 'right-arm' ? '#2196F3' : 'white', color: hoveredPart === 'right-arm' || selectedPart === 'right-arm' ? 'white' : '#666', px: 1.5, py: 0.5, borderRadius: 1, fontSize: 12, fontWeight: 500, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'all 0.3s' }}>
                    Sağ Kol
                  </Box>
                  
                  {/* Left Leg Label */}
                  <Box sx={{ position: 'absolute', top: '72%', left: '36%', bgcolor: hoveredPart === 'left-leg' || selectedPart === 'left-leg' ? '#2196F3' : 'white', color: hoveredPart === 'left-leg' || selectedPart === 'left-leg' ? 'white' : '#666', px: 1.5, py: 0.5, borderRadius: 1, fontSize: 12, fontWeight: 500, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'all 0.3s' }}>
                    Sol Bacak
                  </Box>
                  
                  {/* Right Leg Label */}
                  <Box sx={{ position: 'absolute', top: '72%', right: '36%', bgcolor: hoveredPart === 'right-leg' || selectedPart === 'right-leg' ? '#2196F3' : 'white', color: hoveredPart === 'right-leg' || selectedPart === 'right-leg' ? 'white' : '#666', px: 1.5, py: 0.5, borderRadius: 1, fontSize: 12, fontWeight: 500, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'all 0.3s' }}>
                    Sağ Bacak
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* MRI Images Panel */}
          {selectedPart ? (
            <Paper sx={{ width: 400, p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {bodyPartsData[selectedPart].title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Son Taranan: {bodyPartsData[selectedPart].date}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={() => setSelectedPart(null)}>
                  <Close />
                </IconButton>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 2 }}>
                  MR Görüntüleri
                </Typography>
                
                {mriData[selectedPart].length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {mriData[selectedPart].map((img, index) => (
                      <Box key={index}>
                        <Box
                          sx={{
                            aspectRatio: '16/9',
                            bgcolor: '#f5f5f5',
                            borderRadius: 2,
                            overflow: 'hidden',
                            mb: 1
                          }}
                        >
                          <img src={img.url} alt={`MR ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            Yüklenme: {img.date}
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Psychology />}
                            onClick={() => handleAIAnalysis(img.url)}
                            sx={{
                              textTransform: 'none',
                              borderColor: '#3b82f6',
                              color: '#3b82f6',
                              '&:hover': {
                                borderColor: '#2563eb',
                                bgcolor: 'rgba(59, 130, 246, 0.04)'
                              }
                            }}
                          >
                            AI'a Yorumlat
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      bgcolor: '#f5f5f5',
                      borderRadius: 2,
                      p: 4,
                      textAlign: 'center',
                      border: '2px dashed #e0e0e0'
                    }}
                  >
                    <Image sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      Bu bölge için MR görüntüsü yüklenmemiş
                    </Typography>
                  </Box>
                )}
              </Box>

              <Button
                fullWidth
                variant="contained"
                component="label"
                startIcon={<CloudUpload />}
                sx={{
                  bgcolor: '#3b82f6',
                  '&:hover': { bgcolor: '#2563eb' },
                  textTransform: 'none',
                  py: 1.5
                }}
              >
                Görüntü Yükle
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </Button>
            </Paper>
          ) : (
            <Paper sx={{ width: 400, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Person sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  MR görüntülerini görmek için bir bölge seçin
                </Typography>
              </Box>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
};
