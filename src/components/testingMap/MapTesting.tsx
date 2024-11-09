import React, { useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import logger from '@/lib/logger';

// Set up your Google Maps API key

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const options = {
  zoomControl: true,
};

const MyComponent = ({
  setLatLng,
  lat,
  lng,
}: {
  setLatLng?: any;
  lat?: number;
  lng?: number;
}) => {
  // Load the Google Maps script
  const center = {
    lat: lat ? lat : -34.397,
    lng: lng ? lng : 150.644,
  };
  const [clickedLatLng, setClickedLatLng] = useState<any>(center);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API ?? "",
    libraries: ['places'],
  });

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading maps';
  const handleMapClick = (event: any) => {
    var lat = event.latLng.lat();
    var Lng = event.latLng.lng();

    logger({ lat, Lng }, 'gfdsgdfsg');
    setLatLng({
      lat: lat,
      lng: Lng,
    });
    setClickedLatLng({
      lat: lat,
      lng: Lng,
    });
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={8}
      options={options}
      onClick={handleMapClick}
    >
      {clickedLatLng && <Marker position={clickedLatLng} />}
    </GoogleMap>
  );
};

export default MyComponent;
