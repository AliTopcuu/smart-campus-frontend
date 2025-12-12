import { useState, useMemo } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import { calculateDistance, formatDistance } from '@/utils/distanceCalculator';

// Mock session data - Backend'den gelecek
const getMockSessionData = (sessionId) => ({
  id: sessionId,
  course: {
    code: 'CENG204',
    name: 'Veri Yapıları ve Algoritmalar',
  },
  instructor: 'Prof. Dr. Ahmet Yılmaz',
  startTime: new Date(Date.now() + 30 * 60 * 1000), // 30 dakika sonra
  endTime: new Date(Date.now() + 90 * 60 * 1000), // 90 dakika sonra
  classroom: {
    name: 'B Blok 101',
    location: {
      lat: 41.036667, // RTÜ Zihni Derin Kampüsü (41°2'12"N) - Backend'den gelecek (hoca yoklama oluştururken cihazından alınacak)
      lng: 40.494167, // RTÜ Zihni Derin Kampüsü (40°29'39"E)
    },
  },
  geofenceRadius: 250, // metre - 250 metre içindeki kişiler yoklamaya katılabilir
});

export const GiveAttendancePage = () => {
  const { sessionId } = useParams();
  const toast = useToast();
  const [location, setLocation] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, loading, ready, success, error
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Mock session data
  const sessionData = useMemo(() => getMockSessionData(sessionId), [sessionId]);

  // Mesafe hesaplama
  const distance = useMemo(() => {
    if (!location || !sessionData.classroom.location) return null;
    return calculateDistance(
      location.lat,
      location.lon,
      sessionData.classroom.location.lat,
      sessionData.classroom.location.lng
    );
  }, [location, sessionData]);

  // Geofence içinde mi kontrolü
  const isWithinGeofence = useMemo(() => {
    if (!distance) return false;
    return distance <= sessionData.geofenceRadius;
  }, [distance, sessionData.geofenceRadius]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Tarayıcınız konum servislerini desteklemiyor.');
      return;
    }

    setStatus('loading');
    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (result) => {
        const userLat = result.coords.latitude;
        const userLon = result.coords.longitude;
        const userAccuracy = result.coords.accuracy;

        setLocation({ lat: userLat, lon: userLon });
        setAccuracy(userAccuracy);
        setStatus('ready');
        setIsGettingLocation(false);

        // Accuracy uyarısı (bilgisayarlarda genellikle düşük accuracy)
        if (userAccuracy > 1000) {
          toast.warning(
            `Konum alındı ancak doğruluk düşük (±${Math.round(userAccuracy)}m). Bilgisayarlarda GPS olmadığı için konum WiFi/IP tabanlıdır ve yanlış olabilir. Telefondan test etmeniz önerilir.`
          );
        }

        // Mesafe kontrolü
        const calculatedDistance = calculateDistance(
          userLat,
          userLon,
          sessionData.classroom.location.lat,
          sessionData.classroom.location.lng
        );

        if (calculatedDistance > sessionData.geofenceRadius) {
          toast.warning(
            `Kampüse uzaklığınız: ${formatDistance(calculatedDistance)}. Geofence yarıçapı: ${sessionData.geofenceRadius}m`
          );
        } else {
          toast.success(`Konum başarıyla alındı ve kampüs bölgesi içindesiniz. Mesafe: ${formatDistance(calculatedDistance)}`);
        }
      },
      (error) => {
        setIsGettingLocation(false);
        setStatus('error');
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

  const handleSubmit = () => {
    if (!location) {
      toast.error('Önce konumunuzu alın.');
      return;
    }

    if (!isWithinGeofence) {
      toast.warning(
        `Sınıf bölgesinin dışındasınız. Mesafe: ${formatDistance(distance)}. Devam etmek istediğinizden emin misiniz?`
      );
      // Burada kullanıcıya onay sorulabilir
    }

    setStatus('success');
    toast.success('Yoklama başarıyla kaydedildi.');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Yoklamaya Katıl
      </Typography>

      {/* Session Info Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <SchoolIcon color="primary" />
              <Typography variant="h6">
                {sessionData.course.code} - {sessionData.course.name}
              </Typography>
            </Stack>

            <Divider />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTimeIcon fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Başlangıç - Bitiş
                    </Typography>
                    <Typography variant="body2">
                      {formatTime(sessionData.startTime)} - {formatTime(sessionData.endTime)}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationOnIcon fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Sınıf
                    </Typography>
                    <Typography variant="body2">{sessionData.classroom.name}</Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>

            <Typography variant="caption" color="text.secondary">
              Oturum ID: <strong>{sessionId}</strong>
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* Actions Card */}
      <Card>
        <CardContent>
          <Stack spacing={3}>
            {isGettingLocation && (
              <Box>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Konum alınıyor...
                </Typography>
                <LinearProgress />
              </Box>
            )}

            {!location && !isGettingLocation && (
              <Button
                variant="contained"
                size="large"
                startIcon={<LocationSearchingIcon />}
                onClick={getLocation}
                fullWidth
                sx={{ py: 1.5 }}
              >
                Konumumu Al
              </Button>
            )}

            {location && (
              <>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Konum Bilgileri
                  </Typography>
                  <Alert severity="info" icon={false}>
                    <Stack spacing={1}>
                      <Box>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          📍 Kampüs Konumu (Ders)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          RTÜ Zihni Derin Kampüsü
                        </Typography>
                      </Box>

                      <Divider />

                      <Box>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          📍 Öğrenci Konumu
                        </Typography>
                        <Typography variant="body2">
                          <strong>Koordinatlar:</strong> {location.lat.toFixed(6)}, {location.lon.toFixed(6)}
                        </Typography>
                        {accuracy && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>Doğruluk:</strong> ±{Math.round(accuracy)}m
                          </Typography>
                        )}
                      </Box>

                      <Divider />

                      {distance !== null && (
                        <Box>
                          <Typography variant="subtitle2" color="primary" gutterBottom>
                            📏 Mesafe Bilgisi
                          </Typography>
                          <Typography variant="body2">
                            <strong>Kampüse Mesafe:</strong> {formatDistance(distance)}
                          </Typography>
                          <Box mt={1}>
                            <Chip
                              label={isWithinGeofence ? `250 Metre İçinde ✓ (${Math.round(distance)}m)` : `250 Metre Dışında ✗ (${Math.round(distance)}m)`}
                              color={isWithinGeofence ? 'success' : 'warning'}
                              size="small"
                            />
                          </Box>
                        </Box>
                      )}
                    </Stack>
                  </Alert>
                </Stack>

                <Button
                  variant="contained"
                  size="large"
                  disabled={status === 'loading' || status === 'success' || !isWithinGeofence}
                  startIcon={status === 'success' ? <CheckCircleIcon /> : <CheckCircleIcon />}
                  onClick={handleSubmit}
                  fullWidth
                  sx={{ py: 1.5 }}
                  color={isWithinGeofence ? 'primary' : 'error'}
                >
                  {status === 'success' ? 'Yoklamaya Katıldınız ✓' : isWithinGeofence ? 'Yoklamaya Katıl' : '250 Metre İçinde Değilsiniz'}
                </Button>
                {!isWithinGeofence && distance !== null && (
                  <Alert severity="warning">
                    Sınıfa uzaklığınız {formatDistance(distance)}. Yoklamaya katılmak için kampüsün 250 metre içinde olmanız gerekiyor.
                  </Alert>
                )}
              </>
            )}

            {status === 'error' && (
              <Button variant="outlined" onClick={getLocation} startIcon={<LocationSearchingIcon />}>
                Tekrar Dene
              </Button>
            )}

            {status === 'success' && (
              <Alert severity="success">Yoklama başarıyla kaydedildi!</Alert>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

