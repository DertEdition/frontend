import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  LinearProgress,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  Dialog,
  DialogContent,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Description,
  CalendarToday,
  SmartToy,
  PictureAsPdf,
  Image as ImageIcon,
  ZoomIn,
  Close,
  Warning,
} from '@mui/icons-material';
import { uploadBloodTest, getBloodTests, deleteBloodTest, type BloodTestRecord } from '../rest/restOperations';

export function BloodTest() {
  const [records, setRecords] = useState<BloodTestRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [selectedRecord, setSelectedRecord] = useState<BloodTestRecord | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await getBloodTests();
      setRecords(data);
    } catch (error) {
      console.error('Error fetching blood tests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setSnackbar({ open: true, message: 'Please upload a PDF or image file (PNG, JPG, WEBP)', severity: 'error' });
      return;
    }

    try {
      setUploading(true);
      const result = await uploadBloodTest(file);
      setRecords((prev) => [result, ...prev]);
      setSelectedRecord(result);
      setSnackbar({ open: true, message: 'Blood test uploaded and analyzed!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error uploading blood test', severity: 'error' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBloodTest(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
      if (selectedRecord?.id === id) setSelectedRecord(null);
      setSnackbar({ open: true, message: 'Record deleted', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error deleting record', severity: 'error' });
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName?.toLowerCase().endsWith('.pdf')) return <PictureAsPdf sx={{ fontSize: 20, color: '#ef4444' }} />;
    return <ImageIcon sx={{ fontSize: 20, color: '#3b82f6' }} />;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const renderRapor = (rapor: string) => {
    return rapor.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <Typography key={i} variant="body2" sx={{ lineHeight: 1.8, color: '#334155' }}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
        </Typography>
      );
    });
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh', p: 2, maxWidth: '100%', overflow: 'hidden' }}>

      {/* Top: Past Records + Upload Button */}
      <Card sx={{ borderRadius: 3, boxShadow: 1, mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}>
              <Description sx={{ fontSize: 16 }} />
              Past Records
            </Typography>
            <Box
              onClick={() => !uploading && fileInputRef.current?.click()}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: 2,
                bgcolor: '#0f4c75',
                color: 'white',
                cursor: uploading ? 'default' : 'pointer',
                transition: 'all 0.2s',
                '&:hover': uploading ? {} : { bgcolor: '#1b6ca8' },
              }}
            >
              {uploading ? (
                <CircularProgress size={18} sx={{ color: 'white' }} />
              ) : (
                <CloudUpload sx={{ fontSize: 18 }} />
              )}
              <Typography variant="body2" fontWeight={600} sx={{ color: 'white' }}>
                {uploading ? 'Analyzing...' : 'Upload'}
              </Typography>
            </Box>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              style={{ display: 'none' }}
            />
          </Box>

          {loading && <LinearProgress sx={{ mb: 2 }} />}

          {records.length === 0 && !loading ? (
            <Alert severity="info">No blood test records yet. Upload your first one!</Alert>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
              {records.map((record) => {
                const isSelected = selectedRecord?.id === record.id;
                return (
                  <Card
                    key={record.id}
                    variant="outlined"
                    onClick={() => setSelectedRecord(record)}
                    sx={{
                      cursor: 'pointer',
                      borderWidth: 2,
                      borderColor: isSelected ? '#0f4c75' : '#e5e7eb',
                      bgcolor: isSelected ? '#e3f2fd' : 'white',
                      borderRadius: 2,
                      transition: 'all 0.15s',
                      '&:hover': { borderColor: '#1b6ca8', bgcolor: '#f0f7ff' },
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1 }}>
                          {getFileIcon(record.fileName)}
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              noWrap
                              sx={{ color: isSelected ? '#0f4c75' : 'text.primary' }}
                            >
                              {record.fileName}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                              <CalendarToday sx={{ fontSize: 12, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(record.uploadDate)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {record.fileUrl && (
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewUrl(record.fileUrl);
                                setPreviewOpen(true);
                              }}
                              sx={{ color: '#1b6ca8' }}
                            >
                              <ZoomIn fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(record.id);
                            }}
                            sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' } }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
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

      {/* Bottom: AI Analysis (full width) */}
      {!selectedRecord ? (
        <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4, gap: 1.5 }}>
              <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: '#f0f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SmartToy sx={{ fontSize: 28, color: '#1b6ca8' }} />
              </Box>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Upload a blood test or select a record to see AI analysis
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
          <CardContent>
            {/* Header row: doc info + abnormal count badge */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, p: 2, bgcolor: '#f0f7ff', borderRadius: 2, border: '1px solid #dbeafe' }}>
              {getFileIcon(selectedRecord.fileName)}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {selectedRecord.fileName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(selectedRecord.uploadDate)}
                </Typography>
              </Box>
              <Chip label="Analyzed" size="small" sx={{ bgcolor: '#d1fae5', color: '#065f46', fontWeight: 600 }} />
            </Box>

            {/* Anormallikler + Rapor side by side */}
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
              {/* Left: Anormallikler */}
              {selectedRecord.anormallikler && selectedRecord.anormallikler.length > 0 && (
                <Box sx={{ flex: '0 0 340px', minWidth: 0 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#0f4c75', mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Warning sx={{ fontSize: 18, color: '#f59e0b' }} />
                    Referans Dışı Değerler ({selectedRecord.anormallikler.length})
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    {selectedRecord.anormallikler.map((item, idx) => {
                      const isHigh = item.toLowerCase().includes('yüksek') || item.toLowerCase().includes('high');
                      const isLow = item.toLowerCase().includes('düşük') || item.toLowerCase().includes('low');
                      const statusColor = isHigh ? '#dc2626' : isLow ? '#2563eb' : '#f59e0b';
                      const statusBg = isHigh ? '#fef2f2' : isLow ? '#eff6ff' : '#fffbeb';
                      const statusBorder = isHigh ? '#fecaca' : isLow ? '#bfdbfe' : '#fde68a';

                      return (
                        <Box
                          key={idx}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 1.5,
                            bgcolor: statusBg,
                            border: `1px solid ${statusBorder}`,
                            borderRadius: 2,
                          }}
                        >
                          <Warning sx={{ fontSize: 16, color: statusColor, flexShrink: 0 }} />
                          <Typography variant="caption" fontWeight={600} sx={{ color: '#1e293b', flex: 1 }}>
                            {item}
                          </Typography>
                          <Chip
                            label={isHigh ? 'Yüksek' : isLow ? 'Düşük' : 'Anormal'}
                            size="small"
                            sx={{ bgcolor: statusColor, color: 'white', fontWeight: 700, fontSize: '0.65rem', height: 22, flexShrink: 0 }}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}

              {/* Right: Rapor */}
              {selectedRecord.rapor && (
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 1.5 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#0f4c75', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <SmartToy sx={{ fontSize: 18, color: 'white' }} />
                    </Box>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#0f4c75' }}>
                      AI Health Assistant
                    </Typography>
                  </Box>
                  <Box sx={{ bgcolor: '#f8fafb', border: '1px solid #e5e7eb', borderRadius: 3, p: 2.5 }}>
                    {renderRapor(selectedRecord.rapor)}
                  </Box>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={() => setPreviewOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 500 }}>
          {previewUrl?.toLowerCase().endsWith('.pdf') ? (
            <iframe src={previewUrl} style={{ width: '100%', height: '80vh', border: 'none' }} title="Blood Test Preview" />
          ) : (
            <img src={previewUrl} alt="Blood Test" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
          )}
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
