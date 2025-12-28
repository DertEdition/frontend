import React, { useState } from 'react';
import { Box } from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

function App() {
  const [selectedItem, setSelectedItem] = useState('Ana Sayfa');

  const menuItems = [
    'Ana Sayfa',
    'BMI Hesaplama',
    'Kan Tahlili',
    'İlaç Planlayıcı',
    'ChatBot',
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Sidebar
        menuItems={menuItems}
        selectedItem={selectedItem}
        onSelectItem={setSelectedItem}
      />
      <MainContent 
        selectedItem={selectedItem}
        onMenuChange={setSelectedItem}
      />
    </Box>
  );
}

export default App;
