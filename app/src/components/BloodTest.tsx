import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';

const BloodTest: React.FC = () => {
  const testResults = [
    { test: 'Hemoglobin', value: '14.5', unit: 'g/dL', range: '12-16', status: 'normal' },
    { test: 'Beyaz Küre', value: '7.2', unit: '10³/µL', range: '4-11', status: 'normal' },
    { test: 'Trombosit', value: '250', unit: '10³/µL', range: '150-400', status: 'normal' },
    { test: 'Glukoz', value: '95', unit: 'mg/dL', range: '70-100', status: 'normal' },
    { test: 'Kolesterol', value: '185', unit: 'mg/dL', range: '<200', status: 'normal' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Kan Tahlili Sonuçları
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Son Test Tarihi: {new Date().toLocaleDateString('tr-TR')}
      </Typography>
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Test</strong></TableCell>
                  <TableCell align="right"><strong>Değer</strong></TableCell>
                  <TableCell align="right"><strong>Birim</strong></TableCell>
                  <TableCell align="right"><strong>Normal Aralık</strong></TableCell>
                  <TableCell align="center"><strong>Durum</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {testResults.map((row) => (
                  <TableRow key={row.test}>
                    <TableCell>{row.test}</TableCell>
                    <TableCell align="right">{row.value}</TableCell>
                    <TableCell align="right">{row.unit}</TableCell>
                    <TableCell align="right">{row.range}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label="Normal"
                        color="success"
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BloodTest;
