import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "https://fintechbackend.online/api";

const publicClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

export default publicClient;