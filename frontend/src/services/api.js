import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8081/api",
});

export default API;

// Milestone 2 - Dynamic Fare Calculation
export const calculateFare = (data) => {
  return axios.get("http://localhost:8081/fare/calculate", {
    params: {
      pickupLat: data.pickupLat,
      pickupLng: data.pickupLng,
      dropLat: data.dropLat,
      dropLng: data.dropLng,
      vehicleType: data.vehicleType,
      waitingMinutes: data.waitingMinutes
    }
  });
};