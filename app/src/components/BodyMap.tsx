import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, IconButton, CircularProgress, Dialog, DialogContent, Radio } from '@mui/material';
import { Close, Person, Image, Psychology, CloudUpload, PictureAsPdf, ZoomIn, SmartToy } from '@mui/icons-material';
import { uploadMRIImage, getMRIImages, type VisionAnalysisResponse, analyzeVisionImageUrl, deleteMRIImage } from '../rest/restOperations';

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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageForAI, setSelectedImageForAI] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VisionAnalysisResponse | null>(null);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);

  // Silme butonuna basınca sadece onay penceresini açar
  const askDeleteConfirmation = (fileUrl: string) => {
    setUrlToDelete(fileUrl);
    setDeleteConfirmOpen(true);
  };

  // Onay penceresinde "Evet, Sil" denince çalışır
  const handleConfirmDelete = async () => {
    if (!urlToDelete) return;

    try {
      await deleteMRIImage(urlToDelete);

      setMriData(prev => {
        const updatedData = { ...prev };
        if (selectedPart) {
          updatedData[selectedPart] = updatedData[selectedPart].filter(img => img.url !== urlToDelete);
        }
        return updatedData;
      });

      if (selectedImageForAI === urlToDelete) setSelectedImageForAI(null);
      setDeleteConfirmOpen(false); // Pencereyi kapat
    } catch (err) {
      console.error('Silme hatası:', err);
      alert('Görüntü silinemedi.');
    }
  };

  const handleAIAnalysis = async (imageUrl: string) => {
    setAnalysisLoading(true);
    try {
      // Sadece URL'i gönderiyoruz, gerisini backend hallediyor!
      const result = await analyzeVisionImageUrl(imageUrl);

      setAnalysisResult(result);
      setResultDialogOpen(true);
    } catch (err) {
      console.error('Analiz hatası:', err);
      alert('Analiz servisine ulaşılamadı.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
    setViewerOpen(true);
  };

  const handleAIAnalysisClick = () => {
    if (selectedImageForAI) {
      handleAIAnalysis(selectedImageForAI);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedPart || !event.target.files || !event.target.files[0]) return;

    const file = event.target.files[0];
    setUploading(true);

    try {
      const response = await uploadMRIImage({
        file,
        bodyPart: selectedPart
      });

      const newImage: MRIImage = {
        url: response.fileUrl,
        date: new Date().toLocaleDateString('tr-TR')
      };

      setMriData(prev => ({
        ...prev,
        [selectedPart]: [...prev[selectedPart], newImage]
      }));
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  // Sayfa yüklendiğinde mevcut MR görüntülerini getir
  useEffect(() => {
    const fetchMRIImages = async () => {
      try {
        const images = await getMRIImages();
        // Backend'den gelen görüntüleri vücut bölgelerine göre grupla
        const groupedImages: Record<BodyPart, MRIImage[]> = {
          'head': [],
          'chest': [],
          'abdomen': [],
          'left-arm': [],
          'right-arm': [],
          'left-leg': [],
          'right-leg': []
        };

        images.forEach((img: any) => {
          if (img.bodyPart in groupedImages) {
            groupedImages[img.bodyPart as BodyPart].push({
              url: img.fileUrl,
              date: new Date(img.uploadDate).toLocaleDateString('tr-TR')
            });
          }
        });

        setMriData(groupedImages);
      } catch (err) {
        console.error('Error fetching MRI images:', err);
      }
    };

    fetchMRIImages();
  }, []);

  const getFillColor = (part: BodyPart) => {
    return (hoveredPart === part || selectedPart === part) ? '#64B5F6' : '#BBDEFB';
  };

  const getStrokeColor = (part: BodyPart) => {
    return (hoveredPart === part || selectedPart === part) ? '#2196F3' : '#90CAF9';
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', p: 2 }}> 

      <Box component="main">
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Body Map SVG */}
          <Paper
            elevation={3}
            sx={{
              flex: 1,
              p: 4,
              bgcolor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <svg viewBox="0 0 300 650" style={{ width: '100%', maxWidth: '350px' }}>
                <defs>
                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
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
            <Paper
              elevation={3}
              sx={{
                width: 380,
                p: 2.5,
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                bgcolor: 'white'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
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

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1.5, color: 'text.secondary' }}>
                  MR Görüntüleri ({mriData[selectedPart].length})
                </Typography>

                {mriData[selectedPart].length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: '440px', overflowY: 'auto', pr: 0.5 }}>
                    {mriData[selectedPart].map((img, index) => {
                      const isPDF = img.url.toLowerCase().endsWith('.pdf');
                      return (
                        <Paper
                          key={index}
                          onClick={() => setSelectedImageForAI(img.url)}
                          elevation={selectedImageForAI === img.url ? 2 : 0}
                          sx={{
                            p: 1,
                            display: 'flex',
                            gap: 1.5,
                            alignItems: 'center',
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                            bgcolor: selectedImageForAI === img.url ? '#f0f7ff' : '#fafafa',
                            border: selectedImageForAI === img.url ? '2px solid #3b82f6' : '2px solid transparent',
                            borderRadius: 1.5,
                            '&:hover': {
                              bgcolor: selectedImageForAI === img.url ? '#f0f7ff' : '#f5f5f5',
                              elevation: 1
                            }
                          }}
                        >
                          {/* Radio Button */}
                          <Radio
                            checked={selectedImageForAI === img.url}
                            onChange={() => setSelectedImageForAI(img.url)}
                            size="small"
                            sx={{
                              color: '#3b82f6',
                              p: 0.5,
                              '&.Mui-checked': {
                                color: '#3b82f6',
                              },
                            }}
                          />

                          {/* Thumbnail */}
                          <Box
                            onClick={(e) => {
                              e.stopPropagation();
                              !isPDF && handleImageClick(img.url);
                            }}
                            sx={{
                              width: 60,
                              height: 60,
                              bgcolor: '#fff',
                              borderRadius: 1,
                              overflow: 'hidden',
                              flexShrink: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: isPDF ? 'default' : 'pointer',
                              position: 'relative',
                              border: '1px solid #e0e0e0',
                              '&:hover': !isPDF ? {
                                '& .zoom-overlay': {
                                  opacity: 1
                                }
                              } : {}
                            }}
                          >
                            {isPDF ? (
                              <PictureAsPdf sx={{ fontSize: 32, color: '#ef4444' }} />
                            ) : (
                              <>
                                <img
                                  src={img.url}
                                  alt={`MR ${index + 1}`}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <Box
                                  className="zoom-overlay"
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    bgcolor: 'rgba(0,0,0,0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0,
                                    transition: 'opacity 0.2s'
                                  }}
                                >
                                  <ZoomIn sx={{ color: 'white', fontSize: 24 }} />
                                </Box>
                              </>
                            )}
                          </Box>

                          {/* Info */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                              MR #{index + 1}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                              {img.date}
                            </Typography>
                          </Box>

                          {/* SİLME BUTONU - BURASI EKLENDİ */}
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              askDeleteConfirmation(img.url); // Tarayıcı confirm yerine bizim dialogu açar
                            }}
                            sx={{
                              color: '#ef4444',
                              opacity: 0.5,
                              '&:hover': { opacity: 1, bgcolor: '#fee2e2' }
                            }}
                          >
                            <Close sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Paper>
                      )
                    })}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      bgcolor: '#fafafa',
                      borderRadius: 1.5,
                      p: 3,
                      textAlign: 'center',
                      border: '2px dashed #e0e0e0'
                    }}
                  >
                    <Image sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                      Bu bölge için MR görüntüsü yüklenmemiş
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Mevcut AI Analiz Butonunu Güncelle */}
              <Button
                fullWidth
                variant="contained"
                startIcon={analysisLoading ? <CircularProgress size={18} color="inherit" /> : <SmartToy sx={{ fontSize: 28 }} />}
                onClick={() => selectedImageForAI && handleAIAnalysis(selectedImageForAI)}
                disabled={!selectedImageForAI || analysisLoading}
                sx={{
                  bgcolor: '#3b82f6',
                  '&:hover': { bgcolor: '#2563eb' },
                  mb: 1.5,
                  textTransform: 'none',
                  py: 1.2,
                  fontWeight: 500
                }}
              >
                {analysisLoading ? 'Analiz Ediliyor...' : 'AI ile Analiz Et'}
              </Button>

              {/* --- ANALİZ SONUÇ MODALI --- */}
              <Dialog
                open={resultDialogOpen}
                onClose={() => setResultDialogOpen(false)}
                maxWidth="sm"
                fullWidth
              >
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                      Analiz Sonucu
                    </Typography>
                    <IconButton onClick={() => setResultDialogOpen(false)}><Close /></IconButton>
                  </Box>

                  {analysisResult && (
                    <Box>
                      <Paper sx={{ p: 2, bgcolor: '#f8fafc', mb: 2, borderLeft: '5px solid #3b82f6' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#3b82f6' }}>
                          Teşhis Güveni: {analysisResult.confidence}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
                          {analysisResult.explanation}
                        </Typography>
                      </Paper>

                      {analysisResult.warnings && analysisResult.warnings.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="error" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Uyarılar:
                          </Typography>
                          {analysisResult.warnings.map((w, i) => (
                            <Typography key={i} variant="caption" display="block" sx={{ color: '#ef4444', bgcolor: '#fef2f2', p: 0.5, mb: 0.5, borderRadius: 1 }}>
                              {w}
                            </Typography>
                          ))}
                        </Box>
                      )}

                      <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', mt: 2 }}>
                        {analysisResult.disclaimer}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Dialog>

              <Button
                fullWidth
                variant="contained"
                component="label"
                startIcon={uploading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : <CloudUpload />}
                disabled={uploading}
                sx={{
                  bgcolor: '#14b8a6',
                  '&:hover': { bgcolor: '#0d9488' },
                  '&:disabled': { bgcolor: '#5eead4' },
                  textTransform: 'none',
                  py: 1.2,
                  fontWeight: 500
                }}
              >
                {uploading ? 'Yükleniyor...' : 'Görüntü Yükle'}
                <input
                  type="file"
                  hidden
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </Button>
            </Paper>
          ) : (
            <Paper
              elevation={3}
              sx={{
                width: 380,
                p: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                bgcolor: 'white'
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Person sx={{ fontSize: 56, color: 'text.disabled', mb: 1.5 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  MR görüntülerini görmek için<br />bir bölge seçin
                </Typography>
              </Box>
            </Paper>
          )}
        </Box>
      </Box>

      {/* Image Viewer Modal */}
      <Dialog
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative', bgcolor: 'black' }}>
          <IconButton
            onClick={() => setViewerOpen(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(255,255,255,0.9)',
              '&:hover': { bgcolor: 'white' },
              zIndex: 1
            }}
          >
            <Close />
          </IconButton>
          {selectedImage && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '70vh',
                p: 4
              }}
            >
              <img
                src={selectedImage}
                alt="MR Görüntüsü"
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain'
                }}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
      {/* Modern Silme Onay Dialogu */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        PaperProps={{
          sx: { borderRadius: 2, p: 1, width: '100%', maxWidth: 400 }
        }}
      >
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Görüntüyü Sil
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Bu işlem geri alınamaz. Bu tıbbi görüntüyü kalıcı olarak silmek istediğinizden emin misiniz?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => setDeleteConfirmOpen(false)}
              sx={{ textTransform: 'none', px: 4 }}
            >
              Vazgeç
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
              sx={{ textTransform: 'none', px: 4, bgcolor: '#ef4444' }}
            >
              Evet, Sil
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};
