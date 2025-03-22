import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { message } from "antd";

const MapView = () => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          message.error("Failed to fetch user location.");
          console.error(error);
        }
      );
    } else {
      message.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return userLocation ? (
    <MapContainer center={userLocation} zoom={15} style={{ height: "500px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={userLocation} icon={new L.Icon({ iconUrl: "/pin-icon.png", iconSize: [25, 41] })}>
        <Popup>Your Location</Popup>
      </Marker>
    </MapContainer>
  ) : (
    <div>Loading map...</div>
  );
};

export default MapView;
