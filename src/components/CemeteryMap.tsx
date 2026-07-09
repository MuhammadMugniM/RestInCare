import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon path issues with React
// @ts-ignore
import iconUrl from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
// @ts-ignore
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

export interface Cemetery {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
}

const DUMMY_CEMETERIES: Cemetery[] = [
  // Bandung
  { id: 'b1', name: 'TPU Cikutra', city: 'Bandung', lat: -6.8929, lng: 107.6358 },
  { id: 'b2', name: 'TPU Cikadut', city: 'Bandung', lat: -6.8992, lng: 107.6616 },
  { id: 'b3', name: 'TPU Pandu', city: 'Bandung', lat: -6.9038, lng: 107.5925 },
  { id: 'b4', name: 'TPU Sirnaraga', city: 'Bandung', lat: -6.8913, lng: 107.5878 },
  { id: 'b5', name: 'TPU Astana Anyar', city: 'Bandung', lat: -6.9317, lng: 107.5997 },
  { id: 'b6', name: 'TPU Cibarunay', city: 'Bandung', lat: -6.8837, lng: 107.5841 },
  { id: 'b7', name: 'TPU Maleer', city: 'Bandung', lat: -6.9248, lng: 107.6358 },
  { id: 'b8', name: 'TPU Legok Ciseureuh', city: 'Bandung', lat: -6.9532, lng: 107.6186 },
  { id: 'b9', name: 'TPU Nagrog', city: 'Bandung', lat: -6.9184, lng: 107.6974 },
  { id: 'b10', name: 'TPU Babakan Ciparay', city: 'Bandung', lat: -6.9388, lng: 107.5758 },
  { id: 'b11', name: 'TPU Rancacili', city: 'Bandung', lat: -6.9546, lng: 107.6627 },
  { id: 'b12', name: 'TPU Porib', city: 'Bandung', lat: -6.9254, lng: 107.5888 },
  { id: 'b13', name: 'TPU Gumuruh', city: 'Bandung', lat: -6.9348, lng: 107.6321 },
  { id: 'b14', name: 'TPU Kopo', city: 'Bandung', lat: -6.9423, lng: 107.5826 },
];

interface CemeteryMapProps {
  onSelectCemetery: (city: string, name: string) => void;
  selectedCemeteryName?: string;
}

export default function CemeteryMap({ onSelectCemetery, selectedCemeteryName }: CemeteryMapProps) {
  // Center to Bandung
  const defaultCenter: [number, number] = [-6.914744, 107.609810];

  return (
    <div className="w-full">
      <div className="h-[350px] w-full rounded-xl overflow-hidden border border-[#eae7e9] shadow-inner mb-4 relative z-0">
        <MapContainer 
          center={defaultCenter} 
          zoom={9} 
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {DUMMY_CEMETERIES.map(cemetery => (
            <Marker 
              key={cemetery.id} 
              position={[cemetery.lat, cemetery.lng]}
              icon={customIcon}
            >
              <Popup className="font-sans">
                <div className="text-center p-1">
                  <h4 className="font-bold text-[#333e50] mb-1">{cemetery.name}</h4>
                  <p className="text-xs text-gray-500 mb-3">{cemetery.city}</p>
                  <button
                    type="button" // prevent form submission
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectCemetery(cemetery.city, cemetery.name);
                    }}
                    className="px-4 py-2 bg-[#546258] hover:bg-[#3d4a41] text-white text-xs font-bold rounded-lg transition-colors w-full cursor-pointer"
                  >
                    Pilih Lokasi Ini
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {selectedCemeteryName ? (
        <div className="p-4 bg-[#d5e3d7]/30 border border-[#d5e3d7] rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="w-8 h-8 rounded-full bg-[#546258] text-white flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#546258] uppercase tracking-wider">Lokasi Terpilih</p>
            <p className="text-sm font-bold text-[#333e50]">{selectedCemeteryName}</p>
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-500 italic">Silakan pilih lokasi pemakaman melalui peta di atas.</p>
      )}
    </div>
  );
}
