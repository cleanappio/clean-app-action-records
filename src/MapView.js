/* import React, { useState, useEffect } from "react";
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
*/

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polygon, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

const MapView = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [polygon, setPolygon] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error("Error fetching user location:", error);
      }
    );
  }, []);

  const handleCreated = (e) => {
    if (e.layerType === "polygon") {
      const newPolygon = e.layer.getLatLngs()[0].map((latlng) => [latlng.lat, latlng.lng]);
      setPolygon(newPolygon);
      console.log(newPolygon);
    }
  };

  return (
    <MapContainer center={userLocation || [51.505, -0.09]} zoom={15} style={{ height: "100vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {userLocation && <Marker position={userLocation} />}
      {polygon && <Polygon positions={polygon} color="blue" />}
      <FeatureGroup>
        <EditControl
          position="topright"
          draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
            polygon: true,
          }}
          onCreated={handleCreated}
        />
      </FeatureGroup>
    </MapContainer>
  );
};

export default MapView;


