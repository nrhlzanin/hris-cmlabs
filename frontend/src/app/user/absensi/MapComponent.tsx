'use client';

import { useEffect, useRef } from 'react';

interface MapComponentProps {
  lat: number;
  lng: number;
}

export default function MapComponent({ lat, lng }: MapComponentProps) {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamic import Leaflet di useEffect
    const initMap = async () => {
      const L = (await import('leaflet')).default;
      
      // Import CSS
      await import('leaflet/dist/leaflet.css');

      // Fix untuk icon marker di Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Cleanup existing map if exists
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      // Clear container
      if (mapContainerRef.current) {
        mapContainerRef.current.innerHTML = '';
      }

      // Check if container exists
      if (!mapContainerRef.current) return;

      // Inisialisasi map
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 15,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: false,
        keyboard: false,
        zoomControl: false
      });

      mapRef.current = map;

      // Tambahkan tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Tambahkan marker
      const marker = L.marker([lat, lng]).addTo(map);
      marker.bindPopup('Your Current Location').openPopup();

      // Tambahkan circle untuk menunjukkan area akurasi
      L.circle([lat, lng], {
        color: 'blue',
        fillColor: '#3388ff',
        fillOpacity: 0.2,
        radius: 100
      }).addTo(map);
    };

    initMap();

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng]);

  return (
    <div 
      ref={mapContainerRef}
      className="w-full h-52"
      style={{ zIndex: 1 }}
    />
  );
}