import axios from "axios";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

/**
 * Envía una pregunta al chatbot.
 * El backend espera: POST /chat/?pregunta=...
 */
export const sendMessage = (text, archivos = []) => {
  const params = new URLSearchParams();
  params.append("pregunta", text);
  archivos.forEach(a => params.append("archivos", a));
  
  return axios.post(`${BASE}/chat/`, null, { params });
};

/**
 * Sube y procesa un documento.
 * El backend espera: POST /ingestar/ con form-data field "file"
 */
export const uploadDocument = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`${BASE}/ingestar/`, formData);
};
