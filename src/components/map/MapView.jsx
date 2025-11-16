// src/components/map/MapView.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Corrige erro do marker desaparecendo
const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// componente interno que atualiza a viewport quando coords mudam
function MapUpdater({ lat, lng }) {
    const map = useMap();

    React.useEffect(() => {
        if (lat && lng) {
            map.setView([lat, lng], 15, { animate: true });
        }
    }, [lat, lng, map]);

    return null;
}

function MapView({ lat, lng, endereco }) {
    if (!lat || !lng) return null;

    return (
        <div className="lg:mt-0 mt-6"> {/* ← ALTERAÇÃO ÚNICA AQUI */}
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Localização</h3>

            <MapContainer
                center={[lat, lng]}
                zoom={15}
                scrollWheelZoom={false}
                className="w-full h-72 rounded-lg shadow-md z-0"
            >
                <MapUpdater lat={lat} lng={lng} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[lat, lng]} icon={markerIcon}>
                    <Popup>{endereco}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}

export default React.memo(MapView);
