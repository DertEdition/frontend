import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
} from '@mui/material';

const BMICalculator: React.FC = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBMI = () => {
    const h = parseFloat(height) / 100; // cm to m
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const bmiValue = w / (h * h);
      setBmi(parseFloat(bmiValue.toFixed(2)));
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Zayıf', color: 'info' };
    if (bmi < 25) return { text: 'Normal', color: 'success' };
    if (bmi < 30) return { text: 'Fazla Kilolu', color: 'warning' };
    return { text: 'Obez', color: 'error' };
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        BMI Hesaplama
      </Typography>
      <Card sx={{ mt: 3, maxWidth: 500 }}>
        <CardContent>
          <TextField
            fullWidth
            label="Boy (cm)"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Kilo (kg)"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={calculateBMI}
            sx={{ mb: 2 }}
          >
            BMI Hesapla
          </Button>
          {bmi !== null && (
            <Alert severity={getBMICategory(bmi).color as any}>
              <Typography variant="h6">
                BMI: {bmi}
              </Typography>
              <Typography>
                Kategori: {getBMICategory(bmi).text}
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default BMICalculator;
