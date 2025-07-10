import axios from 'axios';
import { jwtDecode } from "jwt-decode";
const API_BASE = process.env.REACT_APP_API_BASE;
const AUTH_TOKEN = process.env.REACT_APP_AUTH_TOKEN;

const headers = {
  Authorization: `Bearer ${AUTH_TOKEN}`
};

//  Get user role from JWT token
const getUserRole = () => {
  try {
    const decoded = jwtDecode(AUTH_TOKEN);
    return decoded?.role || "USER"; // fallback
  } catch (err) {
    return "USER";
  }
};

// Auto route based on role
export const getDashboardFiles = async () => {
  const role = getUserRole();
  const endpoint = role === "ADMIN" ? "all" : "my";

  const response = await axios.get(`${API_BASE}/api/v1/files/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
  });

  return response.data;
};

export const getFiles = async () => {
  const res = await axios.get(`${API_BASE}/api/v1/files/list`, { headers });
  return res.data;
};

export const downloadFile = async (key) => {
  const response = await axios.get(`${API_BASE}/api/v1/files/download/${key}`, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`
    },
    responseType: "blob", // Important
  });

  // Create a download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", key);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const deleteFile = async (key) => {
  await axios.delete(`${API_BASE}/api/v1/files/delete/${key}`, { headers });
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  await axios.post(`${API_BASE}/api/v1/files/upload`, formData, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
      "Content-Type": "multipart/form-data"
    }
  });

};
