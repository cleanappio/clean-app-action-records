/*
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polygon, FeatureGroup, Popup, useMapEvents } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { Modal, Input, Form, message, Spin } from "antd";
import L from "leaflet";

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149059.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const LocationUpdater = ({ onBoundsChange }) => {
  useMapEvents({
    moveend: (e) => {
      const bounds = e.target.getBounds();
      onBoundsChange(bounds);
    },
    zoomend: (e) => {
      const bounds = e.target.getBounds();
      onBoundsChange(bounds);
    },
  });
  return null;
};

const MapView = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [polygons, setPolygons] = useState([]);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const featureGroupRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = [position.coords.latitude, position.coords.longitude];
        setUserLocation(location);
      },
      (error) => {
        console.error("Error fetching user location:", error);
      }
    );
  }, []);

  const fetchPolygonsInBounds = (bounds) => {
    axios.get("http://dev.api.cleanapp.io:8080/get_areas")
      .then((response) => {
        const filtered = response.data.filter(area => {
          const coords = area.coordinates?.geometry?.coordinates[0].map(([lng, lat]) => [lat, lng]) || [];
          return coords.some(([lat, lng]) => bounds.contains([lat, lng]));
        }).map(area => ({
          ...area,
          coordinates: area.coordinates?.geometry?.coordinates[0].map(([lng, lat]) => [lat, lng]) || []
        }));
        setPolygons(filtered);
      })
      .catch((error) => console.error("Error fetching polygons:", error));
  };

  const handleCreated = (e) => {
    if (e.layerType === "polygon") {
      const latlngs = e.layer.getLatLngs()[0].map(({ lat, lng }) => [lat, lng]);
      setSelectedPolygon({
        id: null,
        name: "",
        description: "",
        contact_name: "",
        contract_emails: [],
        coordinates: latlngs,
        is_custom: true
      });
      form.resetFields();
      setIsModalVisible(true);
    }
  };

  const handleEditPolygon = (polygon) => {
    setSelectedPolygon({ ...polygon });
    form.setFieldsValue({
      name: polygon.name,
      description: polygon.description,
      contact_name: polygon.contact_name,
      contract_emails: polygon.contract_emails?.map(c => c.email).join(", ") || ""
    });
    setIsModalVisible(true);
  };

  const handleSavePolygon = async () => {
    try {
      const values = await form.validateFields();
      const latLngs = selectedPolygon.coordinates;
      const closed = [...latLngs];
      if (closed.length && (closed[0][0] !== closed.at(-1)[0] || closed[0][1] !== closed.at(-1)[1])) {
        closed.push(closed[0]);
      }

      const geoJSONCoordinates = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [closed.map(([lat, lng]) => [lng, lat])]
        }
      };

      const payload = {
        version: "2.0",
        area: {
          id: selectedPolygon.id,
          name: values.name,
          description: values.description,
          contact_name: values.contact_name,
          is_custom: true,
          contract_emails: values.contract_emails
            .split(",")
            .map(email => email.trim())
            .filter(email => email)
            .map(email => ({ email })),
          coordinates: geoJSONCoordinates,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };

      const response = await axios.post("http://dev.api.cleanapp.io:8080/create_or_update_area", payload);
      if (response.status === 200) {
        message.success(selectedPolygon.id ? "Polygon updated successfully" : "Polygon created successfully");
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Failed to save polygon:", error);
      if (error.response) {
        console.error("Response error:", error.response.data);
        message.error("Failed to save polygon. Please check the console for errors.");
      } else {
        console.error("Error:", error.message);
        message.error("Network error: " + error.message);
      }
    }
  };

  return (
    <>
      {!userLocation ? (
        <div style={{ textAlign: "center", paddingTop: "40vh" }}>
          <Spin size="large" tip="Getting your location..." />
        </div>
      ) : (
        <MapContainer
          center={userLocation}
          zoom={15}
          style={{ height: "100vh", width: "100%" }}
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
            fetchPolygonsInBounds(mapInstance.getBounds());
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={userLocation} icon={userIcon} />

          <LocationUpdater onBoundsChange={fetchPolygonsInBounds} />

          {polygons.map((polygon) => (
            <Polygon
              key={polygon.id || Math.random()}
              positions={polygon.coordinates}
              color="blue"
              eventHandlers={{ click: () => handleEditPolygon(polygon) }}
            >
              <Popup>{polygon.name}</Popup>
            </Polygon>
          ))}

          <FeatureGroup ref={featureGroupRef}>
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
      )}

      <Modal
        title="Polygon Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSavePolygon}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter a name!" }]}> <Input /> </Form.Item>
          <Form.Item name="description" label="Description"> <Input.TextArea /> </Form.Item>
          <Form.Item name="contact_name" label="Contact Name"> <Input /> </Form.Item>
          <Form.Item name="contract_emails" label="Contact Emails"> <Input placeholder="Separate multiple emails with commas" /> </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MapView; */
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polygon, FeatureGroup, Popup, useMapEvents } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { Modal, Input, Form, message, Spin } from "antd";
import L from "leaflet";

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149059.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const LocationUpdater = ({ onBoundsChange }) => {
  useMapEvents({
    moveend: (e) => onBoundsChange(e.target.getBounds()),
    zoomend: (e) => onBoundsChange(e.target.getBounds()),
  });
  return null;
};

const MapView = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [polygons, setPolygons] = useState([]);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const featureGroupRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = [position.coords.latitude, position.coords.longitude];
        setUserLocation(location);
      },
      (error) => {
        console.error("Error fetching user location:", error);
      }
    );
  }, []);

  const fetchPolygonsInBounds = (bounds) => {
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const url = `http://dev.api.cleanapp.io:8080/get_areas?sw_lat=${sw.lat}&sw_lon=${sw.lng}&ne_lat=${ne.lat}&ne_lon=${ne.lng}`;

    axios.get(url)
      .then((response) => {
        const filtered = response.data.map(area => ({
          ...area,
          coordinates: area.coordinates?.geometry?.coordinates[0].map(([lng, lat]) => [lat, lng]) || []
        }));
        setPolygons(filtered);
      })
      .catch((error) => console.error("Error fetching polygons:", error));
  };

  const handleCreated = (e) => {
    if (e.layerType === "polygon") {
      const latlngs = e.layer.getLatLngs()[0].map(({ lat, lng }) => [lat, lng]);
      setSelectedPolygon({
        id: null,
        name: "",
        description: "",
        contact_name: "",
        contract_emails: [],
        coordinates: latlngs,
        is_custom: true
      });
      form.resetFields();
      setIsModalVisible(true);
    }
  };

  const handleEditPolygon = (polygon) => {
    setSelectedPolygon({ ...polygon });
    console.log(polygon);
    form.setFieldsValue({
      name: polygon.name,
      description: polygon.description,
      contact_name: polygon.contact_name,
      contract_emails: polygon.contract_emails?.map(c => c.email).join(", ") || ""
    });
    setIsModalVisible(true);
  };

  const handleSavePolygon = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
      const latLngs = selectedPolygon.coordinates;
      const closed = [...latLngs];
      if (closed.length && (closed[0][0] !== closed.at(-1)[0] || closed[0][1] !== closed.at(-1)[1])) {
        closed.push(closed[0]);
      }

      const geoJSONCoordinates = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [closed.map(([lat, lng]) => [lng, lat])]
        }
      };

      const updatedPolygon = {
        ...selectedPolygon,
        name: values.name,
        description: values.description,
        contact_name: values.contact_name,
        contract_emails: values.contract_emails
          .split(",")
          .map(email => email.trim())
          .filter(Boolean)
          .map(email => ({ email })),
        coordinates: closed
      };

      const payload = {
        version: "2.0",
        area: {
          id: updatedPolygon.id,
          name: updatedPolygon.name,
          description: updatedPolygon.description,
          contact_name: updatedPolygon.contact_name,
          is_custom: true,
          contract_emails: updatedPolygon.contract_emails,
          coordinates: geoJSONCoordinates,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };

      const response = await axios.post("http://dev.api.cleanapp.io:8080/create_or_update_area", payload);
      if (response.status === 200) {
        message.success(updatedPolygon.id ? "Polygon updated successfully" : "Polygon created successfully");

        setPolygons(prev =>
          updatedPolygon.id
            ? prev.map(p => p.id === updatedPolygon.id ? updatedPolygon : p)
            : [...prev, { ...updatedPolygon, id: response.data?.id || Math.random() }]
        );
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Failed to save polygon:", error);
      message.error("Failed to save polygon.");
    }
  };

  return (
    <>
      {!userLocation ? (
        <div style={{ textAlign: "center", paddingTop: "40vh" }}>
          <Spin size="large" tip="Getting your location..." />
        </div>
      ) : (
        <MapContainer
          center={userLocation}
          zoom={15}
          style={{ height: "100vh", width: "100%" }}
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
            fetchPolygonsInBounds(mapInstance.getBounds());
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={userLocation} icon={userIcon} />

          <LocationUpdater onBoundsChange={fetchPolygonsInBounds} />

          {polygons.map((polygon) => (
            <Polygon
              key={polygon.id || Math.random()}
              positions={polygon.coordinates}
              color="blue"
              eventHandlers={{ click: () => handleEditPolygon(polygon) }}
            >
              <Popup>
                <strong>{polygon.name}</strong>
                <div>{polygon.description}</div>
              </Popup>
            </Polygon>
          ))}

          <FeatureGroup ref={featureGroupRef}>
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
      )}

      <Modal
        title="Polygon Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSavePolygon}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter a name!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="contact_name" label="Contact Name">
            <Input />
          </Form.Item>
          <Form.Item name="contract_emails" label="Contact Emails">
            <Input placeholder="Separate multiple emails with commas" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MapView;
