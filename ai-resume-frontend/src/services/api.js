import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-resume-analyzer-production-6db5.up.railway.app", // ✅
});

export default API;