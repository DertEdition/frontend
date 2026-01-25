import Box from "@mui/material/Box";
import { Sidebar } from './components/Sidebar';
import { ChatPanel } from './components/ChatPanel';
import { Dashboard } from './components/Dashboard';
import { MedicationTracking } from './components/MedicationTracking';
import { useState } from "react";
import { Typography } from '@mui/material';

type ViewType = 'dashboard' | 'bodymap' | 'blood' | 'mri' | 'medication' | 'chat';

function App() {  

  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'chat':
        return <ChatPanel />;
      case 'bodymap':
        return <Typography variant="h4">Body Map - Yakında...</Typography>;
      case 'blood':
        return <Typography variant="h4">Kan Testleri - Yakında...</Typography>;
      case 'mri':
        return <Typography variant="h4">MRI Sonuçları - Yakında...</Typography>;
      case 'medication':
        return <MedicationTracking />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar activeView={activeView} onViewChange={(view) => setActiveView(view as ViewType)} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {renderView()}
      </Box>
    </Box>
  )
}

export default App
