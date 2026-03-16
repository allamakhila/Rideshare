import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function RideMap({ rides }) {

  return (
    <MapContainer
      center={[17.385044, 78.486671]} // Default center (Hyderabad)
      zoom={6}
      style={{ height: "400px", width: "100%", marginTop: "20px" }}
    >

      {/* Map Tiles */}
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Ride Markers */}
      {rides.map((ride) => {

        const lat = ride.sourceLat || 17.385044;
const lng = ride.sourceLng || 78.486671;

        return (
          <Marker key={ride.id} position={[lat, lng]}>
            <Popup>

              <strong>
                {ride.source} → {ride.destination}
              </strong>

              <br />
              Driver: {ride.driverEmail}

              <br />
              Price: ₹{ride.price}

              <br />
              Seats Available: {ride.availableSeats}

            </Popup>
          </Marker>
        );
      })}

    </MapContainer>
  );
}

export default RideMap;