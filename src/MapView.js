/*
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polygon, FeatureGroup, useMap } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

const MapView = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [polygons, setPolygons] = useState([]);
  const featureGroupRef = useRef(null);

  useEffect(() => {
    const savedPolygons = localStorage.getItem("polygonData");
    try {
      const parsedPolygons = savedPolygons ? JSON.parse(savedPolygons) : [];
      setPolygons(Array.isArray(parsedPolygons) ? parsedPolygons : []);
    } catch (error) {
      console.error("Error parsing stored polygons:", error);
      setPolygons([]);
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = [position.coords.latitude, position.coords.longitude];
        setUserLocation(location);
      },
      (error) => console.error("Error fetching user location:", error)
    );
  }, []);

  const savePolygonsToLocalStorage = (polygonData) => {
    localStorage.setItem("polygonData", JSON.stringify(polygonData));
  };

  const handleCreated = (e) => {
    if (e.layerType === "polygon") {
      const newPolygon = e.layer.getLatLngs()[0].map((latlng) => [latlng.lat, latlng.lng]);
      setPolygons((prev) => {
        const updatedPolygons = [...prev, newPolygon];
        savePolygonsToLocalStorage(updatedPolygons);
        return updatedPolygons;
      });
    }
  };

  const handleEdited = (e) => {
    const updatedPolygons = [];
    e.layers.eachLayer((layer) => {
      updatedPolygons.push(layer.getLatLngs()[0].map((latlng) => [latlng.lat, latlng.lng]));
    });

    setPolygons(updatedPolygons);
    savePolygonsToLocalStorage(updatedPolygons);
  };

  const handleDeleted = (e) => {
    const deletedLayers = new Set();
    e.layers.eachLayer((layer) => {
      deletedLayers.add(layer._leaflet_id);
    });

    setPolygons((prevPolygons) => {
      const remainingPolygons = prevPolygons.filter((polygon, index) => !deletedLayers.has(index));
      savePolygonsToLocalStorage(remainingPolygons);
      return remainingPolygons;
    });
  };

  // Center the map dynamically when userLocation updates
  const MapCenterer = () => {
    const map = useMap();
    useEffect(() => {
      if (userLocation) {
        map.setView(userLocation, 15);
      }
    }, [userLocation, map]);
    return null;
  };

  return (
    <MapContainer center={userLocation || [0, 0]} zoom={15} style={{ height: "100vh", width: "100%" }}>
      <MapCenterer />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {userLocation && <Marker position={userLocation} />}
      {polygons.length > 0 &&
        polygons.map((polygon, index) => <Polygon key={index} positions={polygon} color="blue" />)}
      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topright"
          draw={{
            polygon: true,
            rectangle: false,
            circle: false,
            marker: false,
            polyline: false,
            circlemarker: false,
          }}
          onCreated={handleCreated}
          onEdited={handleEdited}
          onDeleted={handleDeleted}
        />
      </FeatureGroup>
    </MapContainer>
  );
};

export default MapView;
*/
/*
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polygon, FeatureGroup, Popup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

const API_URL = "http://dev.api.cleanapp.io:8080/get_areas";

const MapView = () => {
  const [areas, setAreas] = useState([]); // Ensure areas is an array
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Fetch areas from API
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAreas(data);
        } else {
          console.error("Invalid API response format", data);
        }
      })
      .catch((error) => console.error("Error fetching areas:", error));

    // Get user location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error("Error fetching user location:", error);
      }
    );
  }, []);

  return (
    <MapContainer center={userLocation || [51.505, -0.09]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      
      {userLocation && <Marker position={userLocation} />}

   
      {areas.length > 0 &&
        areas.map((area) => (
          <Polygon
            key={area.id}
            positions={area.coordinates.geometry.coordinates[0].map(([lng, lat]) => [lat, lng])} // Convert GeoJSON format
            color="blue"
          >
            <Popup>
              <strong>{area.name}</strong>
              <p>{area.description}</p>
              <p>Contact: {area.contact_name}</p>
            </Popup>
          </Polygon>
        ))}

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
        />
      </FeatureGroup>
    </MapContainer>
  );
};

export default MapView;
*/
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polygon, FeatureGroup, Popup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { Modal, Input, Form, message } from "antd";

const MapView = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [polygons, setPolygons] = useState([]);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const featureGroupRef = useRef();
 

  // Get the user's location on mount
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

  // Fetch polygons from the server
  useEffect(() => {
    axios.get("http://dev.api.cleanapp.io:8080/get_areas")
      .then((response) => {
        setPolygons(response.data.map(area => ({
          ...area,
          coordinates: area.coordinates?.geometry?.coordinates[0].map(([lng, lat]) => [lat, lng]) || []
        })));
      })
      .catch((error) => console.error("Error fetching polygons:", error));
  }, []);

  // Handle the creation of new polygons
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

  // Handle editing of existing polygons
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

  // Function to save or update the polygon
  const handleSavePolygon = async () => {
    try {
      // Validate form
      const values = await form.validateFields();

      // Prepare the coordinates for GeoJSON format
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
        version :"2.0",
        area:{ 
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

      // Debugging: Log the payload to ensure the data is correctly structured
      console.log("Sending payload:", payload);

      // If editing an existing polygon
      if (selectedPolygon.id) {
        const response = await axios.post(`http://dev.api.cleanapp.io:8080/create_or_update_area`, payload);
         if (response.status === 200) {
          message.success("Polygon updated successfully");
         }
        
      } else {
        // If creating a new polygon
        const response = await axios.post("http://dev.api.cleanapp.io:8080/create_or_update_area", payload);
        if (response.status === 200) {
          message.success("Polygon created successfully");
        }
        
      }

      // Close the modal and reset the form
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Failed to save polygon:", error);

      // Display appropriate error message
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
      <MapContainer center={userLocation || [51.505, -0.09]} zoom={15} style={{ height: "100vh", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {userLocation && <Marker position={userLocation} />}

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
