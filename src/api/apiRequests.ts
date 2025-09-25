import { apiClient, authApiClient } from "./apiClient";
import { UploadResponse, AnalysisStatusResponse, AnalysisHistory } from "@/types/analysis";

export function registerUser(userData: any) {
  return apiClient.post("/auth/register", userData);
}

export function loginUser(email: string, password: string) {
  return apiClient.post("/auth/login", { email, password });
}

export function googleCallback(code: string) {
  const params = new URLSearchParams({ code });
  return apiClient.post(`/auth/google/callback?${params.toString()}`, code);
}

export function githubCallback(code: string) {
  const params = new URLSearchParams({ code });
  return apiClient.post(`/auth/github/callback?${params.toString()}`, { code });
}

export function linkedinCallback(code: string) {
  const params = new URLSearchParams({ code });
  return apiClient.post(`/auth/linkedin/callback?${params.toString()}`, { code });
}

export function getMyUserInfo() {
  return authApiClient.get("/users/me");
}

export function generateRandomTopics() {
  return authApiClient.post("/ai/generate-random-topics");
}

export function generateSpeechOnTopic(topic: any) {
  return authApiClient.post("/ai/generate-speech", topic);
}

// New async audio upload - returns immediately with request ID
export function uploadAudio(formData: FormData): Promise<{ data: UploadResponse }> {
  return authApiClient.post("/ai/upload-audio", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// Check analysis status by request ID
export function getAnalysisStatus(requestId: string): Promise<{ data: AnalysisStatusResponse }> {
  return authApiClient.get(`/ai/analysis/${requestId}`);
}

// Download full analysis results
export function downloadAnalysisResults(requestId: string): Promise<{ data: any }> {
  return authApiClient.get(`/ai/analysis/${requestId}/download`);
}

// Get analysis history with pagination
export function getAnalysisHistory(page: number = 0, size: number = 20): Promise<{ data: AnalysisHistory }> {
  return authApiClient.get(`/ai/analysis/history?page=${page}&size=${size}`);
}

// Legacy function for backward compatibility
export function loadRecentAnalysis() {
  return getAnalysisHistory(0, 10);
}

export function getLiveAnalysis(id: string) {
  return authApiClient.post(`/ai/analysis-report/${id}`);
}

export function getAnalysis(id: string) {
  return authApiClient.get(`/get-analysis/${id}`);
}

export function getAnalysisRequests() {
  return authApiClient.get(`/analysis-requests/`);
}

export function deleteRequest(id: string) {
  return authApiClient.delete(`/delete-request/${id}`);
}

export function generateRefinedSpeeches(speech: string) {
  return authApiClient.post("/ai/generate-rephrasals", speech)
}

export function transcribeAudio(formData: any) {
  return authApiClient.post("/ai/transcribe-audio", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}