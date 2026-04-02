import { apiClient } from "./apiClient";

export const questApi = {
  getQuests: (filters) => apiClient.get("/quests", { query: filters }),
  getQuestById: (id) => apiClient.get(`/quests/${id}`),
  createQuest: (payload) => apiClient.post("/quests", payload),
  updateQuest: (id, payload) => apiClient.put(`/quests/${id}`, payload),
  deleteQuest: (id) => apiClient.delete(`/quests/${id}`),
};

