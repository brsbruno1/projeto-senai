// src/axiosConfig.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001", // ajuste se necessário
});

// Adiciona o token JWT em todas as requisições, se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Corrigido aqui!
  }
  return config;
});

export default api;


// Esta função pode ser usada após o login para atualizar o token
export const setAuthToken = (novoToken) => {
  localStorage.setItem("token", novoToken);
  api.defaults.headers.Authorization = `Bearer ${novoToken}`; // Corrigido aqui!
};


