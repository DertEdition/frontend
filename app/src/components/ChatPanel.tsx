import { useState, useRef, useEffect } from 'react';
import {
  Box, TextField, IconButton, Paper, Typography,
  Avatar, Tooltip, Divider, Fade, Grow, Chip,
  Slider, Button, styled, keyframes
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyTwoToneIcon from '@mui/icons-material/SmartToyTwoTone';
import PersonTwoToneIcon from '@mui/icons-material/PersonTwoTone';
import DeleteSweepTwoToneIcon from '@mui/icons-material/DeleteSweepTwoTone';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SmartToy, TouchApp } from '@mui/icons-material';
import {
  BODY_REGIONS, SYMPTOMS, ONSET_OPTIONS, TRIGGER_OPTIONS, RED_FLAGS,
} from '../data/bodyData';
import type { BodyRegion, SymptomType } from '../data/bodyData';

// --- ANİMASYONLAR ---
const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
  40% { transform: scale(1); opacity: 1; }
`;
const pulse = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(15,76,117,0.4); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(15,76,117,0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(15,76,117,0); }
`;
const TypingDot = styled(Box)(() => ({
  width: 6, height: 6, backgroundColor: '#0f4c75', borderRadius: '50%', display: 'inline-block',
  animation: `${bounce} 1.4s infinite ease-in-out both`,
  '&:nth-of-type(1)': { animationDelay: '-0.32s' },
  '&:nth-of-type(2)': { animationDelay: '-0.16s' },
}));
const PulsingAvatar = styled(Avatar)<{ isloading?: string }>(({ isloading }) => ({
  animation: isloading === 'true' ? `${pulse} 2s infinite` : 'none',
}));

// --- MARKDOWN ---
function renderMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    return <span key={i}>{part}</span>;
  });
}

// --- TYPES ---
type Message = { role: 'user' | 'assistant'; content: string };
type WizardStep = 'mode' | 'region' | 'symptom' | 'details' | 'chat';

interface WizardState {
  region: BodyRegion | null;
  symptom: SymptomType | null;
  severity: number;
  onset: string | null;
  trigger: string | null;
  redFlags: string[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// --- CHIP KARTLARI ---
function SelectionCard({ label, emoji, selected, onClick }: { label: string; emoji?: string; selected: boolean; onClick: () => void }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        p: 1.5, borderRadius: '10px', cursor: 'pointer', textAlign: 'center',
        border: selected ? '2px solid #1b6ca8' : '1.5px solid #e2e8f0',
        bgcolor: selected ? '#e8f4ff' : '#fff',
        transition: 'all 0.15s',
        '&:hover': { borderColor: '#1b6ca8', bgcolor: '#f0f8ff' },
        userSelect: 'none',
      }}
    >
      {emoji && <Typography sx={{ fontSize: '1.4rem', mb: 0.3 }}>{emoji}</Typography>}
      <Typography variant="caption" sx={{ fontWeight: selected ? 700 : 500, color: selected ? '#0f4c75' : '#374151', lineHeight: 1.2, display: 'block' }}>
        {label}
      </Typography>
    </Box>
  );
}

// --- MAIN COMPONENT ---
export function ChatPanel() {
  const [step, setStep] = useState<WizardStep>('chat');
  const [wizard, setWizard] = useState<WizardState>({
    region: null, symptom: null, severity: 5,
    onset: null, trigger: null, redFlags: [],
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Wizard'dan otomatik mesaj üret ve gönder
  const sendWizardMessage = async (w: WizardState) => {
    const region = BODY_REGIONS[w.region!];
    const symptom = SYMPTOMS[w.symptom!];

    const onsetSentences: Record<string, string> = {
      just_now:       'Az önce başladı.',
      few_hours:      'Birkaç saat önce başladı.',
      today:          'Bugün başladı.',
      '1_day':        'Yaklaşık 1 gündür var.',
      '2_3_days':     '2-3 gündür devam ediyor.',
      '1_week':       'Yaklaşık 1 haftadır var.',
      more_than_week: '1 haftadan uzun süredir devam ediyor.',
      chronic:        'Kronik bir şikayetim, sürekli yaşıyorum.',
    };
    const triggerSentences: Record<string, string> = {
      injury:         'Bir darbe veya yaralanma sonrası oluştu.',
      after_exercise: 'Egzersiz yaptıktan sonra ortaya çıktı.',
      after_running:  'Koştuktan sonra başladı.',
      after_eating:   'Yemek yedikten sonra başladı.',
      stress:         'Stresli bir dönemde ortaya çıktı.',
      morning:        'Genellikle sabahları daha belirgin.',
      evening:        'Genellikle akşamları daha belirgin.',
      unknown:        'Ne zaman veya neden başladığını bilmiyorum.',
    };
    const redFlagSentences: Record<string, string> = {
      cannot_bear_weight:   'Üzerine basamıyorum.',
      severe_pain:          'Ağrı çok şiddetli.',
      visible_deformity:    'Görünür bir şekil bozukluğu var.',
      loss_of_consciousness:'Bilinç kaybı yaşadım.',
      difficulty_breathing: 'Nefes almakta zorlanıyorum.',
      chest_pain:           'Göğsümde ağrı var.',
      high_fever:           'Yüksek ateşim var.',
      confusion:            'Bilinç bulanıklığı yaşıyorum.',
      severe_bleeding:      'Şiddetli kanama var.',
      numbness_spreading:   'Uyuşukluk yayılıyor.',
    };

    let msg = `${region.name_tr} bölgemde ${symptom.name_tr.toLowerCase()} var.`;
    msg += ` Şiddeti 10 üzerinden ${w.severity}.`;
    if (w.onset && onsetSentences[w.onset]) msg += ` ${onsetSentences[w.onset]}`;
    if (w.trigger && triggerSentences[w.trigger]) msg += ` ${triggerSentences[w.trigger]}`;
    const redFlagParts = w.redFlags.map(f => redFlagSentences[f]).filter(Boolean);
    if (redFlagParts.length > 0) msg += ` ${redFlagParts.join(' ')}`;

    const userMsg: Message = { role: 'user', content: msg };
    setMessages([userMsg]);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: [] }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Servis şu an kapalı.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Normal mesaj gönder
  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content, history: messages }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Servis şu an kapalı.' }]);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setStep('chat');
    setMessages([]);
    setInput('');
    setWizard({ region: null, symptom: null, severity: 5, onset: null, trigger: null, redFlags: [] });
  };

  const toggleRedFlag = (id: string) => {
    setWizard(prev => ({
      ...prev,
      redFlags: prev.redFlags.includes(id) ? prev.redFlags.filter(f => f !== id) : [...prev.redFlags, id],
    }));
  };

  // --- STEP: REGION ---
  if (step === 'region') {
    return (
      <Box sx={{ height: '100vh', p: 3, display: 'flex', flexDirection: 'column', bgcolor: '#f0f4f8', overflowY: 'auto' }}>
        <Paper elevation={4} sx={{ p: 3, borderRadius: '16px', maxWidth: 560, mx: 'auto', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <IconButton size="small" onClick={() => setStep('chat')}><ArrowBackIcon fontSize="small" /></IconButton>
            <Typography variant="subtitle1" fontWeight={700} color="#1e293b">Hangi bölgede şikayetiniz var?</Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
            {Object.values(BODY_REGIONS).map(r => (
              <SelectionCard
                key={r.id} label={r.name_tr}
                selected={wizard.region === r.id}
                onClick={() => setWizard(prev => ({ ...prev, region: r.id, symptom: null }))}
              />
            ))}
          </Box>
          <Button
            fullWidth variant="contained" disabled={!wizard.region}
            onClick={() => setStep('symptom')}
            sx={{ mt: 2.5, background: 'linear-gradient(135deg, #0f4c75, #1b6ca8)', borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
          >
            Devam →
          </Button>
        </Paper>
      </Box>
    );
  }

  // --- STEP: SYMPTOM ---
  if (step === 'symptom') {
    const availableSymptoms = wizard.region ? BODY_REGIONS[wizard.region].symptoms : [];
    return (
      <Box sx={{ height: '100vh', p: 3, display: 'flex', flexDirection: 'column', bgcolor: '#f0f4f8', overflowY: 'auto' }}>
        <Paper elevation={4} sx={{ p: 3, borderRadius: '16px', maxWidth: 480, mx: 'auto', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <IconButton size="small" onClick={() => setStep('region')}><ArrowBackIcon fontSize="small" /></IconButton>
            <Typography variant="subtitle1" fontWeight={700} color="#1e293b">
              {wizard.region && BODY_REGIONS[wizard.region].name_tr} — Şikayet nedir?
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mt: 2 }}>
            {availableSymptoms.map(sid => {
              const s = SYMPTOMS[sid];
              return (
                <SelectionCard
                  key={s.id} label={s.name_tr}
                  selected={wizard.symptom === s.id}
                  onClick={() => setWizard(prev => ({ ...prev, symptom: s.id }))}
                />
              );
            })}
          </Box>
          <Button
            fullWidth variant="contained" disabled={!wizard.symptom}
            onClick={() => setStep('details')}
            sx={{ mt: 2.5, background: 'linear-gradient(135deg, #0f4c75, #1b6ca8)', borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
          >
            Devam →
          </Button>
        </Paper>
      </Box>
    );
  }

  // --- STEP: DETAILS ---
  if (step === 'details') {
    const canSubmit = wizard.onset !== null;
    return (
      <Box sx={{ height: '100vh', p: 3, display: 'flex', flexDirection: 'column', bgcolor: '#f0f4f8', overflowY: 'auto' }}>
        <Paper elevation={4} sx={{ p: 3, borderRadius: '16px', maxWidth: 520, mx: 'auto', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <IconButton size="small" onClick={() => setStep('symptom')}><ArrowBackIcon fontSize="small" /></IconButton>
            <Typography variant="subtitle1" fontWeight={700} color="#1e293b">Detaylar</Typography>
          </Box>

          {/* Severity */}
          <Typography variant="body2" fontWeight={600} color="#374151" mb={0.5}>
            Şiddet: <strong style={{ color: '#0f4c75' }}>{wizard.severity} / 10</strong>
          </Typography>
          <Slider
            value={wizard.severity} min={1} max={10} step={1}
            onChange={(_, v) => setWizard(prev => ({ ...prev, severity: v as number }))}
            marks valueLabelDisplay="auto"
            sx={{ color: '#1b6ca8', mb: 2.5 }}
          />

          {/* Onset */}
          <Typography variant="body2" fontWeight={600} color="#374151" mb={1}>Ne zamandır? *</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 2.5 }}>
            {ONSET_OPTIONS.map(o => (
              <Chip
                key={o.id} label={o.name_tr} clickable size="small"
                onClick={() => setWizard(prev => ({ ...prev, onset: o.id }))}
                sx={{
                  borderRadius: '8px', fontWeight: wizard.onset === o.id ? 700 : 400,
                  bgcolor: wizard.onset === o.id ? '#e8f4ff' : '#f1f5f9',
                  border: wizard.onset === o.id ? '1.5px solid #1b6ca8' : '1.5px solid transparent',
                  color: wizard.onset === o.id ? '#0f4c75' : '#374151',
                }}
              />
            ))}
          </Box>

          {/* Trigger */}
          <Typography variant="body2" fontWeight={600} color="#374151" mb={1}>Tetikleyici (opsiyonel)</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 2.5 }}>
            {TRIGGER_OPTIONS.map(t => (
              <Chip
                key={t.id} label={t.name_tr} clickable size="small"
                onClick={() => setWizard(prev => ({ ...prev, trigger: prev.trigger === t.id ? null : t.id }))}
                sx={{
                  borderRadius: '8px', fontWeight: wizard.trigger === t.id ? 700 : 400,
                  bgcolor: wizard.trigger === t.id ? '#e8f4ff' : '#f1f5f9',
                  border: wizard.trigger === t.id ? '1.5px solid #1b6ca8' : '1.5px solid transparent',
                  color: wizard.trigger === t.id ? '#0f4c75' : '#374151',
                }}
              />
            ))}
          </Box>

          {/* Red Flags */}
          <Typography variant="body2" fontWeight={600} color="#374151" mb={0.5}>Ek belirtiler (opsiyonel)</Typography>
          <Typography variant="caption" color="#94a3b8" mb={1} display="block">Birden fazla seçebilirsiniz</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 2.5 }}>
            {RED_FLAGS.map(f => (
              <Chip
                key={f.id} label={f.name_tr} clickable size="small"
                onClick={() => toggleRedFlag(f.id)}
                sx={{
                  borderRadius: '8px', fontWeight: wizard.redFlags.includes(f.id) ? 700 : 400,
                  bgcolor: wizard.redFlags.includes(f.id) ? '#fff3e0' : '#f1f5f9',
                  border: wizard.redFlags.includes(f.id) ? '1.5px solid #f59e0b' : '1.5px solid transparent',
                  color: wizard.redFlags.includes(f.id) ? '#b45309' : '#374151',
                }}
              />
            ))}
          </Box>

          <Button
            fullWidth variant="contained" disabled={!canSubmit}
            onClick={() => {
              setStep('chat');
              sendWizardMessage(wizard);
            }}
            sx={{ background: 'linear-gradient(135deg, #0f4c75, #1b6ca8)', borderRadius: '10px', textTransform: 'none', fontWeight: 700, py: 1.3 }}
          >
            Asistana Sor
          </Button>
        </Paper>
      </Box>
    );
  }

  // --- STEP: CHAT ---
  return (
    <Box sx={{ height: '100vh', width: '100%', p: 3, display: 'flex', flexDirection: 'column', bgcolor: '#f0f4f8' }}>
      <Paper elevation={6} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', borderRadius: '8px', overflow: 'hidden', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', border: '1px solid #e2e8f0' }}>

        {/* Header */}
        <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#fff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SmartToyTwoToneIcon sx={{ color: '#1b6ca8' }} />
            <Typography variant="subtitle2" fontWeight={700} color="#1e293b">Sağlık Asistanı</Typography>
          </Box>
          <Tooltip title="Sohbeti temizle">
            <IconButton size="small" onClick={() => setMessages([])} sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444' } }}>
              <DeleteSweepTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Mesajlar */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {messages.length === 0 && (
            <Fade in timeout={1000}>
              <Box sx={{ textAlign: 'center', my: 'auto', color: '#94a3b8' }}>
                <SmartToy sx={{ fontSize: 40, mb: 1, color: '#cbd5e1' }} />
                <Typography variant="body2">Sorunuzu yazın veya vücut bölgesi seçin.</Typography>
              </Box>
            </Fade>
          )}
          {messages.map((m, i) => (
            <Grow in key={i} timeout={400}>
              <Box sx={{ display: 'flex', gap: 1.5, flexDirection: m.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                <Avatar sx={{ bgcolor: m.role === 'user' ? '#0f4c75' : 'white', color: m.role === 'user' ? 'white' : '#0f4c75', width: 34, height: 34, border: '1px solid #e2e8f0', flexShrink: 0 }}>
                  {m.role === 'user' ? <PersonTwoToneIcon fontSize="small" /> : <SmartToyTwoToneIcon fontSize="small" />}
                </Avatar>
                <Paper elevation={0} sx={{
                  p: 1.8, px: 2.2, maxWidth: '80%',
                  borderRadius: m.role === 'user' ? '16px 2px 16px 16px' : '2px 16px 16px 16px',
                  background: m.role === 'user' ? 'linear-gradient(135deg, #0f4c75 0%, #1b6ca8 100%)' : '#fff',
                  color: m.role === 'user' ? 'white' : '#1e293b',
                  border: '1px solid #e2e8f0',
                }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.65, fontSize: '0.92rem' }}>
                    {renderMarkdown(m.content)}
                  </Typography>
                </Paper>
              </Box>
            </Grow>
          ))}

          {loading && (
            <Fade in timeout={300}>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <PulsingAvatar isloading="true" sx={{ bgcolor: 'white', color: '#0f4c75', width: 34, height: 34, border: '1px solid #e2e8f0' }}>
                  <SmartToyTwoToneIcon fontSize="small" />
                </PulsingAvatar>
                <Paper sx={{ p: 1.5, px: 2.5, borderRadius: '2px 16px 16px 16px', bgcolor: 'white', border: '1px solid #e2e8f0', display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TypingDot /><TypingDot /><TypingDot />
                </Paper>
              </Box>
            </Fade>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title="Seçerek Anlat">
            <Button
              size="small"
              onClick={() => { setWizard({ region: null, symptom: null, severity: 5, onset: null, trigger: null, redFlags: [] }); setStep('region'); }}
              sx={{
                minWidth: 'auto', px: 1.2, py: 0.6, borderRadius: '8px',
                border: '1.5px solid #e2e8f0', textTransform: 'none',
                color: '#64748b', fontSize: '0.75rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 0.5, whiteSpace: 'nowrap',
                '&:hover': { borderColor: '#1b6ca8', color: '#1b6ca8', bgcolor: '#f0f8ff' },
              }}
            >
              <TouchApp sx={{ fontSize: 16 }} />
              Seçerek Anlat
            </Button>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{ my: 1 }} />
          <TextField
            fullWidth multiline maxRows={4} value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
            placeholder="Mesajını yaz..." variant="standard"
            InputProps={{ disableUnderline: true, sx: { px: 1, fontSize: '0.92rem' } }}
          />
          <IconButton
            onClick={sendMessage} disabled={loading || !input.trim()}
            sx={{
              width: 44, height: 44,
              background: input.trim() ? 'linear-gradient(135deg, #0f4c75 0%, #1b6ca8 100%)' : '#f1f5f9',
              color: 'white', borderRadius: '10px',
              '&:hover': { opacity: 0.9 },
              '&.Mui-disabled': { color: '#cbd5e1', background: '#f1f5f9' },
            }}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}
