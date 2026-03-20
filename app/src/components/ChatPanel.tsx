import { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Paper, 
  Typography, 
  Avatar, 
  Tooltip, 
  Divider, 
  Fade, 
  Grow,
  styled,
  keyframes
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyTwoToneIcon from '@mui/icons-material/SmartToyTwoTone';
import PersonTwoToneIcon from '@mui/icons-material/PersonTwoTone';
import DeleteSweepTwoToneIcon from '@mui/icons-material/DeleteSweepTwoTone';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { SmartToy } from '@mui/icons-material';

// --- ÖZEL ANİMASYONLAR ---

// Düşünme noktaları animasyonu
const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
  40% { transform: scale(1); opacity: 1; }
`;

// Arka plan nabız animasyonu (Asistan düşünürken avatarın etrafında)
const pulse = keyframes`
  0% { transform: scale(0.95); boxShadow: 0 0 0 0 rgba(15, 76, 117, 0.4); }
  70% { transform: scale(1); boxShadow: 0 0 0 10px rgba(15, 76, 117, 0); }
  100% { transform: scale(0.95); boxShadow: 0 0 0 0 rgba(15, 76, 117, 0); }
`;

const TypingDot = styled(Box)(({ theme }) => ({
  width: 6,
  height: 6,
  backgroundColor: '#0f4c75',
  borderRadius: '50%',
  display: 'inline-block',
  animation: `${bounce} 1.4s infinite ease-in-out both`,
  '&:nth-of-type(1)': { animationDelay: '-0.32s' },
  '&:nth-of-type(2)': { animationDelay: '-0.16s' },
}));

const PulsingAvatar = styled(Avatar)<{ isloading?: string }>(({ isloading }) => ({
  animation: isloading === 'true' ? `${pulse} 2s infinite` : 'none',
}));

// --- COMPONENT ---

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content, history: messages }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Servis şu an kapalı.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100vh', width: '100%', p: 3, display: 'flex', flexDirection: 'column', bgcolor: '#f0f4f8' }}>
      
      <Paper elevation={6} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', borderRadius: '8px', overflow: 'hidden', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', border: '1px solid #e2e8f0' }}>
        
        {/* Mesaj Alanı */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {messages.length === 0 ? (
            <Fade in timeout={1500}>
              <Box sx={{ textAlign: 'center', my: 'auto' }}>
                <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: '#f0f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3, boxShadow: '0 10px 20px rgba(15, 76, 117, 0.2)' }}>
                  <SmartToy sx={{ fontSize: 28, color: '#1b6ca8' }} />
                </Box>
                <Typography variant="h5" fontWeight={800} color="#1e293b">Nasıl yardımcı olabilirim?</Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>Senin için tahlil yorumlayabilir veya ilaçlarını takip edebilirim. <AutoAwesomeIcon sx={{ fontSize: 14, color: '#fbbf24' }} /></Typography>
              </Box>
            </Fade>
          ) : (
            messages.map((m, i) => (
              <Grow in key={i} timeout={500}>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: m.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                  <Avatar sx={{ bgcolor: m.role === 'user' ? '#0f4c75' : 'white', color: m.role === 'user' ? 'white' : '#0f4c75', width: 38, height: 38, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
                    {m.role === 'user' ? <PersonTwoToneIcon /> : <SmartToyTwoToneIcon />}
                  </Avatar>
                  <Paper elevation={0} sx={{ p: 2, px: 2.5, maxWidth: '80%', borderRadius: m.role === 'user' ? '16px 2px 16px 16px' : '2px 16px 16px 16px', background: m.role === 'user' ? 'linear-gradient(135deg, #0f4c75 0%, #1b6ca8 100%)' : '#fff', color: m.role === 'user' ? 'white' : '#1e293b', border: '1px solid #e2e8f0', boxShadow: m.role === 'user' ? '0 8px 16px -4px rgba(15, 76, 117, 0.3)' : '0 4px 12px -2px rgba(0,0,0,0.05)' }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.95rem' }}>{m.content}</Typography>
                  </Paper>
                </Box>
              </Grow>
            ))
          )}
          
          {loading && (
            <Fade in timeout={300}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <PulsingAvatar isloading="true" sx={{ bgcolor: 'white', color: '#0f4c75', width: 38, height: 38, border: '1px solid #e2e8f0' }}>
                  <SmartToyTwoToneIcon />
                </PulsingAvatar>
                <Paper sx={{ p: 1.5, px: 2.5, borderRadius: '2px 16px 16px 16px', bgcolor: 'white', border: '1px solid #e2e8f0', display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TypingDot />
                  <TypingDot />
                  <TypingDot />
                </Paper>
              </Box>
            </Fade>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Alanı */}
        <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title="Temizle">
            <IconButton onClick={() => setMessages([])} sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444' } }}>
              <DeleteSweepTwoToneIcon />
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{ my: 1 }} />
          <TextField
            fullWidth multiline maxRows={4} value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
            placeholder="Mesajını yaz..." variant="standard"
            InputProps={{ disableUnderline: true, sx: { px: 1, fontSize: '0.95rem' } }}
          />
          <IconButton 
            onClick={sendMessage} disabled={loading || !input.trim()}
            sx={{ 
              width: 48, height: 48, 
              background: input.trim() ? 'linear-gradient(135deg, #0f4c75 0%, #1b6ca8 100%)' : '#f1f5f9',
              color: 'white', borderRadius: '12px',
              '&:hover': { opacity: 0.9, transform: 'scale(1.05)' },
              transition: 'all 0.2s',
              '&.Mui-disabled': { color: '#cbd5e1', background: '#f1f5f9' }
            }}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}