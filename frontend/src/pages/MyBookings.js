import React from "react";

function MyBookings() {

  const bookings = [
    { driver: "Akhil", status: "Confirmed" },
    { driver: "Ravi", status: "Pending" }
  ];

  return (
    <div style={{ padding: "30px" }}>
      <h2>My Bookings</h2>

      {bookings.map((booking, index) => (
        <div key={index}>
          <p>
            Driver: {booking.driver} | Status: {booking.status}
          </p>
        </div>
      ))}
    </div>
  );
}

export default MyBookings;