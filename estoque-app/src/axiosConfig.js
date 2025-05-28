// src/axiosConfig.js

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

// Adiciona dinamicamente o token antes de cada requisição
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default api;

// Esta função pode ser usada após o login para atualizar o token
export const setAuthToken = (novoToken) => {
  localStorage.setItem("token", novoToken); // Salva o novo token
  api.defaults.headers.Authorization = novoToken; // Atualiza a instância do Axios
};


