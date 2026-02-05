import { Box, Card, CardContent, Typography } from '@mui/material';
import { Header } from './Header';

export function Dashboard() {
  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Header />

      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(33.333% - 16px)' } }}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  BMI Status
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Kart içeriği buraya gelecek...
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Blood Test Summary */}
          <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(33.333% - 16px)' } }}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Blood Tests
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Kart içeriği buraya gelecek...
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Medication Schedule */}
          <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(33.333% - 16px)' } }}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Today's Medications
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Kart içeriği buraya gelecek...
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Medical Documents Upload */}
          <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(33.333% - 16px)' } }}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Medical Documents
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Kart içeriği buraya gelecek...
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* AI Health Assistant */}
          <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(66.666% - 16px)' } }}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  AI Health Assistant
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Kart içeriği buraya gelecek...
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};