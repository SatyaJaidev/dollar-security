// lib/api.ts
// Centralized API service for all HTTP requests

import { getApiUrl } from "./config";

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = getApiUrl(endpoint);
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Chat API
export const chatAPI = {
  getMessages: () => apiRequest("/chat/messages"),
  sendMessage: (message: string) => 
    apiRequest("/chat/send-message", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
  reply: (replyToId: string, message: string) =>
    apiRequest("/chat/reply", {
      method: "POST",
      body: JSON.stringify({ replyToId, message }),
    }),
};

// Guards API
export const guardsAPI = {
  getAll: () => apiRequest("/guards"),
  create: (guardData: any) =>
    apiRequest("/guards", {
      method: "POST",
      body: JSON.stringify(guardData),
    }),
  update: (id: string, guardData: any) =>
    apiRequest(`/guards/${id}`, {
      method: "PUT",
      body: JSON.stringify(guardData),
    }),
  delete: (id: string) =>
    apiRequest(`/guards/${id}`, {
      method: "DELETE",
    }),
  submitFeedback: (feedbackData: any) =>
    apiRequest("/guards/submit-feedback", {
      method: "POST",
      body: JSON.stringify(feedbackData),
    }),
};

// Clients API
export const clientsAPI = {
  getAll: () => apiRequest("/clients"),
  create: (clientData: any) =>
    apiRequest("/clients", {
      method: "POST",
      body: JSON.stringify(clientData),
    }),
  update: (id: string, clientData: any) =>
    apiRequest(`/clients/${id}`, {
      method: "PUT",
      body: JSON.stringify(clientData),
    }),
  delete: (id: string) =>
    apiRequest(`/clients/${id}`, {
      method: "DELETE",
    }),
};

// Quotation API
export const quotationAPI = {
  getAll: () => apiRequest("/quotation-queries"),
  create: (queryData: any) =>
    apiRequest("/quotation-queries", {
      method: "POST",
      body: JSON.stringify(queryData),
    }),
  update: (id: string, status: string) =>
    apiRequest(`/quotation-queries/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};

// Analytics API
export const analyticsAPI = {
  getVisitors: () => apiRequest("/analytics/visitors"),
};

// Upload API
export const uploadAPI = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("document", file);
    
    const url = getApiUrl("/upload");
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },
}; 