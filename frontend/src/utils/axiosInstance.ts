import axios from "axios";

const serverUrl = import.meta.env.SERVER_URL;

const axiosInstance = axios.create({
  baseURL: serverUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
