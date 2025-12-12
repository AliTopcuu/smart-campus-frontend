import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, MenuItem, LinearProgress, Stack, TextField, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrowRounded';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useToast } from '@/hooks/useToast';

const mockSections = [
  { id: 'SEC-01', label: 'CENG204 - Section 01' },
  { id: 'SEC-02', label: 'CENG204 - Section 02' },
];

export const StartAttendancePage = () => {
  const toast = useToast();
  const [section, setSection] = useState(mockSections[0].id);
  const [radius, setRadius] = useState(250); // Default 250 metre
  const [duration, setDuration] = useState(30);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [classroomLocation, setClassroomLocation] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const getInstructorLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Tarayıcınız konum servislerini desteklemiyor.');
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (result) => {
        const location = {
          lat: result.coords.latitude,
          lng: result.coords.longitude,
          accuracy: result.coords.accuracy,
        };
        setClassroomLocation(location);
        setIsGettingLocation(false);
        toast.success('Sınıf konumu başarıyla alındı. Şimdi oturumu başlatabilirsiniz.');
      },
      (error) => {
        setIsGettingLocation(false);
        let errorMessage = 'Konum alınamadı.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Konum izni reddedildi. Lütfen tarayıcı ayarlarından izin verin.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Konum bilgisi alınamıyor.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Konum alma işlemi zaman aşımına uğradı.';
            break;
        }
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleStartSession = () => {
    // Eğer konum alınmadıysa, RTÜ kampüs konumunu default olarak kullan
    const location = classroomLocation || {
      lat: 41.036667, // RTÜ Zihni Derin Kampüsü default koordinatları (41°2'12"N)
      lng: 40.494167, // RTÜ Zihni Derin Kampüsü default koordinatları (40°29'39"E)
      accuracy: null,
    };

    const code = `QR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setSessionInfo({
      code,
      expiresAt: new Date(Date.now() + duration * 60000).toLocaleTimeString(),
      location: location,
      radius: radius,
    });
    toast.success(`Yoklama oturumu başlatıldı. Konum: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`);
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Yoklama Başlat
      </Typography>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              select
              label="Section"
              value={section}
              onChange={(event) => setSection(event.target.value)}
            >
              {mockSections.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="outlined"
              startIcon={<LocationOnIcon />}
              onClick={getInstructorLocation}
              disabled={isGettingLocation}
              fullWidth
            >
              {isGettingLocation ? 'Konum alınıyor...' : 'Sınıf Konumunu Al (Cihazımdan)'}
            </Button>

            {isGettingLocation && <LinearProgress />}

            {classroomLocation && (
              <Alert severity="success">
                Sınıf konumu alındı: {classroomLocation.lat.toFixed(6)}, {classroomLocation.lng.toFixed(6)}
                {classroomLocation.accuracy && ` (±${Math.round(classroomLocation.accuracy)}m)`}
              </Alert>
            )}

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                label="Geofence Yarıçapı (metre)"
                type="number"
                value={radius}
                onChange={(event) => setRadius(Number(event.target.value))}
                fullWidth
                helperText="Kampüs çevresindeki yarıçap (default: 250m)"
              />
              <TextField
                label="Süre (dakika)"
                type="number"
                value={duration}
                onChange={(event) => setDuration(Number(event.target.value))}
                fullWidth
              />
            </Stack>
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={handleStartSession}
              disabled={isGettingLocation}
            >
              Oturumu Başlat
            </Button>
            {sessionInfo && (
              <Alert severity="success">
                QR Kodu: <strong>{sessionInfo.code}</strong> • Süre sonu: {sessionInfo.expiresAt}
              </Alert>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

