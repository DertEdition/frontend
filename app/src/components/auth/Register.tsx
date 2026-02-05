import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { Email, Lock, Person, Favorite } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const API_BASE_URL = 'http://localhost:8080/api/auth';

interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export const Register: React.FC<{ onSwitchToLogin: () => void }> = ({ onSwitchToLogin }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    username: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Kayıt başarısız');
        setLoading(false);
        return;
      }

      login(data.token, data.user);
    } catch (err) {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #3b82f6 0%, #14b8a6 100%)',
        p: 2,
        pt: 6,
        overflow: 'auto',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 500 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              bgcolor: 'white',
              borderRadius: 4,
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                border: '3px solid #3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Favorite sx={{ width: 24, height: 24, color: '#3b82f6' }} />
            </Box>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
            Hesap Oluştur
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 4, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>

              <Box sx={{ mb: 2 }}>
                <Typography
                  component="label"
                  sx={{ display: 'block', fontSize: 14, fontWeight: 500, color: 'text.primary', mb: 1 }}
                >
                  Kullanıcı Adı
                </Typography>
                <TextField
                  fullWidth
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="kullaniciadi"
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: 'action.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': { borderColor: '#3b82f6' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: 2 },
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography
                  component="label"
                  sx={{ display: 'block', fontSize: 14, fontWeight: 500, color: 'text.primary', mb: 1 }}
                >
                  E-posta
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ornekkullanici@mail.com"
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'action.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': { borderColor: '#3b82f6' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: 2 },
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  component="label"
                  sx={{ display: 'block', fontSize: 14, fontWeight: 500, color: 'text.primary', mb: 1 }}
                >
                  Şifre
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'action.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': { borderColor: '#3b82f6' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: 2 },
                    },
                  }}
                />
              </Box>

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: '#3b82f6',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: 16,
                  '&:hover': { bgcolor: '#2563eb' },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Hesap Oluştur'}
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography component="span" sx={{ color: 'text.secondary' }}>
                Zaten hesabınız var mı?{' '}
              </Typography>
              <Typography
                component="button"
                type="button"
                onClick={onSwitchToLogin}
                sx={{
                  border: 'none',
                  bgcolor: 'transparent',
                  color: '#3b82f6',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 14,
                  '&:hover': { color: '#2563eb' },
                }}
              >
                Giriş Yap
              </Typography>
            </Box>
          </CardContent>
        </Card>

      </Box>
    </Box>
  );
};
