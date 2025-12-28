import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Paper,
  Avatar,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

interface Message {
  text: string;
  isUser: boolean;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Merhaba! Sağlık asistanınızım. Size nasıl yardımcı olabilirim?', isUser: false },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isUser: true }]);
      setInput('');
      
      // Simulated bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: 'Size yardımcı olmak için buradayım. İlaçlarınız, testleriniz veya sağlık durumunuz hakkında sorular sorabilirsiniz.', isUser: false },
        ]);
      }, 1000);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Sağlık Asistanı ChatBot
      </Typography>
      <Card sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
                gap: 1,
              }}
            >
              {!msg.isUser && (
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <SmartToyIcon />
                </Avatar>
              )}
              <Paper
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  bgcolor: msg.isUser ? 'primary.main' : 'grey.200',
                  color: msg.isUser ? 'white' : 'text.primary',
                }}
              >
                <Typography>{msg.text}</Typography>
              </Paper>
              {msg.isUser && (
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <PersonIcon />
                </Avatar>
              )}
            </Box>
          ))}
        </CardContent>
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Mesajınızı yazın..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button
              variant="contained"
              onClick={handleSend}
              endIcon={<SendIcon />}
            >
              Gönder
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default ChatBot;
