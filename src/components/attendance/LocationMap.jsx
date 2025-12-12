import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography } from '@mui/material';

// Leaflet marker icon'ları için default icon'ları düzelt
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Kullanıcı konumu için custom icon (mavi)
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Sınıf konumu için custom icon (kırmızı)
const classroomIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Map'i bounds'a göre otomatik ayarlayan component
function MapUpdater({ userLocation, classroomLocation }) {
  const map = useMap();

  useEffect(() => {
    if (userLocation && classroomLocation) {
      const bounds = L.latLngBounds([userLocation, classroomLocation]);
      map.fitBounds(bounds, { padding: [20, 20] });
    } else if (classroomLocation) {
      map.setView(classroomLocation, 18);
    }
  }, [map, userLocation, classroomLocation]);

  return null;
}

export const LocationMap = ({ userLocation, classroomLocation, geofenceRadius = 15 }) => {
  const mapRef = useRef(null);

  // Eğer lokasyon yoksa, varsayılan olarak İstanbul koordinatlarını kullan
  const defaultCenter = classroomLocation || [41.0082, 28.9784];

  if (!classroomLocation) {
    return (
      <Box
        sx={{
          height: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: 1,
        }}
      >
        <Typography color="text.secondary">Sınıf konumu yükleniyor...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 400, borderRadius: 1, overflow: 'hidden' }}>
      <MapContainer
        center={defaultCenter}
        zoom={18}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Sınıf konumu */}
        <Marker position={classroomLocation} icon={classroomIcon}>
          <Popup>
            <strong>Sınıf Konumu</strong>
            <br />
            Lat: {classroomLocation[0].toFixed(6)}
            <br />
            Lng: {classroomLocation[1].toFixed(6)}
          </Popup>
        </Marker>

        {/* Geofence circle (sınıf etrafında radius) */}
        <Circle
          center={classroomLocation}
          radius={geofenceRadius}
          pathOptions={{ color: '#ff0000', fillColor: '#ff0000', fillOpacity: 0.2 }}
        />

        {/* Kullanıcı konumu (varsa) */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <strong>Konumunuz</strong>
              <br />
              Lat: {userLocation[0].toFixed(6)}
              <br />
              Lng: {userLocation[1].toFixed(6)}
            </Popup>
          </Marker>
        )}

        {/* Map updater - bounds'ı ayarlar */}
        <MapUpdater userLocation={userLocation} classroomLocation={classroomLocation} />
      </MapContainer>
    </Box>
  );
};

