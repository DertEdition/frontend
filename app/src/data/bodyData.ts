export type BodyRegion =
  | 'head' | 'neck' | 'chest' | 'abdomen'
  | 'back_upper' | 'back_lower'
  | 'left_shoulder' | 'right_shoulder'
  | 'left_arm' | 'right_arm'
  | 'left_hand' | 'right_hand'
  | 'left_hip' | 'right_hip'
  | 'left_leg' | 'right_leg'
  | 'left_knee' | 'right_knee'
  | 'left_foot' | 'right_foot';

export type SymptomType =
  | 'pain' | 'swelling' | 'numbness' | 'tingling'
  | 'bruise' | 'cut' | 'burn' | 'rash'
  | 'stiffness' | 'tightness' | 'weakness' | 'cramp' | 'bleeding';

export interface RegionInfo {
  id: BodyRegion;
  name_tr: string;
  name_en: string;
  emoji: string;
  symptoms: SymptomType[];
}

export interface SymptomInfo {
  id: SymptomType;
  name_tr: string;
  name_en: string;
  icon: string;
}

export const BODY_REGIONS: Record<BodyRegion, RegionInfo> = {
  head:           { id: 'head',           name_tr: 'Baş',            name_en: 'Head',          emoji: '🧠', symptoms: ['pain','numbness','tingling','swelling','cut','rash'] },
  neck:           { id: 'neck',           name_tr: 'Boyun',          name_en: 'Neck',          emoji: '🫀', symptoms: ['pain','stiffness','swelling','numbness'] },
  chest:          { id: 'chest',          name_tr: 'Göğüs',          name_en: 'Chest',         emoji: '🫁', symptoms: ['pain','tightness','swelling','rash'] },
  abdomen:        { id: 'abdomen',        name_tr: 'Karın',          name_en: 'Abdomen',       emoji: '🤰', symptoms: ['pain','swelling','cramp','numbness'] },
  back_upper:     { id: 'back_upper',     name_tr: 'Üst Sırt',       name_en: 'Upper Back',    emoji: '🔙', symptoms: ['pain','stiffness','numbness','cramp'] },
  back_lower:     { id: 'back_lower',     name_tr: 'Bel',            name_en: 'Lower Back',    emoji: '🔛', symptoms: ['pain','stiffness','numbness','cramp','weakness'] },
  left_shoulder:  { id: 'left_shoulder',  name_tr: 'Sol Omuz',       name_en: 'Left Shoulder', emoji: '💪', symptoms: ['pain','stiffness','swelling','weakness'] },
  right_shoulder: { id: 'right_shoulder', name_tr: 'Sağ Omuz',      name_en: 'Right Shoulder',emoji: '💪', symptoms: ['pain','stiffness','swelling','weakness'] },
  left_arm:       { id: 'left_arm',       name_tr: 'Sol Kol',        name_en: 'Left Arm',      emoji: '🦾', symptoms: ['pain','swelling','bruise','numbness','weakness'] },
  right_arm:      { id: 'right_arm',      name_tr: 'Sağ Kol',       name_en: 'Right Arm',     emoji: '🦾', symptoms: ['pain','swelling','bruise','numbness','weakness'] },
  left_hand:      { id: 'left_hand',      name_tr: 'Sol El',         name_en: 'Left Hand',     emoji: '🖐️', symptoms: ['pain','swelling','numbness','tingling','cut','burn'] },
  right_hand:     { id: 'right_hand',     name_tr: 'Sağ El',        name_en: 'Right Hand',    emoji: '🖐️', symptoms: ['pain','swelling','numbness','tingling','cut','burn'] },
  left_hip:       { id: 'left_hip',       name_tr: 'Sol Kalça',      name_en: 'Left Hip',      emoji: '🦴', symptoms: ['pain','stiffness','numbness','weakness'] },
  right_hip:      { id: 'right_hip',      name_tr: 'Sağ Kalça',     name_en: 'Right Hip',     emoji: '🦴', symptoms: ['pain','stiffness','numbness','weakness'] },
  left_leg:       { id: 'left_leg',       name_tr: 'Sol Bacak',      name_en: 'Left Leg',      emoji: '🦵', symptoms: ['pain','swelling','cramp','numbness','bruise'] },
  right_leg:      { id: 'right_leg',      name_tr: 'Sağ Bacak',     name_en: 'Right Leg',     emoji: '🦵', symptoms: ['pain','swelling','cramp','numbness','bruise'] },
  left_knee:      { id: 'left_knee',      name_tr: 'Sol Diz',        name_en: 'Left Knee',     emoji: '🦿', symptoms: ['pain','swelling','stiffness','weakness'] },
  right_knee:     { id: 'right_knee',     name_tr: 'Sağ Diz',       name_en: 'Right Knee',    emoji: '🦿', symptoms: ['pain','swelling','stiffness','weakness'] },
  left_foot:      { id: 'left_foot',      name_tr: 'Sol Ayak',       name_en: 'Left Foot',     emoji: '🦶', symptoms: ['pain','swelling','numbness','tingling','cut','burn'] },
  right_foot:     { id: 'right_foot',     name_tr: 'Sağ Ayak',      name_en: 'Right Foot',    emoji: '🦶', symptoms: ['pain','swelling','numbness','tingling','cut','burn'] },
};

export const SYMPTOMS: Record<SymptomType, SymptomInfo> = {
  pain:      { id: 'pain',      name_tr: 'Ağrı',              name_en: 'Pain',      icon: '🤕' },
  swelling:  { id: 'swelling',  name_tr: 'Şişlik',            name_en: 'Swelling',  icon: '🔴' },
  numbness:  { id: 'numbness',  name_tr: 'Uyuşma',            name_en: 'Numbness',  icon: '😶' },
  tingling:  { id: 'tingling',  name_tr: 'Karıncalanma',      name_en: 'Tingling',  icon: '✨' },
  bruise:    { id: 'bruise',    name_tr: 'Morluk',            name_en: 'Bruise',    icon: '🫐' },
  cut:       { id: 'cut',       name_tr: 'Kesik',             name_en: 'Cut',       icon: '🩹' },
  burn:      { id: 'burn',      name_tr: 'Yanık',             name_en: 'Burn',      icon: '🔥' },
  rash:      { id: 'rash',      name_tr: 'Döküntü',           name_en: 'Rash',      icon: '🌸' },
  stiffness: { id: 'stiffness', name_tr: 'Sertlik / Tutulma', name_en: 'Stiffness', icon: '🔒' },
  tightness: { id: 'tightness', name_tr: 'Gerginlik',         name_en: 'Tightness', icon: '😤' },
  weakness:  { id: 'weakness',  name_tr: 'Güçsüzlük',        name_en: 'Weakness',  icon: '😫' },
  cramp:     { id: 'cramp',     name_tr: 'Kramp',             name_en: 'Cramp',     icon: '⚡' },
  bleeding:  { id: 'bleeding',  name_tr: 'Kanama',            name_en: 'Bleeding',  icon: '🩸' },
};

export const ONSET_OPTIONS = [
  { id: 'just_now',        name_tr: 'Az önce başladı',         name_en: 'Just started' },
  { id: 'few_hours',       name_tr: 'Birkaç saat önce',        name_en: 'Few hours ago' },
  { id: 'today',           name_tr: 'Bugün başladı',           name_en: 'Started today' },
  { id: '1_day',           name_tr: '1 gündür var',            name_en: '1 day' },
  { id: '2_3_days',        name_tr: '2-3 gündür devam ediyor', name_en: '2-3 days' },
  { id: '1_week',          name_tr: 'Yaklaşık 1 haftadır',     name_en: 'About 1 week' },
  { id: 'more_than_week',  name_tr: '1 haftadan uzun süredir', name_en: 'More than a week' },
  { id: 'chronic',         name_tr: 'Kronik (sürekli)',        name_en: 'Chronic' },
];

export const TRIGGER_OPTIONS = [
  { id: 'injury',         name_tr: 'Darbe / Yaralanma',   name_en: 'Injury' },
  { id: 'after_exercise', name_tr: 'Egzersiz sonrası',    name_en: 'After exercise' },
  { id: 'after_running',  name_tr: 'Koşu sonrası',        name_en: 'After running' },
  { id: 'after_eating',   name_tr: 'Yemek sonrası',       name_en: 'After eating' },
  { id: 'stress',         name_tr: 'Stres',               name_en: 'Stress' },
  { id: 'morning',        name_tr: 'Sabahları',           name_en: 'In the morning' },
  { id: 'evening',        name_tr: 'Akşamları',           name_en: 'In the evening' },
  { id: 'unknown',        name_tr: 'Bilmiyorum',          name_en: 'Unknown' },
];

export const RED_FLAGS = [
  { id: 'cannot_bear_weight',  name_tr: 'Üzerine basamıyorum',         name_en: 'Cannot bear weight' },
  { id: 'severe_pain',         name_tr: 'Çok şiddetli ağrı',           name_en: 'Severe pain' },
  { id: 'visible_deformity',   name_tr: 'Görünür şekil bozukluğu',     name_en: 'Visible deformity' },
  { id: 'loss_of_consciousness',name_tr: 'Bilinç kaybı',               name_en: 'Loss of consciousness' },
  { id: 'difficulty_breathing', name_tr: 'Nefes almada zorluk',        name_en: 'Difficulty breathing' },
  { id: 'chest_pain',          name_tr: 'Göğüs ağrısı',               name_en: 'Chest pain' },
  { id: 'high_fever',          name_tr: 'Yüksek ateş',                name_en: 'High fever' },
  { id: 'confusion',           name_tr: 'Bilinç bulanıklığı',          name_en: 'Confusion' },
  { id: 'severe_bleeding',     name_tr: 'Şiddetli kanama',            name_en: 'Severe bleeding' },
  { id: 'numbness_spreading',  name_tr: 'Yayılan uyuşukluk',          name_en: 'Spreading numbness' },
];
