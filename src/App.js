import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';

const MapView = ({center}) => {
  const map = useMap();

  map.setView(center, map.getZoom());
  return null;
};


function App() {
  const [position, setPosition] = useState([52.40250, 16.91380]); // domyślna pozycja na mapie
  const mapRef = useRef();

  const getAddressCoordinates = async (address) => {
    const API_KEY = 'here type your api key';
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${address}&key=${API_KEY}`;
    try {
      const response = await axios.get(url);
      const { lat, lng } = response.data.results[0].geometry;
      setPosition([lat, lng]);
      mapRef.current.setView([lat, lng], mapRef.current.getZoom());
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const address = event.target.elements.address.value;
    getAddressCoordinates(address);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <label>
          Wyszukaj adres:
          <input type="text" name="address" />
        </label>
        <button type="submit">Szukaj</button>
      </form>
      <div>
        <p>Podany adres posiada nastepujace koordynaty:</p>
        <p>Szerokosc geograficzna: {position[0]}</p>
        <p>Dlugosc geograficzna: {position[1]}</p>
      </div>
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height:"700px",backgroundColor:"red",marginTop:"30px", marginBottom:'90px'}}
        whenCreated={(map) => (mapRef.current = map)}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="OpenStreetMap JEDZIEMY" />
        <Marker position={position}>
          <Popup>Twoja pozycja {position}</Popup>
        </Marker>
        <MapView center={position} />
      </MapContainer>
    </div>
  );
}

export default App;
