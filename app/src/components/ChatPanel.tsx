import { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  CircularProgress,
  Switch,
  FormControlLabel,
  Avatar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [useRag, setUseRag] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}${useRag ? '/rag/chat' : '/chat'}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage.content,
            history: messages,
          }),
        }
      );

      if (!res.ok) throw new Error('API error');

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.response },
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '❌ Sunucu hatası - Backend bağlantısı kurulamadı' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box sx={{ 
      height: 'calc(100vh - 100px)', 
      display: 'flex', 
      flexDirection: 'column',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          💬 Medikal Asistan
        </Typography>
        <FormControlLabel
          control={
            <Switch 
              checked={useRag} 
              onChange={() => setUseRag(!useRag)}
              color="primary"
            />
          }
          label="RAG Modu (Bilgi Bankası)"
        />
      </Paper>

      {/* Messages Area */}
      <Paper 
        elevation={3} 
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          p: 3,
          mb: 2,
          backgroundColor: '#f5f5f5'
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 10, opacity: 0.5 }}>
            <Typography variant="h6">
              Merhaba! Size nasıl yardımcı olabilirim?
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Sağlık, semptomlar, ilaçlar hakkında sorularınızı sorabilirsiniz.
            </Typography>
          </Box>
        ) : (
          messages.map((m, i) => (
            <Box 
              key={i} 
              sx={{ 
                display: 'flex', 
                mb: 2,
                justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              {m.role === 'assistant' && (
                <Avatar sx={{ bgcolor: '#1976d2', mr: 1 }}>🏥</Avatar>
              )}
              <Paper 
                sx={{ 
                  p: 2, 
                  maxWidth: '70%',
                  backgroundColor: m.role === 'user' ? '#1976d2' : '#fff',
                  color: m.role === 'user' ? '#fff' : '#000'
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {m.content}
                </Typography>
              </Paper>
              {m.role === 'user' && (
                <Avatar sx={{ bgcolor: '#666', ml: 1 }}>👤</Avatar>
              )}
            </Box>
          ))
        )}
        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: '#1976d2' }}>🏥</Avatar>
            <Paper sx={{ p: 2 }}>
              <CircularProgress size={20} />
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Paper>

      {/* Input Area */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mesajınızı yazın... (Enter ile gönder)"
            disabled={loading}
            variant="outlined"
          />
          <Button 
            variant="contained" 
            onClick={sendMessage} 
            disabled={loading || !input.trim()}
            endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{ minWidth: '120px' }}
          >
            Gönder
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
