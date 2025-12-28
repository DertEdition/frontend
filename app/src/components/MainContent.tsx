import React from 'react';
import { Box, Toolbar } from '@mui/material';
import Dashboard from './Dashboard';
import BMICalculator from './BMICalculator';
import BloodTest from './BloodTest';
import MedicationPlanner from './MedicationPlanner';
import ChatBot from './ChatBot';

interface MainContentProps {
  selectedItem: string;
  onMenuChange: (item: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({ selectedItem, onMenuChange }) => {
  const renderContent = () => {
    switch (selectedItem) {
      case 'Ana Sayfa':
        return <Dashboard onCardClick={onMenuChange} />;
      case 'BMI Hesaplama':
        return <BMICalculator />;
      case 'Kan Tahlili':
        return <BloodTest />;
      case 'İlaç Planlayıcı':
        return <MedicationPlanner />;
      case 'ChatBot':
        return <ChatBot />;
      default:
        return <Dashboard onCardClick={onMenuChange} />;
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      {renderContent()}
    </Box>
  );
};

export default MainContent;
