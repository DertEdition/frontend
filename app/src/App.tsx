import Box from "@mui/material/Box";
import { Sidebar } from './components/Sidebar';
import { ChatPanel } from './components/ChatPanel';
import { Dashboard } from './components/Dashboard';
import { MedicationTracking } from './components/MedicationTracking'; import { BodyMap } from './components/BodyMap'; import { HealthProfile } from './components/HealthProfile'; import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { useState } from "react";
import { useAuth } from './context/AuthContext';
import { BloodTest } from "./components/BloodTest";

type ViewType = 'dashboard' | 'profile' | 'bodymap' | 'blood' | 'medication' | 'chat';

function App() {
  const { isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [showRegister, setShowRegister] = useState(false);

  if (!isAuthenticated) {
    return showRegister
      ? <Register onSwitchToLogin={() => setShowRegister(false)} />
      : <Login onSwitchToRegister={() => setShowRegister(true)} />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return <HealthProfile />;
      case 'chat':
        return <ChatPanel />;
      case 'bodymap':
        return <BodyMap onNavigateToChat={() => setActiveView('chat')} />;
      case 'blood':
        return <BloodTest/>
      case 'medication':
        return <MedicationTracking />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', bgcolor: '#e5e7eb' }}>
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', maxWidth: 1440, width: '100%', bgcolor: 'white' }}>
        <Sidebar activeView={activeView} onViewChange={(view) => setActiveView(view as ViewType)} />

        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            {renderView()}
          </Box>
        </Box>

      </Box>
    </Box>
  )
}

export default App
