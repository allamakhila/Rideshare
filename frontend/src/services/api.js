import axios from "axios";

const API = axios.create({
  baseURL: "https://rideshare-backend.onrender.com/api",
});

export default API;

export const calculateFare = (data) => {
  return axios.get("https://rideshare-backend.onrender.com/fare/calculate", {
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