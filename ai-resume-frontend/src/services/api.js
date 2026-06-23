/**
 * Axios Instance — API Service
 * ----------------------------
 * - Base URL ஒரே இடத்துல set பண்றோம்
 * - Request போகும்போது localStorage-ல இருக்கற
 *   token-ஐ automatically header-ல attach பண்றோம்
 * - 401 error வந்தா auto logout பண்றோம்
 */

import axios from "axios";

// Axios instance — base URL மட்டும் மாத்தினா போதும்
const API = axios.create({
  baseURL: "http://localhost:8080",
});

/**
 * Request Interceptor
 * - API call போகும் முன்னாடி இந்த function run ஆகும்
 * - localStorage-ல token இருந்தா header-ல போடுவோம்
 */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Response Interceptor
 * - API response வரும்போது இந்த function run ஆகும்
 * - 401 (Unauthorized) வந்தா token clear பண்ணி login-க்கு அனுப்பு
 */
API.interceptors.response.use(
  (response) => response, // Success — as-is return பண்றோம்
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;